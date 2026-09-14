import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "../components/AdminDashboard";
import ManagerDashboard from "../components/ManagerDashboard";
import UserDashboard from "../components/UserDashboard";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch current user
  // --------------------------------

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

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

        console.log("CURRENT USER:", data);

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
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // --------------------------------
  // User role
  // --------------------------------

  const role = user.role;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* =========================================
          SHARED NAVIGATION
      ========================================= */}

      <Sidebar user={user} onLogout={handleLogout} />

      {/* =========================================
          SOFT BACKGROUND GLOW
      ========================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="relative min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">

          {/* =====================================
              ROLE-BASED DASHBOARD
          ===================================== */}

          {role === "ADMIN" && (
            <AdminDashboard user={user} />
          )}

          {role === "MANAGER" && (
            <ManagerDashboard user={user} />
          )}

          {role === "USER" && (
            <UserDashboard user={user} />
          )}

          {/* =====================================
              UNKNOWN ROLE
          ===================================== */}

          {!["ADMIN", "MANAGER", "USER"].includes(role) && (
            <section className="flex min-h-[60vh] items-center justify-center">
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-gray-200/40">
                <h1 className="text-xl font-bold text-gray-800">
                  Dashboard unavailable
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Your account role could not be recognized.
                </p>

                <p className="mt-2 text-xs font-semibold text-gray-400">
                  Current role: {role || "Not assigned"}
                </p>
              </div>
            </section>
          )}

          {/* =====================================
              FOOTER
          ===================================== */}

          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-5 sm:flex-row">
            <p className="text-xs font-medium text-gray-400">
              © 2026 Auth System. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>

              Account protected
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;

