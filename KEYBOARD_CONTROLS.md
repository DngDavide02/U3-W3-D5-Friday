# Music Player Keyboard Controls

## Overview
The enhanced music player supports comprehensive keyboard controls for all major functions. Controls are designed to be intuitive and follow common media player conventions.

## 🎹 Keyboard Shortcuts

### Playback Controls
| Key | Action | Description |
|-----|--------|-------------|
| `Space` | **Play/Pause** | Toggle between play and pause states |
| `K` | **Play/Pause** | Alternative play/pause toggle (YouTube style) |

### Seek Controls
| Key | Action | Description |
|-----|--------|-------------|
| `←` | **Seek Backward 5s** | Jump back 5 seconds |
| `→` | **Seek Forward 5s** | Jump forward 5 seconds |
| `Shift + ←` | **Seek Backward 30s** | Jump back 30 seconds |
| `Shift + →` | **Seek Forward 30s** | Jump forward 30 seconds |
| `Ctrl/Cmd + ←` | **Previous Track** | Go to previous track (placeholder) |
| `Ctrl/Cmd + →` | **Next Track** | Go to next track (placeholder) |
| `J` | **Seek Backward 10s** | Jump back 10 seconds |
| `L` | **Seek Forward 10s** | Jump forward 10 seconds |

### Volume Controls
| Key | Action | Description |
|-----|--------|-------------|
| `↑` | **Volume Up 10%** | Increase volume by 10% |
| `↓` | **Volume Down 10%** | Decrease volume by 10% |
| `Shift + ↑` | **Volume Up 20%** | Increase volume by 20% |
| `Shift + ↓` | **Volume Down 20%** | Decrease volume by 20% |
| `M` | **Toggle Mute** | Mute/unmute audio |
| `0-9` | **Volume Presets** | Set volume to 0%, 10%, 20%, ..., 90% |

### Mode Controls
| Key | Action | Description |
|-----|--------|-------------|
| `S` | **Toggle Shuffle** | Enable/disable shuffle mode |
| `R` | **Cycle Repeat** | Cycle through repeat modes (Off → One → All) |
| `F` | **Toggle Fullscreen** | Toggle fullscreen mode (placeholder) |

### Media Keys (Hardware Keyboards)
| Key | Action | Description |
|-----|--------|-------------|
| `MediaPlayPause` | **Play/Pause** | Hardware play/pause button |
| `MediaTrackNext` | **Next Track** | Hardware next button |
| `MediaTrackPrevious` | **Previous Track** | Hardware previous button |
| `MediaStop` | **Stop** | Hardware stop button |

## 🖱️ Mouse Controls

### Progress Bar
- **Click**: Jump to clicked position
- **Drag**: Scrub through the track
- **Keyboard Focus**: Tab to progress bar, use arrow keys to seek

### Volume Slider
- **Hover**: Shows volume slider popup
- **Click/Drag**: Adjust volume
- **Keyboard Focus**: Tab to volume button, use arrow keys

### Control Buttons
- **Click**: Activate button function
- **Keyboard Focus**: Tab navigation supported
- **Enter/Space**: Activate focused button

## ♿ Accessibility Features

### ARIA Labels
All controls include proper ARIA labels for screen readers:
- Play/Pause button: Announces current state
- Progress bar: Announces current time and duration
- Volume slider: Announces current volume percentage
- Mode buttons: Announce current mode state

### Keyboard Navigation
- **Tab**: Move between controls
- **Shift + Tab**: Reverse navigation
- **Enter/Space**: Activate focused control
- **Arrow Keys**: Adjust sliders and values
- **Escape**: Close popups (volume slider)

### Visual Feedback
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Hover States**: Clear visual feedback on mouse hover
- **Active States**: Visual indication of active buttons
- **Progress Visualization**: Clear progress bar with time display

## 🔧 Technical Implementation

### State Management
All player state is managed through Redux Toolkit:
```typescript
interface PlayerState {
  currentSong: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  currentTime: number;
  duration: number;
}
```

### Custom Hook
Keyboard controls are implemented through `useKeyboardControls` hook:
- Event listeners for keyboard shortcuts
- Context-aware (ignores input when typing)
- Cleanup on component unmount
- Cross-browser compatible

### Component Architecture
- **Player.tsx**: Main player component with controls
- **VolumeControl.tsx**: Dedicated volume control component
- **useKeyboardControls.ts**: Custom hook for keyboard handling
- **playerSlice.ts**: Redux state management

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Media Key Support
- ✅ Chrome (Full support)
- ✅ Edge (Full support)
- ⚠️ Firefox (Limited support)
- ⚠️ Safari (Limited support)

## 📱 Mobile Considerations

### Touch Controls
- Progress bar: Tap to seek, drag to scrub
- Volume: System volume controls preferred
- Buttons: Large touch targets (44px minimum)

### Keyboard Support
- External keyboards supported
- Same shortcuts as desktop version
- Context-aware (ignores when typing in inputs)

## 🎯 Best Practices

### Performance
- Event listeners properly cleaned up
- Debounced seek operations during drag
- Optimized Redux selectors
- Minimal re-renders

### User Experience
- Intuitive key mappings
- Visual feedback for all actions
- Graceful error handling
- Consistent behavior across platforms

### Code Quality
- TypeScript for type safety
- Comprehensive error handling
- Modular component architecture
- Clear documentation and comments

## 🔧 Troubleshooting

### Common Issues

**Keyboard shortcuts not working:**
- Ensure you're not typing in an input field
- Try refreshing the page
- Check browser console for errors

**Volume controls not responding:**
- Check if audio is playing
- Verify system volume isn't muted
- Try clicking the volume button first

**Progress bar not updating:**
- Ensure audio metadata is loaded
- Check if track duration is available
- Verify network connection for audio streaming

### Debug Information
The player logs useful debug information to the console:
- Playback errors
- State changes
- Event listener status
- Performance metrics

## 🚀 Future Enhancements

### Planned Features
- [ ] Playlist navigation shortcuts
- [ ] Speed/pitch controls
- [ ] Equalizer controls
- [ ] Gesture controls for touch devices
- [ ] Voice commands support
- [ ] Customizable shortcuts

### Extensibility
The modular architecture allows for easy extension:
- Add new keyboard shortcuts in `useKeyboardControls.ts`
- Extend Redux state in `playerSlice.ts`
- Add new UI components following existing patterns
- Customize styling through Tailwind CSS classes
