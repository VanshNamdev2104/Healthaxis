import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { SunIcon as Sunburst } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login({ toggleLogin, toggleForgot }) {
  const [loginType, setLoginType] = useState("email");
  const { handleLogin, handleGoogleAuth, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    try {
      const payload = {
        password: data.password,
        ...(loginType === "email"
          ? { email: data.email }
          : { number: data.number })
      };

      await handleLogin(payload);

      toast.update(toastId, {
        render: "Login successful 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed ❌";

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const onGoogleLogin = () => {
    toast.info("Redirecting to Google...");
    handleGoogleAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-2xl">

        {/* LEFT SIDE DESIGN */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
            Welcome back to HealthAxis 🚀
          </h1>
          <p className="mt-4 text-sm opacity-80">
            Manage your health system with ease.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white">

          {/* HEADER */}
          <div className="mb-6">
            <div className="text-orange-500 mb-2">
              <Sunburst className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold">Sign In</h2>
            <p className="text-sm text-gray-500">
              Login to your account
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType("email")}
              className={`flex-1 py-2 text-sm rounded-md ${
                loginType === "email"
                  ? "bg-white shadow"
                  : "text-gray-500"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginType("number")}
              className={`flex-1 py-2 text-sm rounded-md ${
                loginType === "number"
                  ? "bg-white shadow"
                  : "text-gray-500"
              }`}
            >
              Phone
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* EMAIL */}
            {loginType === "email" && (
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* PHONE */}
            {loginType === "number" && (
              <div>
                <label className="text-sm">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  {...register("number", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid number"
                    }
                  })}
                />
                {errors.number && (
                  <p className="text-red-500 text-xs">
                    {errors.number.message}
                  </p>
                )}
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mt-1">
                <label className="text-sm">Password</label>
                <button
                  type="button"
                  onClick={toggleForgot}
                  className="text-xs text-orange-500 font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                {...register("password", {
                  required: "Password is required"
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-4 text-center text-gray-400 text-sm">
            OR
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={onGoogleLogin}
            className="cursor-pointer w-full border py-2 rounded-lg flex justify-center gap-2 hover:bg-gray-50"
          >
            Continue with Google
          </button>

          {/* FOOTER */}
          <p className="text-center mt-6 text-sm">
            Don't have account?{" "}
            <button onClick={toggleLogin} className="cursor-pointer text-orange-500 font-medium">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}