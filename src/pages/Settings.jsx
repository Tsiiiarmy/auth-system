import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch current user
  // --------------------------------

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
            method: "GET",
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
          throw new Error("Failed to load user information.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // --------------------------------
  // Logout
  // --------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D71920]" />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Loading settings...
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
      {/* =========================================
          SOFT BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* =========================================
          SHARED SIDEBAR
      ========================================= */}

      <Sidebar user={user} onLogout={handleLogout} />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="relative min-h-screen lg:ml-64">
        <div className="mx-auto max-w-5xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">

          {/* Header */}

          <div className="mb-8">
            <p className="mb-1 text-sm font-semibold text-[#D71920]">
              Preferences
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your account preferences.
            </p>
          </div>

          {/* Notifications */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-800">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose how you would like to receive updates.
            </p>

            <div className="mt-5 space-y-4">

              {/* Email notifications */}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Email notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Receive important account updates by email.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-[#D71920] p-1">
                  <div className="ml-5 h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* Security alerts */}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Security alerts
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Get notified about important security activity.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-[#D71920] p-1">
                  <div className="ml-5 h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* SMS notifications */}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    SMS notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Receive selected updates through SMS.
                  </p>
                </div>

                <div className="h-6 w-11 rounded-full bg-gray-200 p-1">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>

            </div>
          </div>

          {/* Account Settings */}

          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-800">
              Account
            </h2>

            <div className="mt-4 space-y-3">

              {/* Profile */}

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-4 text-left transition hover:bg-red-50"
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Profile
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    View your personal information.
                  </p>
                </div>

                <span className="text-[#D71920]">→</span>
              </button>

              {/* Security */}

              <button
                type="button"
                onClick={() => navigate("/security")}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-4 text-left transition hover:bg-red-50"
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Security
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage your account security.
                  </p>
                </div>

                <span className="text-[#D71920]">→</span>
              </button>

            </div>
          </div>

          {/* Sign out */}

          <div className="mt-5 rounded-2xl border border-red-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-base font-bold text-gray-800">
              Sign out
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign out of your current account on this device.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 rounded-xl bg-[#D71920] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-[#b9151b]"
            >
              Sign out
            </button>
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

export default Settings;

