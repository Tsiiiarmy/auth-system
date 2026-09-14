function UserDashboard({ user }) {
  const allVerified = user?.emailVerified && user?.phoneVerified;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
            👤
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Personal Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-800">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
            </h1>
          </div>
        </div>

        <p className="mt-3 text-gray-500">
          View your account information and keep your account secure.
        </p>
      </div>

      {/* Account Status */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          allVerified
            ? "border-green-100 bg-green-50/70"
            : "border-red-100 bg-red-50/70"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
              allVerified ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {allVerified ? "✓" : "!"}
          </div>

          <div>
            <p
              className={`text-base font-bold ${
                allVerified ? "text-green-700" : "text-red-700"
              }`}
            >
              {allVerified
                ? "Your account is verified"
                : "Your account needs attention"}
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              {allVerified
                ? "Your email address and phone number have both been verified."
                : "Please complete the required verification steps."}
            </p>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
              👤
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your basic account information.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Full name
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {user?.fullName || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email address
              </p>

              <p className="mt-1 break-all font-semibold text-gray-800">
                {user?.email || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone number
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
              🔐
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Security Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your account protected.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">✉️</span>

                <span className="text-sm font-semibold text-gray-700">
                  Email
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user?.emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.emailVerified ? "Verified" : "Not verified"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>

                <span className="text-sm font-semibold text-gray-700">
                  Phone
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user?.phoneVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.phoneVerified ? "Verified" : "Not verified"}
              </span>
            </div>

            {/* Two Factor Authentication */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🛡️</span>

                <span className="text-sm font-semibold text-gray-700">
                  Two-factor authentication
                </span>
              </div>

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
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
            💡
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Quick Information
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              You can update your personal information from your Profile tab
              and manage your password and two-factor authentication from
              Security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserDashboard;