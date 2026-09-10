import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyPhone from "./pages/VerifyPhone";
import RegistrationComplete from "./pages/RegistrationComplete";
import Login from "./pages/Login";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import TwoFactorVerification from "./pages/TwoFactorVerification";
import Dashboard from "./pages/Dashboard";
import TwoFactorSuccess from "./pages/TwoFactorSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordVerification from "./pages/ForgotPasswordVerification";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import OAuth2Callback from "./pages/OAuth2Callback";
import Security from "./pages/Security";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/registration-complete" element={<RegistrationComplete />}/>
        <Route path="/2fa-verification" element={<TwoFactorVerification />}/>
        <Route path="/2fa-setup" element={<TwoFactorSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/2fa-success" element={<TwoFactorSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-verification" element={<ForgotPasswordVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/security" element={<Security />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;