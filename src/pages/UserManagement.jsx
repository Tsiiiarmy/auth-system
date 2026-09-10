import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "USER",
  });

  const [saving, setSaving] = useState(false);

  // --------------------------------
  // Token
  // --------------------------------

  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // --------------------------------
  // Fetch current user
  // --------------------------------

  const fetchCurrentUser = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to load account information.");
    }

    const data = await response.json();
    setCurrentUser(data);
  };

  // --------------------------------
  // Fetch users
  // --------------------------------

  const fetchUsers = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (response.status === 403) {
      setError("You do not have permission to view users.");
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    const data = await response.json();
    setUsers(data);
  };

  // --------------------------------
  // Initial load
  // --------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCurrentUser();
        await fetchUsers();
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --------------------------------
  // Permissions
  // --------------------------------

  const role = currentUser?.role;

  const canCreate = role === "ADMIN";

  const canEdit =
    role === "ADMIN" || role === "MANAGER";

  const canDelete = role === "ADMIN";

  const canManageRoles = role === "ADMIN";

  // --------------------------------
  // Search
  // --------------------------------

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      user.fullName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phoneNumber?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  // --------------------------------
  // Form
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingUser(null);

    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "USER",
    });

    setShowForm(true);
    setError("");
  };

  const openEditForm = (user) => {
    setEditingUser(user);

    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
      role: user.role || "USER",
    });

    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // --------------------------------
  // Create / Edit
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    const token = getToken();

    try {
      let response;

      if (editingUser) {
        response = await fetch(
          `/api/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            }),
          }
        );
      } else {
        response = await fetch("/api/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.text();

      if (!response.ok) {
        let message = "Operation failed.";

        try {
          const parsed = JSON.parse(data);

          message =
            parsed.message ||
            parsed.error ||
            message;
        } catch {
          if (data) {
            message = data;
          }
        }

        throw new Error(message);
      }

      closeForm();

      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Delete
  // --------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    const token = getToken();

    try {
      const response = await fetch(
        `/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();

        let message = "Failed to delete user.";

        try {
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {
          if (text) {
            message = text;
          }
        }

        throw new Error(message);
      }

      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // --------------------------------
  // Change role
  // --------------------------------

  const handleRoleChange = async (id, role) => {
    const token = getToken();

    try {
      const response = await fetch(
        `/api/users/${id}/role?role=${role}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        let message = "Failed to change role.";

        try {
          const parsed = JSON.parse(text);

          message =
            parsed.message ||
            parsed.error ||
            message;
        } catch {
          if (text) {
            message = text;
          }
        }

        throw new Error(message);
      }

      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D71920]" />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Page
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* Shared Sidebar */}

      <Sidebar
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main */}

      <main className="relative min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#D71920]">
                Administration
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
                User Management
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage users, account information, and roles.
              </p>
            </div>

            {canCreate && (
              <button
                type="button"
                onClick={openCreateForm}
                className="rounded-xl bg-[#D71920] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#b9151b]"
              >
                + Add User
              </button>
            )}
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              ⚠ {error}
            </div>
          )}

          {/* Users table */}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">

            {/* Users header + Search */}

            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Users
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? `${filteredUsers.length} matching user${
                          filteredUsers.length !== 1
                            ? "s"
                            : ""
                        }`
                      : `${users.length} user${
                          users.length !== 1
                            ? "s"
                            : ""
                        } in the system`}
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
                      />
                    </svg>
                  </span>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#D71920] focus:bg-white"
                  />
                </div>

              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Phone
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Verification
                    </th>

                    <th className="px-6 py-4">
                      2FA
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* User */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[#D71920]">
                            {user.fullName
                              ?.split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.fullName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Phone */}

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {user.phoneNumber || "Not provided"}
                      </td>

                      {/* Role */}

                      <td className="px-6 py-5">
                        {canManageRoles ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-[#D71920]"
                          >
                            <option value="USER">
                              USER
                            </option>

                            <option value="MANAGER">
                              MANAGER
                            </option>

                            <option value="ADMIN">
                              ADMIN
                            </option>
                          </select>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Verification */}

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">

                          <span
                            className={
                              user.emailVerified
                                ? "text-xs font-semibold text-green-600"
                                : "text-xs font-semibold text-red-500"
                            }
                          >
                            {user.emailVerified
                              ? "✓ Email"
                              : "✕ Email"}
                          </span>

                          <span
                            className={
                              user.phoneVerified
                                ? "text-xs font-semibold text-green-600"
                                : "text-xs font-semibold text-red-500"
                            }
                          >
                            {user.phoneVerified
                              ? "✓ Phone"
                              : "✕ Phone"}
                          </span>

                        </div>
                      </td>

                      {/* 2FA */}

                      <td className="px-6 py-5">
                        {user.twoFactorEnabled ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            ✓ Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(user)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(user.id)
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-[#D71920] transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}

                  {/* No search results */}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center"
                      >
                        <p className="text-sm font-semibold text-gray-600">
                          No users found
                        </p>

                        {searchTerm && (
                          <p className="mt-1 text-xs text-gray-400">
                            Try searching with a different name,
                            email, phone number, or role.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#D71920]">
                  {editingUser
                    ? "Edit account"
                    : "New account"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-800">
                  {editingUser
                    ? "Edit User"
                    : "Add User"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Full name */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Full name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D71920]"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D71920]"
                  placeholder="user@gmail.com"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Phone number
                </label>

                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D71920]"
                  placeholder="+251..."
                />
              </div>

              {/* Password */}

              {!editingUser && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D71920]"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              )}

              {/* Role */}

              {!editingUser && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="USER">
                      User
                    </option>

                    <option value="MANAGER">
                      Manager
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>
              )}

              {/* Buttons */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#D71920] px-4 py-3 text-sm font-bold text-white hover:bg-[#b9151b] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                      ? "Save Changes"
                      : "Create User"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserManagement;

