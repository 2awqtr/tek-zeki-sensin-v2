'use client';
import StakeTable from '@/components/table';
import { Tab, Tabs } from '@nextui-org/react';
// Pending Stakes beni bekleyenler
// Unreturned Stakes zekiler

export default function StakeTabs({
  unreturnedStakes,
  pendingStakes,
  isLoading,
  sendQueries,
}) {
  return (
    <div className="w-full full flex flex-col items-center justify-center">
      <Tabs aria-label="Stake tabs">
        <Tab
          key="unreturned"
          title="Unreturned Stakes"
          className="w-full h-full"
        >
          <StakeTable
            tab={'unreturned'}
            isLoading={isLoading}
            items={unreturnedStakes}
            sendQueries={sendQueries}
          />
        </Tab>
        <Tab key="pending" title="Pending Stakes" className="w-full h-full">
          <StakeTable
            tab={'pending'}
            isLoading={isLoading}
            items={pendingStakes}
            sendQueries={sendQueries}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
