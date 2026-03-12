import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  togglePlayPause,
  seekForward,
  seekBackward,
  setVolume,
  toggleMute,
  toggleShuffle,
  cycleRepeatMode,
} from '../store/playerSlice';

/**
 * Custom hook for handling keyboard controls for the music player
 * Supports standard media keys and custom keybindings
 */
export const useKeyboardControls = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const { key, ctrlKey, shiftKey, metaKey } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      // Prevent default for media keys to avoid browser conflicts
      switch (key) {
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          dispatch(togglePlayPause());
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (shiftKey) {
            // Shift + Arrow Left: Seek backward 30 seconds
            dispatch(seekBackward(30));
          } else if (cmdOrCtrl) {
            // Cmd/Ctrl + Arrow Left: Previous track (placeholder)
            console.log('Previous track - not implemented');
          } else {
            // Arrow Left: Seek backward 5 seconds
            dispatch(seekBackward(5));
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (shiftKey) {
            // Shift + Arrow Right: Seek forward 30 seconds
            dispatch(seekForward(30));
          } else if (cmdOrCtrl) {
            // Cmd/Ctrl + Arrow Right: Next track (placeholder)
            console.log('Next track - not implemented');
          } else {
            // Arrow Right: Seek forward 5 seconds
            dispatch(seekForward(5));
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (shiftKey) {
            // Shift + Arrow Up: Volume up 20%
            dispatch(setVolume(0.2));
          } else {
            // Arrow Up: Volume up 10%
            dispatch(setVolume(0.1));
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (shiftKey) {
            // Shift + Arrow Down: Volume down 20%
            dispatch(setVolume(-0.2));
          } else {
            // Arrow Down: Volume down 10%
            dispatch(setVolume(-0.1));
          }
          break;

        case 'm':
        case 'M':
          event.preventDefault();
          dispatch(toggleMute());
          break;

        case 's':
        case 'S':
          event.preventDefault();
          dispatch(toggleShuffle());
          break;

        case 'r':
        case 'R':
          event.preventDefault();
          dispatch(cycleRepeatMode());
          break;

        // Media keys (supported by many keyboards)
        case 'MediaPlayPause':
          event.preventDefault();
          dispatch(togglePlayPause());
          break;

        case 'MediaTrackNext':
          event.preventDefault();
          console.log('Next track - not implemented');
          break;

        case 'MediaTrackPrevious':
          event.preventDefault();
          console.log('Previous track - not implemented');
          break;

        case 'MediaStop':
          event.preventDefault();
          dispatch(togglePlayPause());
          break;
      }
    };

    // Add event listener for keyboard controls
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
};
