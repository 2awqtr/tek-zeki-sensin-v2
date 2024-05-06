'use client';
import { SearchIcon } from '@/components/icons';
import { baseUrl, myStakesQuery, receivedStakesQuery } from '@/config/site';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Snippet } from '@nextui-org/snippet';
import { Spinner } from '@nextui-org/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';

import axios from 'axios';
import { useCallback, useState } from 'react';

const columns = [
  {
    key: 'staker',
    label: 'Wallet Address',
  },
  {
    key: 'youStaked',
    label: 'Staked',
  },
  {
    key: 'receivedStake',
    label: 'Received Staked',
  },
];

const myStakes = new Map();
const receivedStakes = new Map();

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [zekiler, setZekiler] = useState([]);

  const sendQueries = async () => {
    if (wallet === '') {
      return;
    }

    myStakes.clear();
    receivedStakes.clear();
    setZekiler([]);
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
            const amount = Number.parseInt(stake.amount.slice(0, 1), 10);
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
            const amount = Number.parseInt(stake.amount.slice(0, 1), 10);
            const staker = stake.staker.id;
            receivedStakes.set(staker, amount);
          });
        });

      const temp = [];

      for (let [staker, amount] of myStakes.entries()) {
        if (amount == 0) continue;

        const receivedStakedAmount = receivedStakes.get(staker);
        if (receivedStakedAmount === undefined) {
          console.log(`${staker} stake etmemiş`);
          temp.push({
            staker: staker,
            youStaked: amount,
            receivedStake: receivedStakedAmount || 0,
          });
          continue;
        }

        if (amount > receivedStakedAmount) {
          temp.push({
            staker: staker,
            youStaked: amount,
            receivedStake: receivedStakedAmount || 0,
          });
          console.log(`${staker} ile stake edilen miktar aynı değil`);
        }
      }

      setZekiler(temp);
      console.log('fnsh');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case 'receivedStake':
      case 'youStaked':
        return <div className="text-[#7071E8]">{cellValue} $MAND</div>;
      case 'staker':
        return (
          <Snippet
            className="bg-transparent text-[#7071E8]"
            symbol=""
            size="sm"
          >
            {cellValue}
          </Snippet>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-start gap-10">
      <div className="flex w-full items-center gap-2">
        <Input
          color="secondary"
          placeholder="Enter your wallet address"
          onChange={(e) => setWallet(e.target.value)}
        ></Input>
        <Button
          className="bg-transparent hover:bg-slate-600"
          isIconOnly
          onClick={sendQueries}
        >
          <SearchIcon className="text-purple-600" />
        </Button>
      </div>

      <div className="w-full flex items-center justify-center">
        {isLoading && <Spinner label="Az biraz bekle amk" color="danger" />}
        {zekiler.length > 0 && (
          <Table aria-label="">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={zekiler}>
              {(item) => (
                <TableRow key={item.staker}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
