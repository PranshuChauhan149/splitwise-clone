import { Link } from "react-router-dom";

const ExpenseCard = ({ expense, groupId }) => {
  const amount = Number(expense.amount).toFixed(2);
  const date = new Date(expense.createdAt).toLocaleDateString();

  return (
    <li className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{expense.title}</h3>
          <p className="mt-2 text-sm text-slate-500">Paid by {expense.paidBy?.name || "Unknown"}</p>
          <p className="text-sm text-slate-500">{date}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {expense.splitType}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
            ${amount}
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">{expense.description || "No description provided."}</p>
        <Link
          to={`/groups/${groupId}/expenses/${expense.id}`}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          View details
        </Link>
      </div>
    </li>
  );
};

export default ExpenseCard;
