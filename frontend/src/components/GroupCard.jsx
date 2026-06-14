import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
  return (
    <li className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{group.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{group.description || "No description provided."}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {group.memberships?.length ?? 0} members
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          to={`/groups/${group.id}`}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          View details
        </Link>
      </div>
    </li>
  );
};

export default GroupCard;
