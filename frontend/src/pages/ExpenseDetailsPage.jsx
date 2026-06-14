import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { expenseApi } from "../services/apiService.js";
import ExpenseChat from "../components/ExpenseChat.jsx";

const ExpenseDetailsPage = () => {
  const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const response = await expenseApi.getExpenseById(expenseId);
        setExpense(response.data.data.expense);
      } catch (err) {
        setError(err.error || err.message || "Unable to load expense details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading expense details...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
    );
  }

  if (!expense) {
    return null;
  }

  const amount = Number(expense.amount).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Expense details</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{expense.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Review the split details and payment history for this expense.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
          <Link
            to={`/groups/${groupId}/expenses`}
            className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            All expenses
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total amount</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">${amount}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Split type</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{expense.splitType}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
            <p className="mt-3 text-sm text-slate-600">Paid by {expense.paidBy?.name || "Unknown"}</p>
            <p className="mt-2 text-sm text-slate-500">{expense.description || "No description provided."}</p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Split breakdown</h2>
            <div className="mt-4 space-y-3">
              {expense.splits.map((split) => (
                <div key={split.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[1.3fr_0.7fr] sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{split.user?.name || "Unknown"}</p>
                    <p className="text-sm text-slate-500">{split.user?.email}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="text-lg font-semibold text-slate-900">${Number(split.amount).toFixed(2)}</p>
                    {split.percentage != null && (
                      <p className="text-xs text-slate-500">{split.percentage}%</p>
                    )}
                    {split.share != null && (
                      <p className="text-xs text-slate-500">Share units: {split.share}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Expense summary</h2>
            <p className="mt-3 text-sm text-slate-600">This expense is stored by group and can be managed only by group members.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Recorded at</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{new Date(expense.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Expense ID</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-900">{expense.id}</p>
          </div>
        </aside>
      </div>
      <div className="mt-6">
        <ExpenseChat expenseId={expense.id} currentUserId={currentUser?.id} />
      </div>
    </div>
  );
};

export default ExpenseDetailsPage;
