import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import GroupsPage from "../pages/GroupsPage.jsx";
import GroupDetailsPage from "../pages/GroupDetailsPage.jsx";
import BalancesPage from "../pages/BalancesPage.jsx";
import SettlementsPage from "../pages/SettlementsPage.jsx";
import ExpensesPage from "../pages/ExpensesPage.jsx";
import ExpenseDetailsPage from "../pages/ExpenseDetailsPage.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups"
            element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups/:groupId"
            element={
              <ProtectedRoute>
                <GroupDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups/:groupId/expenses"
            element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups/:groupId/balances"
            element={
              <ProtectedRoute>
                <BalancesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups/:groupId/settlements"
            element={
              <ProtectedRoute>
                <SettlementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="groups/:groupId/expenses/:expenseId"
            element={
              <ProtectedRoute>
                <ExpenseDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
