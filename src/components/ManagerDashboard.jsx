const ManagerDashboard = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Manager Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, {user?.fullName || "Manager"}!
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Team Members</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            --
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Active Projects</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            --
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            --
          </h2>
        </div>
      </div>

      {/* Manager Information */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Manager Overview
        </h2>

        <p className="mt-2 text-gray-500">
          Use this dashboard to monitor your team, projects, and assigned
          tasks.
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;