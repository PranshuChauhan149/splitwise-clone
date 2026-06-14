import { useEffect, useState } from "react";

const SettlementForm = ({ members, onSubmit, isSubmitting, error }) => {
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (members.length > 0) {
      setFromUserId(members[0]?.user.id || "");
    }
    if (members.length > 1) {
      setToUserId(members[1]?.user.id || "");
    }
  }, [members]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit({ fromUserId, toUserId, amount, note });
  };

  return (
    <form className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-slate-900">Record a payment</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Paid by
          <select
            value={fromUserId}
            onChange={(event) => setFromUserId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          >
            {members.map((membership) => (
              <option key={membership.user.id} value={membership.user.id}>
                {membership.user.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Received by
          <select
            value={toUserId}
            onChange={(event) => setToUserId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          >
            {members.map((membership) => (
              <option key={membership.user.id} value={membership.user.id}>
                {membership.user.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="0.00"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Note
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="Optional note"
          />
        </label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting || fromUserId === toUserId}
        className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Recording settlement..." : "Record payment"}
      </button>
    </form>
  );
};

export default SettlementForm;
