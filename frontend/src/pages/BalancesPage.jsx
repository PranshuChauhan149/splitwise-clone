import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { groupApi, balanceApi } from "../services/apiService.js";
import BalanceCard from "../components/BalanceCard.jsx";

const BalancesPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const [groupResponse, balanceResponse] = await Promise.all([
          groupApi.getGroupById(groupId),
          balanceApi.getGroupBalances(groupId),
        ]);

        setGroup(groupResponse.data.data.group);
        const fetchedBalances = balanceResponse?.data?.data?.balances;
        const normalizedBalances = Array.isArray(fetchedBalances)
          ? fetchedBalances
          : Array.isArray(fetchedBalances?.balances)
          ? fetchedBalances.balances
          : [];
        setBalances(normalizedBalances);
      } catch (err) {
        setError(err.error || err.message || "Unable to load balances.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [groupId]);

  const safeBalances = Array.isArray(balances) ? balances : [];
  const memberBalances = safeBalances.length
    ? safeBalances
    : group?.memberships?.map((membership) => ({
        user: membership.user,
        balance: 0,
      })) || [];

  const totalOwed = memberBalances
    .filter((item) => item.balance < 0)
    .reduce((sum, item) => sum + item.balance, 0);
  const totalOwing = memberBalances
    .filter((item) => item.balance > 0)
    .reduce((sum, item) => sum + item.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Balances</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{group?.name || "Group balances"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Review who owes whom and where the group stands.</p>
        </div>
        <Link
          to={`/groups/${groupId}/expenses`}
          className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          View expenses
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading balances...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <BalanceCard title="Total owed" amount={Math.abs(totalOwed)} subtitle="Amount you owe others" accent="bg-rose-100 text-rose-700" />
              <BalanceCard title="Total owing" amount={totalOwing} subtitle="Amount others owe you" accent="bg-emerald-100 text-emerald-700" />
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Group balances</h2>
              <div className="mt-4 space-y-3">
                {memberBalances.map((item) => (
                  <div key={item.user.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.user.name}</p>
                      <p className="text-sm text-slate-500">{item.user.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${item.balance >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      ${item.balance.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Who owes whom</h2>
            <div className="space-y-3">
              {balances.length === 0 ? (
                <p className="text-sm text-slate-500">No balances to show yet.</p>
              ) : (
                balances.map((item) => (
                  <div key={item.user.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{item.user.name}</p>
                    <p className={`mt-2 text-lg font-semibold ${item.balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {item.balance >= 0 ? `Owes you $${item.balance.toFixed(2)}` : `You owe $${Math.abs(item.balance).toFixed(2)}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default BalancesPage;
