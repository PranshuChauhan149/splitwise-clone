import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { expenseApi, groupApi } from "../services/apiService.js";
import ExpenseCard from "../components/ExpenseCard.jsx";
import CreateExpenseModal from "../components/CreateExpenseModal.jsx";

const ExpensesPage = () => {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const [expenseResponse, groupResponse] = await Promise.all([
          expenseApi.getGroupExpenses(groupId),
          groupApi.getGroupById(groupId),
        ]);

        setExpenses(expenseResponse.data.data.expenses || []);
        setGroup(groupResponse.data.data.group || null);
      } catch (err) {
        setError(err.error || err.message || "Unable to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [groupId]);

  const handleExpenseCreated = (expense) => {
    setExpenses((current) => [expense, ...current]);
    setShowCreateModal(false);
  };

  const members = group?.memberships || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Expenses</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{group?.name || "Group expenses"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Track all group expenses and manage how each cost is shared.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/groups/${groupId}`}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to group
          </Link>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add expense
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading expenses...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="space-y-6">
          {expenses.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">
              No expenses recorded yet for this group.
            </div>
          ) : (
            <ul className="grid gap-6 xl:grid-cols-2">
              {expenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} groupId={groupId} />
              ))}
            </ul>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateExpenseModal
          groupId={groupId}
          members={members}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleExpenseCreated}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
