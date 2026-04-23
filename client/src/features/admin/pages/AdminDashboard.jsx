import React, { useEffect, useState, useCallback } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  Users,
  Hospital,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import StatCard from "../components/StatCard";
import ChartComponent from "../components/ChartComponent";
import RecentActivity from "../components/RecentActivity";
import { useAdmin } from "../hooks/useAdmin.js";

const AdminDashboard = () => {
  const {
    stats,
    handleGetDashboardStats,
    handleGetRevenueAnalytics,
    handleGetGrowthAnalytics,
  } = useAdmin();

  const [chartData, setChartData] = useState({
    appointments: [],
    users: [],
    revenue: [],
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      await handleGetDashboardStats();
      const revenueData = await handleGetRevenueAnalytics("monthly");
      const growthData = await handleGetGrowthAnalytics("monthly");

      setChartData({
        appointments: [12, 19, 3, 5, 2, 3, 15, 20, 25, 30, 35, 28],
        users: growthData.data || [8, 12, 5, 8, 10, 15, 18, 22, 25, 28, 32, 35],
        revenue: revenueData.data || [5000, 8000, 6000, 9000, 11000, 13000, 15000, 18000, 20000, 22000, 25000, 28000],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [handleGetDashboardStats, handleGetRevenueAnalytics, handleGetGrowthAnalytics]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Monitor and manage your HealthAxis platform
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          change={12}
          trend="up"
          color="blue"
        />
        <StatCard
          icon={Hospital}
          title="Hospitals"
          value={stats.totalHospitals}
          change={5}
          trend="up"
          color="indigo"
        />
        <StatCard
          icon={Users}
          title="Doctors"
          value={stats.totalDoctors}
          change={8}
          trend="up"
          color="purple"
        />
        <StatCard
          icon={Calendar}
          title="Appointments"
          value={stats.totalAppointments}
          change={15}
          trend="up"
          color="cyan"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <ChartComponent
          title="Appointments Overview"
          data={chartData.appointments}
          type="line"
        />
        <ChartComponent
          title="User Growth"
          data={chartData.users}
          type="bar"
        />
        <ChartComponent
          title="Revenue Trends"
          data={chartData.revenue}
          type="area"
        />
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Quick Actions */}
        <motion.div
          className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
              Create User
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
              Approve Hospital
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
              View Reports
            </button>
            <button className="w-full px-4 py-3 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-neutral-700 transition">
              System Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
