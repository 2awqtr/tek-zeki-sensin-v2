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

const myStakesMap = new Map();
const receivedStakesMap = new Map();

export default function Home() {
  const [wallet1, setWallet1] = useState('');
  const [wallet2, setWallet2] = useState('');
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [unreturnedStakes1, setUnreturnedStakes1] = useState([]);
  const [unreturnedStakes2, setUnreturnedStakes2] = useState([]);
  const [isInvalid1, setIsInvalid1] = useState(false);
  const [isInvalid2, setIsInvalid2] = useState(false);

  const sendQueries = async (wallet, setIsLoading, setUnreturnedStakes, setIsInvalid) => {
    if (wallet === '') {
      return;
    }

    if (!isAddress(wallet)) {
      setIsInvalid(true);
      return;
    }

    const myStakes = myStakesMap.get(wallet) || new Map();
    const receivedStakes = receivedStakesMap.get(wallet) || new Map();

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

      setUnreturnedStakes(unreturned);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
const sendQuerieseftay = async (wallet, setIsLoading, setUnreturnedStakes, setIsInvalid) => {
        if (wallet === '') {
      return;
    }

    if (!isAddress(wallet)) {
      setIsInvalid(true);
      return;
    }

    const myStakes = myStakesMap.get(wallet) || new Map();
    const receivedStakes = receivedStakesMap.get(wallet) || new Map();

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
            if (staker === rues && amount >= 1) {
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

      // receivedStakes'teki her staker için myStakes'teki karşılık gelen her staker'ın miktarından büyük olan staker'ları listeleme
      for (let [staker, amount] of receivedStakes.entries()) {
        if (amount == 0) continue;

        const myStakedAmount = myStakes.get(staker);
        if (myStakedAmount === undefined || myStakedAmount < amount) {
          unreturned.push({
            staker: staker,
            youStaked: myStakedAmount || 0,
            receivedStake: amount,
          });
        }
      }

      setUnreturnedStakes(unreturned);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch1 = () => {
    sendQueries(wallet1, setIsLoading1, setUnreturnedStakes1, setIsInvalid1);
  };

  const handleSearch2 = () => {
    sendQuerieseftay(wallet2, setIsLoading2, setUnreturnedStakes2, setIsInvalid2);
  };

  return (
    <div className="w-full flex flex-col justify-center items-start gap-10">
      <div className="flex w-full items-center justify-center gap-2">
        <Input
          isInvalid={isInvalid1}
          placeholder="Enter wallet address 1"
          errorMessage="Please enter valid address"
          endContent={
            <Button
              className="bg-transparent hover:bg-transparent"
              isIconOnly
              onClick={handleSearch1}
            >
              <SearchIcon />
            </Button>
          }
          onChange={(e) => {
            const address = e.target.value.trim();
            if (address === '') {
              setIsInvalid1(false);
              return;
            }
            setWallet1(address);
          }}
        />
        <Input
          isInvalid={isInvalid2}
          placeholder="Enter wallet address 2"
          errorMessage="Please enter valid address"
          endContent={
            <Button
              className="bg-transparent hover:bg-transparent"
              isIconOnly
              onClick={handleSearch2}
            >
              <SearchIcon />
            </Button>
          }
          onChange={(e) => {
            const address = e.target.value.trim();
            if (address === '') {
              setIsInvalid2(false);
              return;
            }
            setWallet2(address);
          }}
        />
      </div>
      <div className="w-full flex items-center justify-center text-amber-300">
        <p className="text-sans text-sm">
          <span className="font-bold text-amber-600">Attention:</span> This
          table only shows the addresses that do not mutually stake with you.
        </p>
      </div>

      <StakeTable
        isLoading={isLoading1}
        items={unreturnedStakes1}
        sendQueries={handleSearch1}
      />
      <StakeTable
        isLoading={isLoading2}
        items={unreturnedStakes2}
        sendQueries={handleSearch2}
      />
    </div>
  );
}
