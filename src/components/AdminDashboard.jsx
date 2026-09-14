import { useNavigate } from "react-router-dom";

function AdminDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#D71920]">
            🛡
          </span>

          <p className="text-sm font-bold uppercase tracking-wider text-[#D71920]">
            Admin Dashboard
          </p>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
          Welcome back,{" "}
          {user?.fullName?.split(" ")[0] || "Admin"}!
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Manage users, monitor system activity, and control administrative
          settings from one place.
        </p>
      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Users */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/60">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Total Users
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                --
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              👥
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D71920]" />

            <p className="text-xs font-medium text-gray-500">
              Registered accounts
            </p>
          </div>
        </div>


        {/* Managers */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/60">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Managers
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                --
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              👔
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D71920]" />

            <p className="text-xs font-medium text-gray-500">
              Manager role accounts
            </p>
          </div>
        </div>


        {/* Normal Users */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/60">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Normal Users
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                --
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              👤
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D71920]" />

            <p className="text-xs font-medium text-gray-500">
              Standard access accounts
            </p>
          </div>
        </div>


        {/* 2FA */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/60">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                2FA Enabled
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                --
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
              🔐
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <p className="text-xs font-medium text-gray-500">
              Accounts protected with 2FA
            </p>
          </div>
        </div>

      </div>


      {/* =========================================
          ADMINISTRATION
      ========================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">

        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Administration
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage users, roles, and system security.
            </p>
          </div>

          <div className="hidden rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#D71920] sm:block">
            Admin Access
          </div>
        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* User Management */}
          <button
            type="button"
            onClick={() => navigate("/user-management")}
            className="group rounded-xl border border-gray-200 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                👥
              </div>

              <span className="text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#D71920]">
                →
              </span>
            </div>

            <p className="mt-4 font-bold text-gray-800">
              User Management
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              View, edit, and manage system users.
            </p>
          </button>


          {/* Manage Roles */}
          <button
            type="button"
            className="group rounded-xl border border-gray-200 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                🎭
              </div>

              <span className="text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#D71920]">
                →
              </span>
            </div>

            <p className="mt-4 font-bold text-gray-800">
              Manage Roles
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Control roles and access permissions.
            </p>
          </button>


          {/* Security Overview */}
          <button
            type="button"
            className="group rounded-xl border border-gray-200 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                🛡
              </div>

              <span className="text-lg text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#D71920]">
                →
              </span>
            </div>

            <p className="mt-4 font-bold text-gray-800">
              Security Overview
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Monitor account security and protection.
            </p>
          </button>

        </div>
      </div>


      {/* =========================================
          RECENT ACTIVITY
      ========================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of recent activity across the system.
            </p>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-lg sm:flex">
            🕐
          </div>

        </div>


        {/* Activity Empty State */}
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
            📋
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            No recent activity
          </p>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-500">
            System activity such as new registrations, role changes,
            and security events will appear here.
          </p>

        </div>

      </div>

    </section>
  );
}

export default AdminDashboard;

