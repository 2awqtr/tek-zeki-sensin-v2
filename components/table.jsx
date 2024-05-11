'use client';
import { RefreshIcon } from '@/components/icons';
import { Button } from '@nextui-org/button';
import { Progress } from '@nextui-org/progress';
import { Snippet } from '@nextui-org/snippet';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { useCallback } from 'react';

const unreturnedColumns = [
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

export default function StakeTable({ sendQueries, isLoading, items }) {
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

  return (
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
      <TableHeader columns={unreturnedColumns}>
        {(column) => (
          <TableColumn key={column.key} align="center">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={items}
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
  );
}
