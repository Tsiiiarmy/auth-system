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

  // Count users that the manager can consider as team members.
  // We exclude ADMIN accounts.
  const teamMembers = users.filter(
    (member) => member.role !== "ADMIN"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            Monitor your team, projects, and assigned tasks from one place.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Team Members */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Team Members
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                {loadingStats ? "..." : teamMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Members under your management
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              👥
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Projects
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                --
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Projects currently in progress
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              📁
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Tasks
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                --
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Tasks waiting for completion
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⏳
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed Tasks
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-800">
                --
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Tasks completed by your team
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your team and keep track of ongoing work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Team Management */}
          <div
            onClick={() => navigate("/user-management")}
            className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl transition group-hover:bg-red-100">
                👥
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Team Management
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  View team members and manage the people assigned to
                  your team.
                </p>

                <button className="mt-4 text-sm font-semibold text-red-600 transition group-hover:text-red-700">
                  View Team →
                </button>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                📊
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Project Overview
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Monitor project progress, deadlines, and overall team
                  performance.
                </p>

                <button className="mt-4 text-sm font-semibold text-gray-400">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Task Management */}
          <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                📋
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Task Management
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Review assigned tasks and keep track of their progress
                  and completion.
                </p>

                <button className="mt-4 text-sm font-semibold text-gray-400">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Team Activity */}
          <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                🔔
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Team Activity
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Stay updated on recent activity and important changes
                  within your team.
                </p>

                <button className="mt-4 text-sm font-semibold text-gray-400">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Overview */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
            💼
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Manager Overview
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Use this dashboard to monitor your team, coordinate ongoing
              work, and keep track of projects and assigned tasks. Additional
              project and task statistics will appear here once those
              features are connected to the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;