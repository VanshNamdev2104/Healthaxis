import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SunIcon as Sunburst } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function ForgotPassword({ toggleForgot }) {
  const { handleForgotPassword, loading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Sending reset link...");

    try {
      await handleForgotPassword(data.email);
      setEmailSent(true);

      toast.update(toastId, {
        render: "Reset link sent! Please check your email 📧",
        type: "success",
        isLoading: false,
        autoClose: 5000
      });

    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send reset link ❌";

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
            Forgot Your Password? 🔒
          </h1>
          <p className="mt-4 text-sm opacity-80">
            Don't worry, we'll help you get back into your account safely.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white">

          {/* HEADER */}
          <div className="mb-6">
            <div className="text-orange-500 mb-2">
              <Sunburst className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold">Reset Password</h2>
            <p className="text-sm text-gray-500">
              Enter your email to receive a recovery link
            </p>
          </div>

          {emailSent ? (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
               <h3 className="text-green-800 font-semibold text-lg">Check your inbox!</h3>
               <p className="text-green-600 mt-2 text-sm">
                 We've sent a password reset link to your email. Click the link to choose a new password.
               </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm">Email Address</label>
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

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* FOOTER */}
          <p className="text-center mt-6 text-sm">
            Remember your password?{" "}
            <button onClick={toggleForgot} className="cursor-pointer text-orange-500 font-medium">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
