import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { useAuthActions } from "../hooks/useAuthActions.js";

const MainLayout = () => {
  const user = useSelector(selectCurrentUser);
  const { logoutUser } = useAuthActions();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-lg font-semibold text-slate-900">Splitwise Clone</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-700">{user.name}</span>
                <button
                  onClick={logoutUser}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white transition hover:bg-sky-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
