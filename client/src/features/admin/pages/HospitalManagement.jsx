import React, { useState, useMemo, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin.js";

const HospitalManagement = () => {
  const {
    hospitals,
    loading,
    handleGetAllHospitals,
    handleApproveHospital,
    handleRejectHospital,
    handleDeleteHospital,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    handleGetAllHospitals({ search: searchTerm, status: filterStatus });
  }, [searchTerm, filterStatus, handleGetAllHospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || hospital.verificationStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [hospitals, searchTerm, filterStatus]);

  const handleApprove = async (id) => {
    try {
      await handleApproveHospital(id);
    } catch (err) {
      console.error("Failed to approve hospital:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await handleRejectHospital(id);
    } catch (err) {
      console.error("Failed to reject hospital:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await handleDeleteHospital(id);
    } catch (err) {
      console.error("Failed to delete hospital:", err);
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
          Hospital Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Manage and approve hospital registrations
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 mb-6"
        whileHover={{ y: -2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} /> Add Hospital
          </motion.button>
        </div>
      </motion.div>

      {/* Hospital Cards Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading hospitals...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredHospitals.map((hospital, idx) => (
              <motion.div
                key={hospital._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 hover:shadow-xl transition-all group"
                whileHover={{ y: -5 }}
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <motion.span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                      hospital.verificationStatus
                    )}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {hospital.verificationStatus?.toUpperCase()}
                  </motion.span>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(hospital._id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Hospital Info */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {hospital.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} className="shrink-0" />
                    <span>{hospital.city}, {hospital.state}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Phone size={18} className="shrink-0" />
                    <span>{hospital.contactNumber}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-neutral-700 mb-6">
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {hospital.doctors?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Doctors
                    </p>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      N/A
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Appointments
                    </p>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      N/A
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Rating
                    </p>
                  </motion.div>
                </div>

                {/* Actions */}
                {hospital.verificationStatus === "pending" && (
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleApprove(hospital._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle size={16} /> Approve
                    </motion.button>
                    <motion.button
                      onClick={() => handleReject(hospital._id)}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredHospitals.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No hospitals found matching your criteria
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HospitalManagement;
