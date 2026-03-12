// =============================================================================
// Enhanced Navigation Bar Component
// =============================================================================
// Modern, responsive navigation bar with search functionality

import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Home, Heart, User, Settings } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { useAppSelector } from "../store";
import { selectUserPreferences } from "../store/uiSlice";

interface MyNavBarProps {
  className?: string;
}

/**
 * Enhanced Navigation Bar component with modern design and interactions
 * Features:
 * - Global search functionality
 * - Responsive mobile menu
 * - User account integration
 * - Smooth animations and transitions
 * - Keyboard shortcuts support
 */
const MyNavBar: React.FC<MyNavBarProps> = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { search, loading } = useSearch();
  const location = useLocation();
  const user = useAppSelector(selectUserPreferences);

  // Handle search with debouncing
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      search(query);
    }
  }, [query, search]);

  // Handle query change with debounce
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);

      // Real-time search with debounce
      if (newQuery.trim()) {
        const timeoutId = setTimeout(() => {
          search(newQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    },
    [search],
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      } else if (e.key === "Escape") {
        setQuery("");
        (e.target as HTMLInputElement).blur();
      }
    },
    [handleSearch],
  );

  // Check if navigation item is active
  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location.pathname],
  );

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Handle menu item click
  const handleMenuItemClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Navigation items configuration
  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      active: isActive("/"),
    },
    {
      icon: Heart,
      label: "Favorites",
      path: "/favorites",
      active: isActive("/favorites"),
    },
  ];

  return (
    <nav className={`bg-spotify-darker border-b border-spotify-gray px-4 py-3 sticky top-0 z-40 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-shadow duration-200">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">Spotify</span>
        </Link>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-md mx-4">
          <div className={`relative transition-all duration-200 ${isFocused ? "scale-105" : "scale-100"}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-lighterGray transition-colors duration-200" size={18} />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What do you want to listen to?"
              className={`w-full bg-spotify-gray text-white placeholder-spotify-lighterGray rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all duration-200 ${
                isFocused ? "bg-spotify-lighterGray" : ""
              }`}
            />

            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Clear button */}
            {query && !loading && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-lighterGray hover:text-white transition-colors duration-200"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-spotify-gray rounded-full flex items-center justify-center">
                  <User size={16} className="text-spotify-lighterGray" />
                </div>
                <span className="text-white text-sm font-medium hidden lg:block">User</span>
              </div>
            ) : (
              <button className="text-white text-sm font-medium hover:text-spotify-green transition-colors duration-200">Sign Up</button>
            )}
          </div>

          {/* Settings */}
          <button
            className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-spotify-gray"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 hover:bg-spotify-gray rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-spotify-darker border-b border-spotify-gray z-50 md:hidden">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuItemClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active ? "bg-spotify-gray text-white" : "text-spotify-lighterGray hover:text-white hover:bg-spotify-gray"
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-200 hover:scale-110 ${item.active ? "text-white" : "text-spotify-lighterGray"}`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* User section for mobile */}
            {!user && (
              <div className="pt-2 border-t border-spotify-gray mt-2">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-spotify-green text-black rounded-lg font-medium hover:bg-spotify-greenHover transition-colors duration-200">
                  <User size={20} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MyNavBar;
