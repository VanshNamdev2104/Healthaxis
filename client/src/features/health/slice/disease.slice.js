import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import diseaseAPI from "../services/disease.api";

// Async thunks
export const fetchAllDiseases = createAsyncThunk(
  "disease/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.getAllDiseases(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch diseases");
    }
  }
);

export const fetchDiseaseById = createAsyncThunk(
  "disease/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.getDiseaseById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch disease");
    }
  }
);

export const createNewDisease = createAsyncThunk(
  "disease/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.createDisease(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create disease");
    }
  }
);

export const updateExistingDisease = createAsyncThunk(
  "disease/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.updateDisease(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update disease");
    }
  }
);

export const deleteExistingDisease = createAsyncThunk(
  "disease/delete",
  async (id, { rejectWithValue }) => {
    try {
      await diseaseAPI.deleteDisease(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete disease");
    }
  }
);

export const searchDiseasesQuery = createAsyncThunk(
  "disease/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await diseaseAPI.searchDiseases(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search diseases");
    }
  }
);

const initialState = {
  diseases: [],
  currentDisease: null,
  loading: false,
  error: null,
  totalCount: 0,
};

const diseaseSlice = createSlice({
  name: "disease",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentDisease: (state) => {
      state.currentDisease = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all diseases
      .addCase(fetchAllDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchAllDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch disease by ID
      .addCase(fetchDiseaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiseaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDisease = action.payload;
      })
      .addCase(fetchDiseaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create disease
      .addCase(createNewDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createNewDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update disease
      .addCase(updateExistingDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingDisease.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.diseases.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.diseases[index] = action.payload;
        }
        state.currentDisease = action.payload;
      })
      .addCase(updateExistingDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete disease
      .addCase(deleteExistingDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = state.diseases.filter((d) => d._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteExistingDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search diseases
      .addCase(searchDiseasesQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDiseasesQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
      })
      .addCase(searchDiseasesQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCurrentDisease } = diseaseSlice.actions;
export default diseaseSlice.reducer;
