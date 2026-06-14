import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-5xl rounded-3xl bg-white p-8 shadow-xl sm:p-12">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back to Splitwise Clone</h1>
          <p className="max-w-xl text-slate-500">
            Secure login and registration for your group expense tracker.
          </p>
        </div>
        <Outlet />
        <div className="mt-8 text-center text-sm text-slate-500">
          <Link to="/" className="text-sky-600 hover:text-sky-700">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
