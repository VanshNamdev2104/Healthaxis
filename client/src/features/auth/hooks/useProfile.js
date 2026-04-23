import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError, clearError } from "../slice/auth.slice.js";
import { updateProfile, changePassword } from "../services/auth.api.js";

export const useProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleUpdateProfile = async (formData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await updateProfile(formData);
      // response.data has structure: { user: updatedUser }
      const updatedUser = response.data?.user || response.data;
      dispatch(setUser(updatedUser));
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await changePassword(passwordData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    handleUpdateProfile,
    handleChangePassword,
    handleClearError,
  };
};

export default useProfile;
