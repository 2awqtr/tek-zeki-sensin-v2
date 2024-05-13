import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { SearchIcon } from '@/components/icons';
import StakeTable from '@/components/table';
import axios from 'axios';
import { Web3 } from 'web3';
import { isAddress } from 'web3-validator';
import { baseUrl, myStakesQuery, receivedStakesQuery, rues } from '@/config/site';

const MyComponent = () => {
  const [wallet, setWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreturnedStakes, setUnreturnedStakes] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);

  const sendQueries = async () => {
    if (wallet === '') {
      return;
    }

    if (!isAddress(wallet)) {
      setIsInvalid(true);
      return;
    }

    setIsLoading(true);
    try {
      const res1 = await axios.post(baseUrl, {
        operationName: 'GetStakesSent',
        query: myStakesQuery,
        variables: { address: wallet },
      });

      const myStakes = res1.data.data.stakes.map((stake) => ({
        amount: Number.parseFloat(Web3.utils.fromWei(stake.amount, 'ether')),
        staker: stake.candidate.id,
      }));

      const res2 = await axios.post(baseUrl, {
        operationName: 'GetStakesReceived',
        query: receivedStakesQuery,
        variables: { address: wallet },
      });

      const receivedStakes = res2.data.data.stakes.map((stake) => ({
        amount: Number.parseFloat(Web3.utils.fromWei(stake.amount, 'ether')),
        staker: stake.staker.id,
      }));

      const unreturned = myStakes.filter((myStake) => {
        const receivedStake = receivedStakes.find((r) => r.staker === myStake.staker);
        return !receivedStake || myStake.amount > receivedStake.amount;
      });

      setUnreturnedStakes(unreturned);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Input
        placeholder="Enter your wallet address"
        errorMessage="Please enter a valid address"
        isInvalid={isInvalid}
        endContent={
          <Button isIconOnly onClick={sendQueries}>
            <SearchIcon />
          </Button>
        }
        onChange={(e) => {
          const address = e.target.value.trim();
          if (address === '') {
            setIsInvalid(false);
            return;
          }
          setWallet(address);
        }}
      />
      <StakeTable isLoading={isLoading} items={unreturnedStakes} />
    </div>
  );
};

export default MyComponent;
