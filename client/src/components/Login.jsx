import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [loginType, setLoginType] = useState("email"); 

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        password: data.password,
        ...(loginType === "email"
          ? { email: data.email }
          : { number: data.number })
      };

      const res = await axios.post("http://localhost:3000/api/user/login", payload);
      console.log(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your HealthAxis account</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex p-1 mb-8 bg-slate-100 rounded-lg">
          <button 
            type="button"
            onClick={() => setLoginType("email")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginType === "email" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Email
          </button>
          <button 
            type="button"
            onClick={() => setLoginType("number")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${loginType === "number" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Phone Number
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Input */}
          {loginType === "email" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          )}

          {/* Number Input */}
          {loginType === "number" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="10-digit number"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("number", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit number"
                  }
                })}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
            </div>
          )}

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <a href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <p className="px-3 text-sm text-slate-400 font-medium">OR</p>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Google Login */}
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-8 text-sm text-slate-600">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
