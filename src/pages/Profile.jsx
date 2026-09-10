import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Profile() {
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
          throw new Error("Failed to load profile.");
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
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Background */}
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
              Account
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              Profile
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              View your personal account information.
            </p>
          </div>

          {/* Profile Header */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D71920] text-2xl font-bold text-white shadow-lg shadow-red-200">
                {getInitials(user.fullName)}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-800">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email}
                </p>

                <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Verified Account
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-800">
              Personal Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Full Name
                </p>

                <p className="mt-2 text-sm font-bold text-gray-800">
                  {user.fullName}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email Address
                </p>

                <p className="mt-2 break-all text-sm font-bold text-gray-800">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone Number
                </p>

                <p className="mt-2 text-sm font-bold text-gray-800">
                  {user.phoneNumber}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Account Status
                </p>

                <p className="mt-2 text-sm font-bold text-green-600">
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-800">
              Verification
            </h2>

            <div className="mt-4 space-y-3">
              {/* Email Verification */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-semibold text-gray-700">
                  Email verification
                </span>

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

              {/* Phone Verification */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-semibold text-gray-700">
                  Phone verification
                </span>

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

export default Profile;

