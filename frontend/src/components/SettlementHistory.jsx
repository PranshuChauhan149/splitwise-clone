const SettlementHistory = ({ settlements = [] }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Settlement history</h2>
      {settlements.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No settlements recorded yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {settlements.map((settlement) => {
            const fromName = settlement.fromUser?.name || "Unknown";
            const toName = settlement.toUser?.name || "Unknown";
            return (
              <div key={settlement.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{settlement.note || "Payment recorded"}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {fromName} paid {toName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">${Number(settlement.amount).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{new Date(settlement.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SettlementHistory;
