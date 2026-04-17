import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login toggleLogin={toggleLogin} />
      ) : (
        <Register toggleLogin={toggleLogin} />
      )}
    </>
  );
};

export default AuthPage;