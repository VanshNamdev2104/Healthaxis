import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { SunIcon as Sunburst, Heart, Activity, Zap, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { gsap } from "gsap";

export default function Register({ toggleLogin }) {
  const { handleRegister, handleGoogleAuth, loading } = useAuth();
  const leftSideRef = useRef(null);
  const heartRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    // Heartbeat animation
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.3,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // Floating animation for background elements
    floatingElementsRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-360, 360)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3
        });
      }
    });

    // Fade in animation
    gsap.fromTo(leftSideRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating account...");

    try {
      await handleRegister(data);

      toast.update(toastId, {
        render: "Account created successfully 🚀",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      // 👉 auto switch to login
      toggleLogin();

    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed ❌";

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

        {/* LEFT SIDE */}
        <div ref={leftSideRef} className="bg-gradient-to-br from-[#1a2847] via-[#0f172a] to-[#0d1f3c] text-white p-8 md:p-12 md:w-1/2 relative overflow-hidden flex flex-col justify-between">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div ref={el => floatingElementsRef.current[0] = el} className="absolute top-10 left-10">
              <Heart className="w-24 h-24 text-orange-400" strokeWidth={1} />
            </div>
            <div ref={el => floatingElementsRef.current[1] = el} className="absolute bottom-20 right-10">
              <Activity className="w-20 h-20 text-blue-400" strokeWidth={1} />
            </div>
            <div ref={el => floatingElementsRef.current[2] = el} className="absolute top-1/2 right-20">
              <Users className="w-16 h-16 text-green-400" strokeWidth={1} />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div ref={heartRef} className="text-red-500">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                HealthAxis
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
              Start Your Health Journey ✨
            </h2>
            <p className="mt-4 text-sm opacity-80 leading-relaxed">
              Join thousands of users managing their health smartly. Get access to doctors, appointments, health records, and more.
            </p>
          </div>

          {/* Bottom info cards */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-orange-400" />
              </div>
              <span className="opacity-80">Personalized Health Tracking</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="opacity-80">Connect with Top Doctors</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <span className="opacity-80">Instant Consultations</span>
            </div>
          </div>
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
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
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
            onClick={onGoogleLogin}
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