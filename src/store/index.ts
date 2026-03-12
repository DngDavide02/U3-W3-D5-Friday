// =============================================================================
// Redux Store Configuration - Modern Setup
// =============================================================================
// Enhanced Redux store with proper TypeScript configuration and middleware

import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import reducers
import playerReducer from "./playerSlice";
import likeReducer from "./likeSlice";
import searchReducer from "./searchSlice";
import uiReducer from "./uiSlice";

// Combine reducers
const rootReducer = combineReducers({
  player: playerReducer,
  likes: likeReducer,
  search: searchReducer,
  ui: uiReducer,
});

// Configure store with enhanced settings
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types for serializable check
          "persist/FLUSH",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["register"],
      },
    }),
  devTools:
    process.env.NODE_ENV !== "production"
      ? {
          name: "Spotify Clone",
          trace: true,
          traceLimit: 25,
        }
      : false,
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for better TypeScript support
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = <T>(selector: (state: RootState) => T) => {
  return selector(store.getState());
};
