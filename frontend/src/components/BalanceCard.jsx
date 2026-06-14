const BalanceCard = ({ title, amount, subtitle, children, accent }) => {
  const isNegative = amount < 0;
  const formatted = typeof amount === "number" ? amount.toFixed(2) : amount;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">${formatted}</p>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        {accent && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${accent}`}>{accent.replace("bg-", "").replace("text-", "")}</span>
        )}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
};

export default BalanceCard;
