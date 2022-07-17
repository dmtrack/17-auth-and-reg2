import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionSlice = createSlice({
  name: "profession",
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null,
  },
  reducers: {
    professionRequested: (state) => {
      state.isLoading = true;
    },
    professionReceived: (state, action) => {
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
    professionRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: professionReducer, actions } = professionSlice;

function isOutDated(date) {
  if (Date.now() - date > 10 * 60 * 1000) {
    return true;
  }
  return false;
}

export const loadProfessionsList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().professions;
  if (isOutDated(lastFetch)) {
    const { professionRequested, professionReceived, professionRequestFailed } =
      actions;

    dispatch(professionRequested());
    try {
      const { content } = await professionService.get();
      dispatch(professionReceived(content));
    } catch (error) {
      dispatch(professionRequestFailed(error.message));
    }
  }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
  state.professions.isLoading;

export default professionReducer;
