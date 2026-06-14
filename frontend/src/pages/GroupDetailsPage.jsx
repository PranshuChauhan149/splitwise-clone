import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { groupApi } from "../services/apiService.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await groupApi.getGroupById(groupId);
        setGroup(response.data.data.group);
      } catch (err) {
        setError(err.error || err.message || "Unable to load group details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const totalMembers = group?.memberships?.length || 0;
  const adminCount = useMemo(
    () => group?.memberships?.filter((membership) => membership.role === "ADMIN").length || 0,
    [group],
  );

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError(null);

    if (!memberEmail.trim()) {
      setError("Member email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await groupApi.addGroupMember(groupId, {
        email: memberEmail.trim(),
        role: memberRole,
      });
      setGroup((prev) => ({
        ...prev,
        memberships: [...(prev?.memberships || []), response.data.data.membership],
      }));
      setMemberEmail("");
      setMemberRole("MEMBER");
    } catch (err) {
      setError(err.error || err.message || "Unable to add member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = (membership) => {
    setConfirmation({ membership });
  };

  const confirmRemove = async () => {
    if (!confirmation) return;

    try {
      await groupApi.removeGroupMember(groupId, confirmation.membership.userId);
      setGroup((prev) => ({
        ...prev,
        memberships: prev.memberships.filter((item) => item.userId !== confirmation.membership.userId),
      }));
    } catch (err) {
      setError(err.error || err.message || "Unable to remove member.");
    } finally {
      setConfirmation(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Group details</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{group?.name || "Group details"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">View group membership, roles, and statistics for this group.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/groups" className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Back to groups
          </Link>
          <Link to={`/groups/${groupId}/balances`} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            View balances
          </Link>
          <Link to={`/groups/${groupId}/settlements`} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            View settlements
          </Link>
          <Link to={`/groups/${groupId}/expenses`} className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
            View expenses
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading group details...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : group ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Group information</h2>
              <p className="mt-3 text-sm text-slate-600">{group.description || "No group description available."}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Total members</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalMembers}</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Admins</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{adminCount}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Members</h3>
              <div className="mt-4 space-y-3">
                {group.memberships.map((membership) => (
                  <div key={membership.userId} className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{membership.user.name}</p>
                      <p className="text-sm text-slate-500">{membership.user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        {membership.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(membership)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add member</h2>
              <p className="mt-2 text-sm text-slate-600">Invite a new member to this group using their email address.</p>
            </div>
            <form className="space-y-4" onSubmit={handleAddMember}>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  placeholder="member@example.com"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Role
                <select
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding member..." : "Add member"}
              </button>
            </form>
          </aside>
        </div>
      ) : null}

      {confirmation && (
        <ConfirmModal
          title="Remove member"
          message={`Are you sure you want to remove ${confirmation.membership.user.name} from this group?`}
          onConfirm={confirmRemove}
          onCancel={() => setConfirmation(null)}
          confirmLabel="Remove"
        />
      )}
    </div>
  );
};

export default GroupDetailsPage;
