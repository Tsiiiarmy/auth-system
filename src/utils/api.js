const API_BASE_URL = "/api";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Registration failed.";

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.message) {
        errorMessage = parsedData.message;
      } else if (parsedData.error) {
        errorMessage = parsedData.error;
      }
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return data;
};

export const verifyEmail = async (email, code) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
    }
  );

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Email verification failed.";

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.message) {
        errorMessage = parsedData.message;
      } else if (parsedData.error) {
        errorMessage = parsedData.error;
      }
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return data;
};

export const verifyPhone = async (phoneNumber, code) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-phone?phoneNumber=${encodeURIComponent(
      phoneNumber
    )}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
    }
  );

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Phone verification failed.";

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.message) {
        errorMessage = parsedData.message;
      } else if (parsedData.error) {
        errorMessage = parsedData.error;
      }
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return data;
};



export const loginUser = async (identifier, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Login failed.";

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.message) {
        errorMessage = parsedData.message;
      } else if (parsedData.error) {
        errorMessage = parsedData.error;
      }
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const verifyTwoFactor = async (email, code) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "2FA verification failed.";

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.message) {
        errorMessage = parsedData.message;
      } else if (parsedData.error) {
        errorMessage = parsedData.error;
      }
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const enableTwoFactor = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/2fa/enable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to enable 2FA.";

    try {
      const parsedData = JSON.parse(data);
      errorMessage = parsedData.message || parsedData.error || errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const disableTwoFactor = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to disable 2FA.";

    try {
      const parsedData = JSON.parse(data);
      errorMessage = parsedData.message || parsedData.error || errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to get user information.";

    try {
      const parsedData = JSON.parse(data);

      errorMessage =
        parsedData.message ||
        parsedData.error ||
        errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to send password reset code.";

    try {
      const parsedData = JSON.parse(data);

      errorMessage =
        parsedData.message ||
        parsedData.error ||
        errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const resetPassword = async (
  email,
  code,
  newPassword,
  confirmPassword
) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      newPassword,
      confirmPassword,
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to reset password.";

    try {
      const parsedData = JSON.parse(data);

      errorMessage =
        parsedData.message ||
        parsedData.error ||
        errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};

export const verifyPasswordResetCode = async (email, code) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-password-reset-code?email=${encodeURIComponent(
      email
    )}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
    }
  );

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Invalid verification code.";

    try {
      const parsedData = JSON.parse(data);

      errorMessage =
        parsedData.message ||
        parsedData.error ||
        errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};


export const getAllUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.text();

  if (!response.ok) {
    let errorMessage = "Failed to get users.";

    try {
      const parsedData = JSON.parse(data);
      errorMessage =
        parsedData.message ||
        parsedData.error ||
        errorMessage;
    } catch {
      if (data) {
        errorMessage = data;
      }
    }

    throw new Error(errorMessage);
  }

  return JSON.parse(data);
};