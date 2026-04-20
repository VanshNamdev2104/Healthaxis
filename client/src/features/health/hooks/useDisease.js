import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDiseases,
  fetchDiseaseById,
  createNewDisease,
  updateExistingDisease,
  deleteExistingDisease,
  searchDiseasesQuery,
  clearError,
  resetCurrentDisease,
} from "../slice/disease.slice";

export const useDisease = () => {
  const dispatch = useDispatch();
  const { diseases, currentDisease, loading, error, totalCount } = useSelector(
    (state) => state.disease
  );

  const getAllDiseases = async (filters) => {
    return dispatch(fetchAllDiseases(filters));
  };

  const getDiseaseById = async (id) => {
    return dispatch(fetchDiseaseById(id));
  };

  const addDisease = async (formData) => {
    return dispatch(createNewDisease(formData));
  };

  const updateDisease = async (id, formData) => {
    return dispatch(updateExistingDisease({ id, formData }));
  };

  const removeDisease = async (id) => {
    return dispatch(deleteExistingDisease(id));
  };

  const searchDiseases = async (query) => {
    return dispatch(searchDiseasesQuery(query));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleResetCurrent = () => {
    dispatch(resetCurrentDisease());
  };

  return {
    diseases,
    currentDisease,
    loading,
    error,
    totalCount,
    getAllDiseases,
    getDiseaseById,
    addDisease,
    updateDisease,
    removeDisease,
    searchDiseases,
    handleClearError,
    handleResetCurrent,
  };
};

export default useDisease;
