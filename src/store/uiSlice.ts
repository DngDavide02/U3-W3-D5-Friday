// UI state management

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../types";

export interface UIState {
  // Navigation
  sidebarCollapsed: boolean;
  currentView: "home" | "search" | "library" | "favorites" | "browse";
  mobileMenuOpen: boolean;

  // Theme
  theme: "dark" | "light";

  // Notifications
  notifications: Notification[];

  // Loading
  globalLoading: boolean;

  // Modals
  activeModal: "none" | "settings" | "about" | "help";

  // Breakpoints
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Preferences
  autoPlay: boolean;
  showLyrics: boolean;
  highQualityAudio: boolean;

  // Accessibility
  reducedMotion: boolean;
  keyboardNavigation: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  currentView: "home",
  mobileMenuOpen: false,
  theme: "dark",
  notifications: [],
  globalLoading: false,
  activeModal: "none",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  autoPlay: true,
  showLyrics: false,
  highQualityAudio: false,
  reducedMotion: false,
  keyboardNavigation: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Navigation
    setCurrentView: (state, action: PayloadAction<UIState["currentView"]>) => {
      state.currentView = action.payload;
      state.mobileMenuOpen = false; // Close menu on navigate
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<UIState["theme"]>) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp">>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);

      // Limit to 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Modals
    setActiveModal: (state, action: PayloadAction<UIState["activeModal"]>) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = "none";
    },

    // Breakpoints
    setBreakpoints: (
      state,
      action: PayloadAction<{
        isMobile: boolean;
        isTablet: boolean;
        isDesktop: boolean;
      }>,
    ) => {
      state.isMobile = action.payload.isMobile;
      state.isTablet = action.payload.isTablet;
      state.isDesktop = action.payload.isDesktop;

      // Auto-collapse on mobile
      if (action.payload.isMobile) {
        state.sidebarCollapsed = true;
      }
    },

    // Preferences
    setAutoPlay: (state, action: PayloadAction<boolean>) => {
      state.autoPlay = action.payload;
    },

    toggleAutoPlay: (state) => {
      state.autoPlay = !state.autoPlay;
    },

    setShowLyrics: (state, action: PayloadAction<boolean>) => {
      state.showLyrics = action.payload;
    },

    toggleShowLyrics: (state) => {
      state.showLyrics = !state.showLyrics;
    },

    setHighQualityAudio: (state, action: PayloadAction<boolean>) => {
      state.highQualityAudio = action.payload;
    },

    toggleHighQualityAudio: (state) => {
      state.highQualityAudio = !state.highQualityAudio;
    },

    // Accessibility
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },

    toggleReducedMotion: (state) => {
      state.reducedMotion = !state.reducedMotion;
    },

    setKeyboardNavigation: (state, action: PayloadAction<boolean>) => {
      state.keyboardNavigation = action.payload;
    },

    toggleKeyboardNavigation: (state) => {
      state.keyboardNavigation = !state.keyboardNavigation;
    },

    // Reset UI State
    resetUIState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
  setCurrentView,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setActiveModal,
  closeModal,
  setBreakpoints,
  setAutoPlay,
  toggleAutoPlay,
  setShowLyrics,
  toggleShowLyrics,
  setHighQualityAudio,
  toggleHighQualityAudio,
  setReducedMotion,
  toggleReducedMotion,
  setKeyboardNavigation,
  toggleKeyboardNavigation,
  resetUIState,
} = uiSlice.actions;

// Selectors
export const selectCurrentView = (state: { ui: UIState }) => state.ui.currentView;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectMobileMenuOpen = (state: { ui: UIState }) => state.ui.mobileMenuOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectActiveModal = (state: { ui: UIState }) => state.ui.activeModal;
export const selectBreakpoints = (state: { ui: UIState }) => ({
  isMobile: state.ui.isMobile,
  isTablet: state.ui.isTablet,
  isDesktop: state.ui.isDesktop,
});
export const selectUserPreferences = (state: { ui: UIState }) => ({
  autoPlay: state.ui.autoPlay,
  showLyrics: state.ui.showLyrics,
  highQualityAudio: state.ui.highQualityAudio,
});
export const selectAccessibility = (state: { ui: UIState }) => ({
  reducedMotion: state.ui.reducedMotion,
  keyboardNavigation: state.ui.keyboardNavigation,
});

export default uiSlice.reducer;
