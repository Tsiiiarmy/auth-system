function UserDashboard({ user }) {
  const allVerified = user?.emailVerified && user?.phoneVerified;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <p className="mb-1 text-sm font-semibold text-[#D71920]">
          Personal dashboard
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
          Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
        </h1>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          View your account information and keep your account secure.
        </p>
      </div>

      {/* Account Status */}
      <div
        className={`rounded-2xl border px-5 py-4 ${
          allVerified
            ? "border-green-100 bg-green-50/70"
            : "border-red-100 bg-red-50/70"
        }`}
      >
        <p
          className={`text-sm font-bold ${
            allVerified ? "text-green-700" : "text-[#D71920]"
          }`}
        >
          {allVerified
            ? "Your account is verified"
            : "Your account needs attention"}
        </p>

        <p className="mt-1 text-sm text-gray-600">
          {allVerified
            ? "Your email address and phone number have both been verified."
            : "Please complete the required verification steps."}
        </p>
      </div>

      {/* Account Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
          <h2 className="text-lg font-bold text-gray-800">
            Personal Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Full name
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {user?.fullName || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                Email address
              </p>

              <p className="mt-1 break-all font-semibold text-gray-800">
                {user?.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500">
                Phone number
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
          <h2 className="text-lg font-bold text-gray-800">
            Security Status
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">
                Email
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user?.emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-[#D71920]"
                }`}
              >
                {user?.emailVerified ? "Verified" : "Not verified"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">
                Phone
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user?.phoneVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-[#D71920]"
                }`}
              >
                {user?.phoneVerified ? "Verified" : "Not verified"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">
                Two-factor authentication
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user?.twoFactorEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Information */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
        <h2 className="text-lg font-bold text-gray-800">
          Quick Information
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          You can update your personal information from your Profile tab and
          manage your password and two-factor authentication from Security.
        </p>
      </div>
    </section>
  );
}

export default UserDashboard;