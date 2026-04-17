import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const AuthPage = () => {
  const [authState, setAuthState] = useState("login"); // 'login', 'register', 'forgot'

  const toggleLogin = () => {
    setAuthState(prevState => prevState === "login" ? "register" : "login");
  };

  const toggleForgot = () => {
    setAuthState(prevState => prevState === "forgot" ? "login" : "forgot");
  };

  return (
    <>
      {authState === "login" && <Login toggleLogin={toggleLogin} toggleForgot={toggleForgot} />}
      {authState === "register" && <Register toggleLogin={toggleLogin} />}
      {authState === "forgot" && <ForgotPassword toggleForgot={toggleForgot} />}
    </>
  );
};

export default AuthPage;