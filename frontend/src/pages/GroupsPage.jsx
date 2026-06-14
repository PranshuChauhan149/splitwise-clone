import { useEffect, useState } from "react";
import { groupApi } from "../services/apiService.js";
import GroupCard from "../components/GroupCard.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await groupApi.getGroups();
        setGroups(response.data.data.groups || []);
      } catch (err) {
        setError(err.error || err.message || "Unable to load groups.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupCreated = (group) => {
    setGroups((prev) => [group, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Groups</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your Groups</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            View all groups you belong to, create a new group, and manage membership settings.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Create group
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">Loading groups...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : groups.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">
          No groups created yet. Start by creating one.
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ul>
      )}

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default GroupsPage;
