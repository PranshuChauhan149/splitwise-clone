import { useEffect, useMemo, useState } from "react";
import { expenseApi } from "../services/apiService.js";

const splitOptions = [
  { value: "EQUAL", label: "Equal split" },
  { value: "UNEQUAL", label: "Unequal amounts" },
  { value: "PERCENTAGE", label: "Percentage split" },
  { value: "SHARE", label: "Share units" },
];

const CreateExpenseModal = ({ groupId, members, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [splitType, setSplitType] = useState("EQUAL");
  const [splits, setSplits] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (members.length) {
      setPaidById((prev) => prev || members[0].user.id);
      setSplits(members.map((membership) => ({
        userId: membership.user.id,
        amount: "",
        percentage: "",
        share: "",
      })));
    }
  }, [members]);

  const splitField = useMemo(() => {
    if (splitType === "UNEQUAL") return "amount";
    if (splitType === "PERCENTAGE") return "percentage";
    if (splitType === "SHARE") return "share";
    return null;
  }, [splitType]);

  const getSplitLabel = (field) => {
    if (field === "amount") return "Amount";
    if (field === "percentage") return "Percentage";
    if (field === "share") return "Share";
    return "Value";
  };

  const handleSplitChange = (userId, field, value) => {
    setSplits((current) =>
      current.map((split) =>
        split.userId === userId ? { ...split, [field]: value } : split,
      ),
    );
  };

  const validateSplitValues = () => {
    if (splitType === "EQUAL") return null;

    const values = splits.map((split) => ({
      userId: split.userId,
      value: splitField === "amount" ? Number(split.amount) : Number(split[splitField]),
    }));

    if (values.some((item) => Number.isNaN(item.value) || item.value <= 0)) {
      return `${getSplitLabel(splitField)} values must be positive numbers for all participants.`;
    }

    const total = values.reduce((sum, item) => sum + item.value, 0);

    if (splitType === "UNEQUAL" && parseFloat(total.toFixed(2)) !== parseFloat(Number(amount).toFixed(2))) {
      return "Unequal split amounts must add up to the total amount.";
    }

    if (splitType === "PERCENTAGE" && parseFloat(total.toFixed(2)) !== 100) {
      return "Percentage split totals must equal 100.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Expense title is required.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    if (!paidById) {
      setError("Please select who paid for this expense.");
      return;
    }

    const splitError = validateSplitValues();
    if (splitError) {
      setError(splitError);
      return;
    }

    const payload = {
      groupId,
      title: title.trim(),
      description: description.trim(),
      amount: parsedAmount,
      paidById,
      splitType,
    };

    if (splitType !== "EQUAL") {
      payload.splits = splits.map((split) => ({
        userId: split.userId,
        amount: splitType === "UNEQUAL" ? Number(split.amount) : undefined,
        percentage: splitType === "PERCENTAGE" ? Number(split.percentage) : undefined,
        share: splitType === "SHARE" ? Number(split.share) : undefined,
      }));
    }

    try {
      setIsSubmitting(true);
      const response = await expenseApi.createExpense(payload);
      onCreated(response.data.data.expense);
    } catch (err) {
      setError(err.error || err.message || "Unable to create expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Create expense</h2>
            <p className="mt-1 text-sm text-slate-500">Add a new expense and split it among group members.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-700">Close</button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Title
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Dinner, taxi, utilities"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="100.00"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Paid by
              <select
                value={paidById}
                onChange={(event) => setPaidById(event.target.value)}
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
              Split type
              <select
                value={splitType}
                onChange={(event) => setSplitType(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                {splitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              rows="3"
              placeholder="Optional note for the expense"
            />
          </label>

          {splitField && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{splitOptions.find((option) => option.value === splitType)?.label}</p>
              <p className="mt-2 text-sm text-slate-500">
                Enter {getSplitLabel(splitField).toLowerCase()} values for each member to build the split.
              </p>
              <div className="mt-4 space-y-3">
                {members.map((membership) => {
                  const split = splits.find((item) => item.userId === membership.user.id) || {};
                  return (
                    <div key={membership.user.id} className="grid gap-3 sm:grid-cols-[1.2fr_1fr] sm:items-center">
                      <label className="block text-sm font-medium text-slate-700">
                        {membership.user.name}
                        <input
                          type={splitField === "percentage" ? "number" : "text"}
                          min="0"
                          step={splitField === "amount" ? "0.01" : "1"}
                          value={split[splitField]}
                          onChange={(event) => handleSplitChange(membership.user.id, splitField, event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          placeholder={splitField === "percentage" ? "35" : "0"}
                          required
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving expense..." : "Create expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpenseModal;
