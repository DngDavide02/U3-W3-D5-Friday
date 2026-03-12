// =============================================================================
// Enhanced Sidebar Component
// =============================================================================
// Modern, responsive sidebar with navigation and search functionality

import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Home, Heart, Library, PlusCircle, Download, ChevronLeft, ChevronRight, Music, Radio, Mic2 } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { useAppSelector } from "../store";
import { selectSidebarCollapsed } from "../store/uiSlice";

interface SidebarProps {
  className?: string;
}

/**
 * Enhanced Sidebar component with modern design and interactions
 * Features:
 * - Collapsible sidebar
 * - Global search functionality
 * - Navigation items with icons
 * - Responsive design
 * - Keyboard shortcuts support
 * - Smooth animations and transitions
 */
const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const { search, loading } = useSearch();
  const location = useLocation();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

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

  // Navigation items configuration
  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      active: isActive("/"),
    },
    {
      icon: Search,
      label: "Search",
      path: "/search",
      active: isActive("/search"),
    },
    {
      icon: Library,
      label: "Your Library",
      path: "/library",
      active: isActive("/library"),
    },
  ];

  const libraryItems = [
    {
      icon: PlusCircle,
      label: "Create Playlist",
      path: "/playlist/create",
      active: false,
    },
    {
      icon: Heart,
      label: "Liked Songs",
      path: "/favorites",
      active: isActive("/favorites"),
    },
    {
      icon: Download,
      label: "Downloaded",
      path: "/downloads",
      active: isActive("/downloads"),
    },
  ];

  const playlistItems = [
    {
      icon: Music,
      label: "My Playlist #1",
      path: "/playlist/1",
      active: isActive("/playlist/1"),
    },
    {
      icon: Radio,
      label: "Chill Vibes",
      path: "/playlist/2",
      active: isActive("/playlist/2"),
    },
    {
      icon: Mic2,
      label: "Podcasts",
      path: "/podcasts",
      active: isActive("/podcasts"),
    },
  ];

  return (
    <nav className={`w-full h-full bg-spotify-darker p-6 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "p-4" : "p-6"} ${className}`}>
      {/* Logo Section */}
      <div className={`mb-8 transition-all duration-300 ${sidebarCollapsed ? "flex justify-center" : ""}`}>
        <Link to="/" className={`flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-shadow duration-200">
            <span className="text-black font-bold text-xl">S</span>
          </div>
          {!sidebarCollapsed && <span className="text-white text-2xl font-bold">Spotify</span>}
        </Link>
      </div>

      {/* Search Section */}
      {!sidebarCollapsed && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-lighterGray pointer-events-none" size={20} />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to listen to?"
              className="w-full bg-spotify-gray text-white placeholder-spotify-lighterGray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all duration-200"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className={`flex-1 space-y-4 ${sidebarCollapsed ? "space-y-6" : "space-y-4"}`}>
        {/* Navigation Items */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group ${
                item.active ? "bg-spotify-gray text-white" : "text-spotify-lighterGray hover:text-white hover:bg-spotify-gray"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                size={24}
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  item.active ? "text-white" : "text-spotify-lighterGray group-hover:text-white"
                }`}
              />
              {!sidebarCollapsed && <span className="font-medium transition-all duration-200">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Library Section */}
        {!sidebarCollapsed && (
          <div className="space-y-1">
            <div className="text-spotify-lighterGray text-xs font-bold uppercase tracking-wider mb-2">Library</div>
            {libraryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group ${
                  item.active ? "bg-spotify-gray text-white" : "text-spotify-lighterGray hover:text-white hover:bg-spotify-gray"
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    item.active ? "text-white" : "text-spotify-lighterGray group-hover:text-white"
                  }`}
                />
                <span className="font-medium transition-all duration-200">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Playlists Section */}
        {!sidebarCollapsed && (
          <div className="space-y-1">
            <div className="text-spotify-lighterGray text-xs font-bold uppercase tracking-wider mb-2">Playlists</div>
            {playlistItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group ${
                  item.active ? "bg-spotify-gray text-white" : "text-spotify-lighterGray hover:text-white hover:bg-spotify-gray"
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    item.active ? "text-white" : "text-spotify-lighterGray group-hover:text-white"
                  }`}
                />
                <span className="font-medium transition-all duration-200">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className="mt-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center p-3 rounded-lg text-spotify-lighterGray hover:text-white hover:bg-spotify-gray transition-all duration-200"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
