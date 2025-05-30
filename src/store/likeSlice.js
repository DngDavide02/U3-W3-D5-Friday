import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    likedSongs: {},
  },
  reducers: {
    toggleLike: (state, action) => {
      const track = action.payload;
      const trackId = track.id;

      if (state.likedSongs[trackId]) {
        delete state.likedSongs[trackId];
      } else {
        state.likedSongs[trackId] = track;
      }
    },
  },
});

export const { toggleLike } = likeSlice.actions;
export default likeSlice.reducer;
