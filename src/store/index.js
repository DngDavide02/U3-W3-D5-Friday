import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import likeReducer from "./likeSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    likes: likeReducer,
    search: searchReducer,
  },
});
