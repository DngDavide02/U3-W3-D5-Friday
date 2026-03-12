import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../types";

interface LikeState {
  likedSongs: Record<number, Track>;
}

const initialState: LikeState = {
  likedSongs: {},
};

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<Track>) => {
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
