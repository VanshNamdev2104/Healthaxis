import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SunIcon as Sunburst } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";

export default function ResetPassword() {
  const { handleResetPassword, loading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  // Watch password to validate confirm password
  const newPassword = watch("password");

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      return;
    }

    const toastId = toast.loading("Resetting password...");

    try {
      await handleResetPassword({
        resetToken,
        password: data.password
      });

      setIsSuccess(true);
      toast.update(toastId, {
        render: "Password reset successful! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to reset password ❌";

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-2xl">

        {/* LEFT SIDE DESIGN */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
            Create New Password 🔑
          </h1>
          <p className="mt-4 text-sm opacity-80">
            Make sure your new password is strong and secure.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white">

          {/* HEADER */}
          <div className="mb-6">
            <div className="text-orange-500 mb-2">
              <Sunburst className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold">Set New Password</h2>
            <p className="text-sm text-gray-500">
              Type in your new password below.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
               <h3 className="text-green-800 font-semibold text-lg">Password Updated!</h3>
               <p className="text-green-600 mt-2 text-sm mb-4">
                 Your password has been changed successfully. You can now log in with your new password.
               </p>
               <Link to="/" className="inline-block bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
                 Go to Login
               </Link>
            </div>
          ) : !resetToken ? (
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl">
               <h3 className="text-red-800 font-semibold text-lg">Invalid Link</h3>
               <p className="text-red-600 mt-2 text-sm mb-4">
                 This password reset link is invalid or missing the token.
               </p>
               <Link to="/" className="inline-block bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
                 Back to Home
               </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm">New Password</label>
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

              <div>
                <label className="text-sm">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === newPassword || "Passwords do not match"
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 mt-4"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
