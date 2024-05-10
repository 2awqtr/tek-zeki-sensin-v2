'use client';
import { SearchIcon } from '@/components/icons';
import RuesModal from '@/components/ruesModal';
import StakeTabs from '@/components/tabs';
import {
  baseUrl,
  myStakesQuery,
  receivedStakesQuery,
  rues,
} from '@/config/site';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Web3 } from 'web3';
import { isAddress } from 'web3-validator';

const myStakes = new Map();
const receivedStakes = new Map();

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreturnedStakes, setUnreturnedStakes] = useState([]);
  const [pendingStakes, setPendingStakes] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const sendQueries = async () => {
    let isRuesStaked = false;

    if (wallet === '') {
      return;
    }

    if (!isAddress(wallet)) {
      setIsInvalid(true);
      return;
    }

    myStakes.clear();
    receivedStakes.clear();
    setPendingStakes([]);
    setUnreturnedStakes([]);
    setIsLoading(true);

    try {
      await axios
        .post(baseUrl, {
          operationName: 'GetStakesSent',
          query: myStakesQuery,
          variables: {
            address: wallet,
          },
        })
        .then((res) => {
          res.data.data.stakes.forEach((stake) => {
            const amount = Number.parseFloat(
              Web3.utils.fromWei(stake.amount, 'ether')
            );
            const staker = stake.candidate.id;
            if (staker === rues && amount >= 1) {
              isRuesStaked = true;
              return;
            }
            myStakes.set(staker, amount);
          });
        });

      await axios
        .post(baseUrl, {
          operationName: 'GetStakesSent',
          query: receivedStakesQuery,
          variables: {
            address: wallet,
          },
        })
        .then((res) => {
          res.data.data.stakes.forEach((stake) => {
            const amount = Number.parseFloat(
              Web3.utils.fromWei(stake.amount, 'ether')
            );
            const staker = stake.staker.id;
            receivedStakes.set(staker, amount);
          });
        });

      const unreturned = [];

      for (let [staker, amount] of myStakes.entries()) {
        if (amount == 0) continue;

        const receivedStakedAmount = receivedStakes.get(staker);
        if (
          receivedStakedAmount === undefined ||
          amount > receivedStakedAmount
        ) {
          unreturned.push({
            staker: staker,
            youStaked: amount,
            receivedStake: receivedStakedAmount || 0,
          });
        }
      }

      const pending = [];
      for (let [staker, amount] of receivedStakes.entries()) {
        if (amount == 0) continue;

        const myStakedAmount = myStakes.get(staker);
        if (myStakedAmount === undefined || myStakedAmount < amount) {
          pending.push({
            staker: staker,
            youStaked: myStakedAmount || 0,
            receivedStake: amount,
          });
        }
      }

      setUnreturnedStakes(unreturned);
      setPendingStakes(pending);
    } catch (error) {
      console.log(error);
    } finally {
      if (isRuesStaked === false) {
        onOpen();
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-start gap-10">
      <RuesModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
      <div className="flex w-full items-center justify-center gap-2">
        <Input
          isInvalid={isInvalid}
          placeholder="Enter your wallet address"
          errorMessage="Please enter valid address"
          endContent={
            <Button
              className="bg-transparent hover:bg-transparent"
              isIconOnly
              onClick={sendQueries}
            >
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
        ></Input>
      </div>

      <StakeTabs
        pendingStakes={pendingStakes}
        unreturnedStakes={unreturnedStakes}
        isLoading={isLoading}
        sendQueries={sendQueries}
      />
    </div>
  );
}
