import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  User,
  Upload,
  Key,
  Check,
  X,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../hooks/useProfile.js";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [completeness, setCompleteness] = useState(0);

  const fileInputRef = useRef(null);

  const { handleUpdateProfile, handleChangePassword, loading } = useProfile();

  useEffect(() => {
    const fields = [user?.name, user?.email, user?.number, user?.profileImage];
    const filled = fields.filter(Boolean).length;
    setCompleteness((filled / fields.length) * 100);
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    getValues,
    formState: { errors: passwordErrors },
  } = useForm();

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      number: user?.number || "",
    });
  }, [user, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileImage(null);
    setPreviewImage(null);
    reset({
      name: user?.name || "",
      email: user?.email || "",
      number: user?.number || "",
    });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      if (profileImage) formData.append("profileImage", profileImage);

      await handleUpdateProfile(formData);
      toast.success("Profile updated ✅");
      setEditMode(false);
      setProfileImage(null);
      setPreviewImage(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await handleChangePassword(data);
      toast.success("Password updated 🔐");
      setChangePasswordMode(false);
      resetPassword();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error ❌");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300/80 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 py-3 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  const labelClass =
    "mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Manage your personal details and account security
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md p-5 shadow-sm">
          <div className="mb-2 flex justify-between text-sm text-gray-700 dark:text-neutral-300">
            <span>Profile Completeness</span>
            <span className="font-semibold">{Math.round(completeness)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white dark:border-neutral-800 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-2xl font-bold text-gray-800 dark:text-white shadow">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>

                {editMode && (
                  <button
                    type="button"
                    aria-label="Upload profile photo"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 text-white shadow-md transition hover:bg-indigo-700"
                  >
                    <Camera size={16} />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-sm capitalize text-gray-500 dark:text-neutral-400">
                  {user?.role || "Member"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {!editMode ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/60 p-4">
                      <div className={labelClass}>
                        <Mail size={16} />
                        <span>Email</span>
                      </div>
                      <p className="text-gray-800 dark:text-neutral-100 break-all">
                        {user?.email || "Not set"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/60 p-4">
                      <div className={labelClass}>
                        <Phone size={16} />
                        <span>Phone</span>
                      </div>
                      <p className="text-gray-800 dark:text-neutral-100">
                        {user?.number || "Not set"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <User size={16} />
                    Edit Profile
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="edit"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div>
                    <label className={labelClass}>
                      <User size={16} />
                      <span>Name</span>
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Enter your name"
                      className={inputClass}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Mail size={16} />
                      <span>Email</span>
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                      })}
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Phone size={16} />
                      <span>Phone</span>
                    </label>
                    <input
                      {...register("number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      placeholder="Enter phone number"
                      className={inputClass}
                    />
                    {errors.number && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.number.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={16} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Key className="text-red-500" size={18} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
          </div>

          {!changePasswordMode ? (
            <button
              onClick={() => setChangePasswordMode(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <Key size={16} />
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handleSubmitPassword(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  {...registerPassword("currentPassword", {
                    required: "Current password is required",
                  })}
                  placeholder="Enter current password"
                  className={inputClass}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  {...registerPassword("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter new password"
                  className={inputClass}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match",
                  })}
                  placeholder="Confirm new password"
                  className={inputClass}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={16} />
                  {loading ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordMode(false);
                    resetPassword();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}