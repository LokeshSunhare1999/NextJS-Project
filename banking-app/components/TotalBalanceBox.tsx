import React from "react";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <div className="total-balance">
      <div className="total-balance-chart">DoughnutChart</div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
      </div>
    </div>
  );
};

export default TotalBalanceBox;
