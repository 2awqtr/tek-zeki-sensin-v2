'use client';
import { SearchIcon } from '@/components/icons';
import StakeTable from '@/components/table';
import {
  baseUrl,
  myStakesQuery,
  receivedStakesQuery,
} from '@/config/site';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import axios from 'axios';
import { useState } from 'react';
import { Web3 } from 'web3';
import { isAddress } from 'web3-validator';

const myStakes = new Map();
const receivedStakes = new Map();

export default function Home() {
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

    myStakes.clear();
    receivedStakes.clear();
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

     for (let [staker, amount] of receivedStakes.entries()) {
  if (amount == 0) continue;

  const myStakedAmount = myStakes.get(staker);
  if (
    myStakedAmount === undefined ||
    amount > myStakedAmount
  ) {
    unreturned.push({
      staker: staker,
      youStaked: myStakedAmount || 0,
      receivedStake: amount,
    });
  }
}


      // const pending = [];
      // for (let [staker, amount] of receivedStakes.entries()) {
      //   if (amount == 0) continue;

      //   const myStakedAmount = myStakes.get(staker);
      //   if (myStakedAmount === undefined || myStakedAmount < amount) {
      //     pending.push({
      //       staker: staker,
      //       youStaked: myStakedAmount || 0,
      //       receivedStake: amount,
      //     });
      //   }
      // }

      setUnreturnedStakes(unreturned);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-start gap-10">
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
      <div className="w-full flex items-center justify-center text-amber-300">
        <p className="text-sans text-sm">
          <span className="font-bold text-amber-600">Attention:</span> This
          table only shows the adresses that does not mutually stake with you..
        </p>
      </div>

      <StakeTable
        isLoading={isLoading}
        items={unreturnedStakes}
        sendQueries={sendQueries}
      />
    </div>
  );
}
