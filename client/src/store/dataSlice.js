import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../contant";

export const fetchHistory = createAsyncThunk("user/fetchHistory", async () => {
  const response = await axios.get(API_URL + `/api/user/history`, {
    withCredentials: true,
  });
  const data = response.data;
  return data.data || {};
});

const dataSlice = createSlice({
  name: "data",
  initialState: {
    history: {},
    filteredData: [],
    status: "idle",
  },
  reducers: {
    setFilteredData: (state, action) => {
      console.log("FILTER", action.payload);
      state.filteredData = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setFilteredData, setHistory } = dataSlice.actions;

export default dataSlice.reducer;
