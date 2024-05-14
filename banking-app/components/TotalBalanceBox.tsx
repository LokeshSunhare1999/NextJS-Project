import AnimatedCounter from "./AnimatedCounter";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <div className="total-balance">
      <div className="total-balance-chart">{/* DoughnutChart */}</div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <p className="total-balance-amount flex-center">
            <AnimatedCounter amount={totalCurrentBalance} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalBalanceBox;
