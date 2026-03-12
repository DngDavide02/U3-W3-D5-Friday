# Spotify Clone - Modern Music Streaming App

A fully refactored Spotify-like music streaming application built with modern frontend technologies, featuring a clean UI/UX design and comprehensive functionality.

## 🎵 Features

- **Modern UI/UX Design**: Clean, responsive interface inspired by Spotify's design language
- **Music Discovery**: Browse music by genres (Rock, Pop, Hip Hop)
- **Search Functionality**: Search for songs and artists in real-time
- **Favorites System**: Like and save your favorite tracks
- **Music Player**: Full-featured player with play/pause, progress bar, and controls
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **English Localization**: All content translated to natural English

## 🛠️ Tech Stack

### Frontend Technologies

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast development build tool

### State Management

- **Redux Toolkit** - Modern Redux with simplified API
- **React Redux** - Official React bindings for Redux

### UI Components

- **Lucide React** - Beautiful, consistent icons
- **Custom Components** - Reusable, modular component architecture

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx      # Desktop navigation sidebar
│   ├── MyNavBar.tsx     # Mobile navigation bar
│   ├── Player.tsx       # Music player controls
│   ├── TrackCard.tsx    # Individual track display
│   ├── MusicSection.tsx # Genre-based music sections
│   ├── MainSection.tsx  # Main content area
│   └── FavouritesPage.tsx # Favorites collection
├── store/               # Redux store configuration
│   ├── index.ts         # Store setup
│   ├── playerSlice.ts   # Player state management
│   ├── likeSlice.ts     # Favorites state management
│   └── searchSlice.ts   # Search state management
├── types/               # TypeScript type definitions
│   └── index.ts         # Core type interfaces
├── App.tsx              # Root application component
├── main.tsx             # Application entry point
└── index.css            # Tailwind CSS and custom styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎨 Design System

### Color Palette

- **Primary Green**: `#1DB954` (Spotify brand color)
- **Dark Backgrounds**: `#121212`, `#181818`, `#282828`
- **Text Colors**: `#FFFFFF`, `#B3B3B3`, `#535353`

### Typography

- **Font Family**: Inter (modern, clean sans-serif)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Component Patterns

- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Rounded, with smooth transitions
- **Navigation**: Clean, intuitive with active states
- **Player Controls**: Accessible with visual feedback

## 🔄 Key Improvements

### From Original to Refactored

1. **Technology Stack**
   - ❌ Bootstrap → ✅ Tailwind CSS
   - ❌ JavaScript → ✅ TypeScript
   - ❌ React Icons → ✅ Lucide React

2. **UI/UX Enhancements**
   - Modern color scheme matching Spotify's design
   - Improved responsive layout
   - Better hover states and micro-interactions
   - Enhanced accessibility with proper ARIA labels

3. **Code Quality**
   - Type safety with TypeScript interfaces
   - Modular component architecture
   - Clean Redux store with proper typing
   - Reusable CSS classes and components

4. **Content Localization**
   - All Italian text translated to English
   - Natural, user-friendly copy
   - Consistent terminology throughout

## 🎯 Components Overview

### Sidebar

- Desktop navigation with search functionality
- Clean navigation links with active states
- Authentication buttons (Sign Up/Login)
- Modern Spotify-style design

### Mobile Navbar

- Responsive hamburger menu
- Integrated search bar
- Smooth slide-down navigation

### Player

- Fixed bottom position
- Track information display
- Playback controls (play/pause, skip, shuffle, repeat)
- Interactive progress bar with time display

### Track Cards

- Hover effects with play button overlay
- Like/favorite functionality
- Multiple size variants
- Smooth animations and transitions

### Music Sections

- Genre-based content organization
- Grid layout with responsive breakpoints
- Loading states with skeleton screens
- "Show all" functionality

## 🔧 Development Notes

### TypeScript Configuration

- Strict type checking enabled
- Path aliases configured for clean imports
- Proper React component typing

### Tailwind CSS Setup

- Custom color palette for Spotify branding
- Component classes for consistent styling
- Responsive breakpoints optimized for all devices

### Redux Store Structure

- Separate slices for player, likes, and search
- Type-safe actions and state
- Optimized re-renders with proper selectors

## 🌐 API Integration

The application integrates with the Deezer API for music data:

- **Search Endpoint**: Real-time song and artist search
- **Genre-based Discovery**: Curated music by genre
- **Track Metadata**: Comprehensive track information

## 📱 Responsive Design

- **Mobile**: 320px - 768px (single column, hamburger menu)
- **Tablet**: 768px - 1024px (multi-column grids)
- **Desktop**: 1024px+ (full sidebar, optimal layout)

## 🎵 Future Enhancements

- User authentication and playlists
- Audio visualization
- Social features and sharing
- Offline mode support
- Advanced search filters
- Podcast integration

## 📄 License

This project is a refactored version of an educational exercise and is intended for learning purposes only.
