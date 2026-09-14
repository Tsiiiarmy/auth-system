import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../utils/api";

const ManagerDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to load manager dashboard data:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadUsers();
  }, [navigate]);

  // Managers can view and edit non-admin users.
  const managedUsers = users.filter(
    (member) => member.role !== "ADMIN"
  );

  const teamMembers = managedUsers.length;

  const verifiedUsers = managedUsers.filter(
    (member) =>
      member.emailVerified && member.phoneVerified
  ).length;

  const unverifiedUsers = managedUsers.filter(
    (member) =>
      !member.emailVerified || !member.phoneVerified
  ).length;

  const twoFactorEnabled = managedUsers.filter(
    (member) => member.twoFactorEnabled === true
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
            👔
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Manager Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-800">
              Welcome back, {user?.fullName || "Manager"}!
            </h1>
          </div>
        </div>

        <p className="mt-3 text-gray-500">
          Monitor users, account verification, and security status.
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Team Members */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Users
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {loadingStats ? "..." : teamMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Non-admin users
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              👥
            </div>
          </div>
        </div>

        {/* Verified Users */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Fully Verified
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {loadingStats ? "..." : verifiedUsers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Email and phone verified
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
              ✓
            </div>
          </div>
        </div>

        {/* Users Needing Attention */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Needs Attention
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {loadingStats ? "..." : unverifiedUsers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Missing verification
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              !
            </div>
          </div>
        </div>

        {/* 2FA */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                2FA Enabled
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {loadingStats ? "..." : twoFactorEnabled}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Users with 2FA enabled
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              🛡️
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            User Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and update user information and monitor account status.
          </p>
        </div>

        <div
          onClick={() => navigate("/users")}
          className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl transition group-hover:bg-red-100">
              👥
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                View & Manage Users
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                View user information, check verification status, review
                security settings, and edit user details.
              </p>

              <button className="mt-4 text-sm font-semibold text-red-600 transition group-hover:text-red-700">
                Manage Users →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Status Overview */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
            📊
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              User Status Overview
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Monitor the verification and security status of users in the
              system. You can open User Management to review individual
              accounts and make permitted changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;