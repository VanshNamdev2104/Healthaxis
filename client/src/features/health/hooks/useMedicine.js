import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMedicines,
  fetchMedicineById,
  createNewMedicine,
  updateExistingMedicine,
  deleteExistingMedicine,
  searchMedicinesQuery,
  fetchMedicinesByDisease,
  clearError,
  resetCurrentMedicine,
} from "../slice/medicine.slice";

export const useMedicine = () => {
  const dispatch = useDispatch();
  const { medicines, currentMedicine, loading, error, totalCount } = useSelector(
    (state) => state.medicine
  );

  const getAllMedicines = async (filters) => {
    return dispatch(fetchAllMedicines(filters));
  };

  const getMedicineById = async (id) => {
    return dispatch(fetchMedicineById(id));
  };

  const addMedicine = async (formData) => {
    return dispatch(createNewMedicine(formData));
  };

  const updateMedicine = async (id, formData) => {
    return dispatch(updateExistingMedicine({ id, formData }));
  };

  const removeMedicine = async (id) => {
    return dispatch(deleteExistingMedicine(id));
  };

  const searchMedicines = async (query) => {
    return dispatch(searchMedicinesQuery(query));
  };

  const getMedicinesByDisease = async (diseaseId) => {
    return dispatch(fetchMedicinesByDisease(diseaseId));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleResetCurrent = () => {
    dispatch(resetCurrentMedicine());
  };

  return {
    medicines,
    currentMedicine,
    loading,
    error,
    totalCount,
    getAllMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,
    removeMedicine,
    searchMedicines,
    getMedicinesByDisease,
    handleClearError,
    handleResetCurrent,
  };
};

export default useMedicine;
