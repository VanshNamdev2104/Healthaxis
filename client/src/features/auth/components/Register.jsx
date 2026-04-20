import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SunIcon as Sunburst } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export default function Register({ toggleLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { handleRegister, loading, error } = useAuth();

  const onSubmit = async (data) => {
    try {
      await handleRegister(data);
      toast.success("Account created successfully 🚀");
      toggleLogin();
    } catch {
      toast.error(error || "Registration failed ❌");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google...");
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-2xl">

        {/* LEFT SIDE */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight">
            Join HealthAxis 🚀
          </h1>
          <p className="mt-4 text-sm opacity-80">
            Create your account and manage everything easily.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12 md:w-1/2 bg-white flex flex-col">

          {/* HEADER */}
          <div className="mb-6">
            <div className="text-orange-500 mb-2">
              <Sunburst className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-sm text-gray-500">
              Get started with HealthAxis
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* PHONE */}
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

            {/* EMAIL */}
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                {...register("email", {
                  required: "Email is required"
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: "Must contain uppercase, lowercase, number, and special character (@$!%*&)"
                  }
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-4 text-center text-gray-400 text-sm">
            OR
          </div>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border py-2 rounded-lg flex justify-center gap-2 hover:bg-gray-50"
          >
            Continue with Google
          </button>

          {/* TOGGLE */}
          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <button
              onClick={toggleLogin}
              className="text-orange-500 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}