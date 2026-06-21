# Joesong Timer

**Professional Presentation Countdown Timer**

A production-quality web application built with vanilla HTML5, CSS3, and JavaScript (ES6) for managing presentation countdowns in churches, conferences, seminars, and events.

## Features

### Two-Window Architecture

1. **Operator Window** (`index.html`)
   - Master control interface
   - Title and message inputs
   - Timer duration settings with quick presets (5-60 minutes)
   - Real-time timer controls (Start, Pause, Stop, Reset)
   - Live preview of projector display
   - Theme selection (Dark, Blue, Green, Light)
   - Alarm settings
   - Keyboard shortcuts

2. **Projector Window** (`projector.html`)
   - Full-screen presentation display
   - Large, centered timer
   - Title and message display
   - Optimized for projection
   - No controls or distractions

### Real-Time Synchronization

- **BroadcastChannel API** for cross-window communication
- **Storage Events Fallback** for older browsers
- Automatic synchronization of:
  - Title and message
  - Timer state (running, paused, stopped)
  - Duration changes
  - Theme changes
  - Alarm settings
  - Connection status

### Timer Features

- **Countdown Format**: HH:MM:SS
- **Color Coding**:
  - White: Time remaining > 2:00
  - Yellow: 2:00 to 1:01
  - Amber (flashing): 1:00 to 0:11
  - Red (fast flashing): 0:10 to 0:01
  - Red background pulse: 0:00
- **Audio Alarm**: Bell sound at zero (optional)
- **TIME UP Display**: Large, flashing message

### User Interface

- Modern dark theme (default)
- Multiple theme options
- Responsive design
- Professional appearance
- Smooth animations and transitions
- Keyboard shortcuts for all major functions

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause |
| `R` | Reset |
| `S` | Stop |
| `P` | Open/Focus Projector |
| `F` | Toggle Fullscreen |

### Browser Support

- Google Chrome (latest)
- Microsoft Edge (latest)
- Mozilla Firefox (latest)
- Opera (latest)

## Project Structure

```
JoesongTimer/
├── index.html              # Operator window
├── projector.html          # Projector window
├── css/
│   ├── style.css          # Operator window styles
│   └── projector.css      # Projector window styles
├── js/
│   ├── app.js             # Main application module
│   ├── timer.js           # Timer state management
│   ├── sync.js            # Cross-window synchronization
│   ├── ui.js              # UI updates and interactions
│   ├── storage.js         # Persistent storage
│   └── projector.js       # Projector window logic
├── sounds/
│   └── bell.mp3           # Alarm sound
├── images/
│   └── logo.png           # Application logo
└── README.md              # This file
```

## Getting Started

### Installation

1. Clone or download the repository
2. Ensure all files are in the correct directory structure
3. Place an MP3 alarm sound at `sounds/bell.mp3` (optional)

### Usage

1. Open `index.html` in Chrome, Edge, Firefox, or Opera
2. Set your presentation title and message
3. Configure the timer duration or select a quick preset
4. Click "Open Projector" or press `P` to open the projector window
5. Position the projector window on your display screen
6. Use the controls to manage the countdown

### Auto-Save

The application automatically saves:
- Title and message
- Last used timer duration
- Theme preference
- Alarm setting

These settings are restored when you reopen the application.

## Technical Details

### Modules

#### `storage.js`
Handles persistent storage using browser's `localStorage`. Saves and restores application state.

#### `timer.js`
Core countdown logic with state management. Handles:
- Timer initialization
- Start, pause, resume, stop, reset
- Time formatting
- Color state calculation

#### `sync.js`
Real-time synchronization between operator and projector windows.
- BroadcastChannel primary method
- Storage Events fallback
- Event broadcasting and subscription

#### `ui.js`
UI layer managing:
- DOM element caching
- Event listeners
- Display updates
- Theme management
- Keyboard shortcuts
- State restoration

#### `projector.js`
Projector window logic:
- Sync event handling
- Display updates
- Theme application
- Presence announcement

#### `app.js`
Main application module:
- Module initialization
- Application coordination

## Design Principles

1. **Modularity**: Each module has a single responsibility
2. **Separation of Concerns**: Logic, storage, UI, and sync are separate
3. **No Dependencies**: Pure vanilla JavaScript with no frameworks
4. **Accessibility**: Keyboard shortcuts and semantic HTML
5. **Performance**: Optimized animations and efficient DOM updates
6. **Reliability**: Fallback mechanisms for cross-browser compatibility

## Color Themes

### Dark (Default)
Professional dark theme with cyan accents.

### Blue
Dark blue theme with blue accents.

### Green
Dark green theme with green accents.

### Light
Bright light theme for well-lit environments.

## Notes

- The application stores data in browser's localStorage
- Projector synchronization works across browser tabs and windows on the same computer
- For best results, use a dedicated display for the projector window
- Audio playback requires user interaction to be initiated
- Fullscreen mode works best in Chrome and Edge

## Troubleshooting

### Projector not connecting
- Ensure projector.html is in the same directory
- Check browser console for errors
- Try clicking "Open Projector" again
- Verify popup blockers aren't preventing the window

### Audio not playing
- Ensure `sounds/bell.mp3` exists
- Check browser volume and autoplay permissions
- Try clicking the page first, then starting timer

### Settings not saving
- Check if localStorage is enabled
- Verify browser isn't in private/incognito mode
- Check available disk space

## License

This project is provided as-is for use in presentations and events.

## Support

For issues or suggestions, please check the README and browser console for error messages.