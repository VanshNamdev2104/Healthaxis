import React, { useState, useMemo, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Star,
  Briefcase,
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin.js";

const DoctorManagement = () => {
  const {
    doctors,
    loading,
    handleGetAllDoctors,
    handleApproveDoctor,
    handleDeleteDoctor,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const specializations = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Ophthalmology",
  ];

  useEffect(() => {
    handleGetAllDoctors({ search: searchTerm, specialization: filterSpecialization, status: filterStatus });
  }, [searchTerm, filterSpecialization, filterStatus, handleGetAllDoctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec =
        filterSpecialization === "all" ||
        doctor.specialization === filterSpecialization;
      const matchesStatus =
        filterStatus === "all" || doctor.verificationStatus === filterStatus;
      return matchesSearch && matchesSpec && matchesStatus;
    });
  }, [doctors, searchTerm, filterSpecialization, filterStatus]);

  const handleApprove = async (id) => {
    try {
      await handleApproveDoctor(id);
    } catch (err) {
      console.error("Failed to approve doctor:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await handleDeleteDoctor(id);
    } catch (err) {
      console.error("Failed to delete doctor:", err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      pending:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };
    return badges[status] || badges.pending;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Doctor Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Manage and verify doctor profiles
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 mb-6"
        whileHover={{ y: -2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>

          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} /> Add Doctor
          </motion.button>
        </div>
      </motion.div>

      {/* Doctors Table */}
      <motion.div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading doctors...</p>
          </div>
        ) : (
          <motion.table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-neutral-700/50 border-b border-gray-200 dark:border-neutral-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Name & Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Specialization
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Hospital
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredDoctors.map((doctor, idx) => (
                  <motion.tr
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doctor.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {doctor.specialization}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {doctor.hospital?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {doctor.experience} yrs
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          doctor.verificationStatus
                        )}`}
                      >
                        {doctor.verificationStatus === "verified" ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doctor.verificationStatus === "pending" && (
                          <motion.button
                            onClick={() => handleApprove(doctor._id)}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle size={16} />
                          </motion.button>
                        )}
                        <motion.button
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(doctor._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No doctors found matching your criteria
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorManagement;
