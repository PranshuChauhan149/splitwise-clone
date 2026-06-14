import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { balanceApi, expenseApi, groupApi, settlementApi } from "../services/apiService.js";
import BalanceCard from "../components/BalanceCard.jsx";

const DashboardPage = () => {
  const [summary, setSummary] = useState({ total: 0 });
  const [groups, setGroups] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentSettlements, setRecentSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const [balanceResponse, groupResponse, settlementResponse] = await Promise.all([
          balanceApi.getBalanceSummary(),
          groupApi.getGroups(),
          settlementApi.getMySettlements(),
        ]);

        const groupsData = groupResponse.data.data.groups || [];
        setSummary(balanceResponse.data.data.summary || { total: 0 });
        setGroups(groupsData);
        setRecentSettlements(settlementResponse.data.data.settlements || []);

        const expenseResponses = await Promise.all(
          groupsData.map((group) => expenseApi.getGroupExpenses(group.id)),
        );

        const expenses = expenseResponses
          .flatMap((response, index) => {
            const group = groupsData[index];
            return (response.data.data.expenses || []).map((expense) => ({
              ...expense,
              groupName: group.name,
              groupId: group.id,
            }));
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRecentExpenses(expenses.slice(0, 5));
      } catch (err) {
        setError(err.error || err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your split overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">See your balances, recent activity, and group summaries.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/groups" className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Manage groups
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BalanceCard
          title="Net balance"
          amount={summary.total}
          subtitle="Your overall balance across all groups"
          accent={summary.total >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}
        />
        <BalanceCard title="Groups" amount={groups.length} subtitle="Groups you're active in" accent="bg-slate-100 text-slate-700" />
        <BalanceCard title="Recent settlements" amount={recentSettlements.length} subtitle="Latest payments recorded" accent="bg-sky-100 text-sky-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent expenses</h2>
              <p className="mt-2 text-sm text-slate-500">Activity from your groups in the last few days.</p>
            </div>
            <Link to="/groups" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
              View all groups
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">No recent expenses yet.</div>
          ) : (
            <ul className="grid gap-4">
              {recentExpenses.map((expense) => (
                <li key={expense.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{expense.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{expense.groupName}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">${Number(expense.amount).toFixed(2)}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Paid by {expense.paidBy?.name || "Unknown"}</span>
                    <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent settlements</h2>
            <p className="mt-2 text-sm text-slate-500">Payments you made or received recently.</p>
          </div>
          {recentSettlements.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">No recent settlements.</div>
          ) : (
            <div className="space-y-4">
              {recentSettlements.slice(0, 5).map((settlement) => (
                <div key={settlement.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{settlement.fromUser.name} paid {settlement.toUser.name}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>${Number(settlement.amount).toFixed(2)}</span>
                    <span>{new Date(settlement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
