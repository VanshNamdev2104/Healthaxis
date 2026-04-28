// Tab configuration constants
export const DASHBOARD_TABS = {
  DASHBOARD: "Dashboard",
  HOSPITALS: "Hospitals",
  MY_HOSPITAL: "MyHospital",
  DOCTORS: "Doctors",
  APPOINTMENTS: "Appointments",
  DISEASES: "Diseases",
  MEDICINES: "Medicines",
  SETTINGS: "Settings",
  PROFILE: "Profile",
  // Admin tabs
  ADMIN_DASHBOARD: "AdminDashboard",
  VERIFICATION_QUEUE: "VerificationQueue",
  USER_MANAGEMENT: "UserManagement",
  HOSPITAL_MANAGEMENT: "HospitalManagement",
  DOCTOR_MANAGEMENT: "DoctorManagement",
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// Route paths
export const ROUTES = {
  AUTH: "/Auth",
  HOME: "/",
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Default user values
export const DEFAULT_USER = {
  NAME: "Profile",
  INITIAL: "U",
  ROLE: "USER",
};


// Stats configuration (TODO: Replace with API-driven data)
export const STATS_CONFIG = [
  {
    id: "facilities",
    label: "Healthcare Facilities",
    value: "500+",
    icon: "🏥",
  },
  {
    id: "doctors",
    label: "Expert Doctors",
    value: "2000+",
    icon: "👨‍⚕️",
  },
  {
    id: "users",
    label: "Active Users",
    value: "50K+",
    icon: "👥",
  },
];

// Settings page configuration
export const SETTINGS_CONFIG = [
  {
    id: "appearance",
    icon: "🎨",
    title: "Appearance",
    description: "Customize your theme and interface",
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Notifications",
    description: "Control your notification preferences",
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy",
    description: "Manage your privacy settings",
  },
  {
    id: "preferences",
    icon: "⚙️",
    title: "Preferences",
    description: "Configure your application preferences",
  },
];

// Animation durations (in seconds)
export const ANIMATION_DURATIONS = {
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 1,
};

// Animation easing
export const ANIMATION_EASING = {
  LINEAR: "linear",
  EASE_IN_OUT: "easeInOut",
};
