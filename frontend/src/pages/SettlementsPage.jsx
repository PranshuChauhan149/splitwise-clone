import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { balanceApi, groupApi, settlementApi } from "../services/apiService.js";
import BalanceCard from "../components/BalanceCard.jsx";
import SettlementForm from "../components/SettlementForm.jsx";
import SettlementHistory from "../components/SettlementHistory.jsx";

const SettlementsPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupResponse, settlementResponse, summaryResponse] = await Promise.all([
          groupApi.getGroupById(groupId),
          settlementApi.getGroupSettlements(groupId),
          balanceApi.getBalanceSummary(),
        ]);

        setGroup(groupResponse.data.data.group);
        setMembers(groupResponse.data.data.group.memberships || []);
        setSettlements(settlementResponse.data.data.settlements || []);
        setSummary(summaryResponse.data.data.summary || null);
      } catch (err) {
        setError(err.error || err.message || "Unable to load settlements.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleSubmit = async (payload) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await settlementApi.createSettlement({ groupId, ...payload });
      setSettlements((current) => [response.data.data.settlement, ...current]);
    } catch (err) {
      setError(err.error || err.message || "Unable to save settlement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const personalBalance = summary?.groups?.find((item) => item.groupId === groupId)?.balance ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Settlements</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{group?.name || "Settlements"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Record payments and view the payment history for this group.</p>
        </div>
        <Link
          to={`/groups/${groupId}/balances`}
          className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          View balances
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading settlements...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <BalanceCard title="Group balance" amount={personalBalance} subtitle="Your position in this group" accent={personalBalance >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"} />
              <BalanceCard title="Recent settlements" amount={settlements.length} subtitle="Payments recorded" accent="bg-slate-100 text-slate-700" />
            </div>
            <SettlementForm
              members={members}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          </section>
          <aside className="space-y-6">
            <SettlementHistory settlements={settlements} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default SettlementsPage;
