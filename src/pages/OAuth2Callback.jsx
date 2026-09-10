import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    navigate("/dashboard", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-3 text-3xl">🔐</div>

        <h2 className="text-xl font-semibold text-gray-800">
          Signing you in...
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we complete authentication.
        </p>
      </div>
    </div>
  );
}

export default OAuth2Callback;