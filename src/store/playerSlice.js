import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSong: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong(state, action) {
      state.currentSong = action.payload;
    },

    stop(state) {
      state.currentSong = null;
    },
  },
});

export const { setCurrentSong, togglePlay, stop } = playerSlice.actions;

export default playerSlice.reducer;
