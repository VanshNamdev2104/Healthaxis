import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import medicineAPI from "../services/medicine.api";

// Async thunks
export const fetchAllMedicines = createAsyncThunk(
  "medicine/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getAllMedicines(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch medicines");
    }
  }
);

export const fetchMedicineById = createAsyncThunk(
  "medicine/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicineById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch medicine");
    }
  }
);

export const createNewMedicine = createAsyncThunk(
  "medicine/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.createMedicine(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create medicine");
    }
  }
);

export const updateExistingMedicine = createAsyncThunk(
  "medicine/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.updateMedicine(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update medicine");
    }
  }
);

export const deleteExistingMedicine = createAsyncThunk(
  "medicine/delete",
  async (id, { rejectWithValue }) => {
    try {
      await medicineAPI.deleteMedicine(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete medicine");
    }
  }
);

export const searchMedicinesQuery = createAsyncThunk(
  "medicine/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.searchMedicines(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search medicines");
    }
  }
);

export const fetchMedicinesByDisease = createAsyncThunk(
  "medicine/fetchByDisease",
  async (diseaseId, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getMedicinesByDisease(diseaseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch medicines by disease");
    }
  }
);

const initialState = {
  medicines: [],
  currentMedicine: null,
  loading: false,
  error: null,
  totalCount: 0,
};

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentMedicine: (state) => {
      state.currentMedicine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all medicines
      .addCase(fetchAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch medicine by ID
      .addCase(fetchMedicineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMedicine = action.payload;
      })
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create medicine
      .addCase(createNewMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createNewMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update medicine
      .addCase(updateExistingMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingMedicine.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.medicines.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
        state.currentMedicine = action.payload;
      })
      .addCase(updateExistingMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete medicine
      .addCase(deleteExistingMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = state.medicines.filter((m) => m._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteExistingMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search medicines
      .addCase(searchMedicinesQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMedicinesQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(searchMedicinesQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch medicines by disease
      .addCase(fetchMedicinesByDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicinesByDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(fetchMedicinesByDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCurrentMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;
