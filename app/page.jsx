'use client';
import { RefreshIcon, SearchIcon } from '@/components/icons';
import RuesModal from '@/components/ruesModal';
import {
  baseUrl,
  myStakesQuery,
  receivedStakesQuery,
  rues,
} from '@/config/site';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Progress } from '@nextui-org/progress';
import { useDisclosure } from '@nextui-org/react';
import { Snippet } from '@nextui-org/snippet';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Web3 } from 'web3';
import { isAddress } from 'web3-validator';

const columns = [
  {
    key: 'staker',
    label: 'Wallet Address',
  },
  {
    key: 'youStaked',
    label: 'Your Stake',
  },
  {
    key: 'receivedStake',
    label: 'Received Stake',
  },
];

const myStakes = new Map();
const receivedStakes = new Map();

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [zekiler, setZekiler] = useState([]);
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

      const temp = [];

      for (let [staker, amount] of myStakes.entries()) {
        if (amount == 0) continue;

        const receivedStakedAmount = receivedStakes.get(staker);
        if (receivedStakedAmount === undefined) {
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
        }
      }

      setZekiler(temp);
    } catch (error) {
      console.log(error);
    } finally {
      if (isRuesStaked === false) {
        onOpen();
      }
      setIsLoading(false);
    }
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case 'receivedStake':
      case 'youStaked':
        return (
          <div className="text-[#7071E8] font-mono">{cellValue} $MAND</div>
        );
      case 'staker':
        return (
          <Snippet
            className="bg-transparent text-sm text-[#7071E8]"
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

      <Table
        aria-label=""
        isStriped
        isHeaderSticky
        topContent={
          <Button
            isIconOnly
            className="self-end bg-transparent"
            onClick={sendQueries}
          >
            <RefreshIcon />
          </Button>
        }
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align="center">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={zekiler}
          emptyContent={'No address found'}
          isLoading={isLoading}
          loadingContent={
            <Progress size="sm" isIndeterminate className="w-1/6" />
          }
        >
          {(item) => (
            <TableRow key={item.staker}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
