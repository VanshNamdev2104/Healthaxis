import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Form */}
        {isLogin ? (
          <Login toggleLogin={toggleLogin} />
        ) : (
          <Register toggleLogin={toggleLogin} />
        )}

        {/* Toggle */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <button
            onClick={toggleLogin}
            className="text-blue-500 font-semibold mt-1 hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;