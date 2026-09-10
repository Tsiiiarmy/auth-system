import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Security() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load security information.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D71920]" />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Loading security...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* Shared Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main */}
      <main className="relative min-h-screen lg:ml-64">
        <div className="mx-auto max-w-5xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-1 text-sm font-semibold text-[#D71920]">
              Account security
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              Security
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your password and account security.
            </p>
          </div>

          {/* Security Status */}
          <div className="mb-6 rounded-2xl border border-green-100 bg-green-50/70 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                ✓
              </div>

              <div>
                <h2 className="text-sm font-bold text-green-700">
                  Your account is secure
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Your email and phone number are verified.
                </p>
              </div>
            </div>
          </div>

          {/* Security Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Password */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#D71920]">
                  🔒
                </div>

                <div>
                  <h3 className="font-bold text-gray-800">
                    Password
                  </h3>

                  <p className="text-sm text-gray-500">
                    Keep your password up to date.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/forgot-password")}
                className="mt-5 text-sm font-bold text-[#D71920] hover:underline"
              >
                Change password →
              </button>
            </div>

            {/* 2FA */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#D71920]">
                    🛡️
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Two-Factor Authentication
                    </h3>

                    <p className="text-sm text-gray-500">
                      Extra protection when signing in.
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.twoFactorEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              <button
                onClick={() => navigate("/2fa-setup")}
                className="mt-5 text-sm font-bold text-[#D71920] hover:underline"
              >
                {user.twoFactorEnabled
                  ? "Manage 2FA →"
                  : "Enable 2FA →"}
              </button>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40">
            <h2 className="text-base font-bold text-gray-800">
              Verification
            </h2>

            <div className="mt-4 space-y-3">
              {/* Email */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Email
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.emailVerified ? "Verified" : "Not verified"}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Phone
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.phoneNumber}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.phoneVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.phoneVerified ? "Verified" : "Not verified"}
                </span>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40">
            <h2 className="text-base font-bold text-gray-800">
              Security tips
            </h2>

            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Use a strong and unique password.</li>
              <li>• Never share your verification codes.</li>
              <li>• Enable 2FA for additional protection.</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-5 text-center">
            <p className="text-xs font-medium text-gray-400">
              © 2026 Auth System. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Security;

