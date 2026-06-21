/**
 * Projector Module
 * Handles projector window display and sync
 */

const Projector = (() => {
    let elements = {};
    let currentState = {
        title: '',
        message: '',
        remaining: 0,
        isRunning: false,
        isPaused: false,
        theme: 'dark',
        alarm: true,
        colorState: 'normal'
    };

    /**
     * Initialize projector
     */
    const init = () => {
        cacheElements();
        setupEventListeners();
        applyTheme('dark');
        announcePresence();
    };

    /**
     * Cache DOM elements
     */
    const cacheElements = () => {
        elements = {
            projectorTitle: document.getElementById('projectorTitle'),
            projectorTimer: document.getElementById('projectorTimer'),
            projectorMessage: document.getElementById('projectorMessage'),
            timeUpDisplay: document.getElementById('timeUpDisplay')
        };
    };

    /**
     * Setup event listeners for sync
     */
    const setupEventListeners = () => {
        // Timer events
        Sync.subscribe('timer-update', handleTimerUpdate);
        Sync.subscribe('timer-reset', handleTimerReset);
        Sync.subscribe('timer-complete', handleTimerComplete);
        Sync.subscribe('duration-changed', handleDurationChanged);

        // Content events
        Sync.subscribe('title-changed', handleTitleChanged);
        Sync.subscribe('message-changed', handleMessageChanged);
        Sync.subscribe('theme-changed', handleThemeChanged);
        Sync.subscribe('alarm-changed', handleAlarmChanged);

        // Window events
        Sync.subscribe('projector-opened', handleProjectorOpened);

        // Operator events
        Sync.subscribe('timer-started', () => {});
        Sync.subscribe('timer-paused', () => {});
        Sync.subscribe('timer-stopped', () => {});

        // Announce connection every 5 seconds
        setInterval(announcePresence, 5000);
    };

    /**
     * Announce projector presence to operator
     */
    const announcePresence = () => {
        Sync.broadcast('projector-connected', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });
    };

    /**
     * Handle timer update
     * @param {object} data - Update data
     */
    const handleTimerUpdate = (data) => {
        currentState.remaining = data.remaining;
        currentState.isRunning = data.isRunning;
        currentState.isPaused = data.isPaused;
        updateDisplay();
    };

    /**
     * Handle timer reset
     * @param {object} data - Reset data
     */
    const handleTimerReset = (data) => {
        currentState.remaining = data.remaining;
        currentState.isRunning = data.isRunning;
        currentState.isPaused = data.isPaused;
        hideTimeUp();
        updateDisplay();
    };

    /**
     * Handle timer complete
     * @param {object} data - Complete data
     */
    const handleTimerComplete = (data) => {
        currentState.remaining = 0;
        currentState.isRunning = false;
        showTimeUp();
        updateDisplay();
    };

    /**
     * Handle duration changed
     * @param {object} data - Duration data
     */
    const handleDurationChanged = (data) => {
        currentState.remaining = data.remaining;
        updateDisplay();
    };

    /**
     * Handle title changed
     * @param {object} data - Title data
     */
    const handleTitleChanged = (data) => {
        currentState.title = data.title;
        elements.projectorTitle.textContent = data.title || 'Waiting for input';
    };

    /**
     * Handle message changed
     * @param {object} data - Message data
     */
    const handleMessageChanged = (data) => {
        currentState.message = data.message;
        elements.projectorMessage.textContent = data.message || '';
    };

    /**
     * Handle theme changed
     * @param {object} data - Theme data
     */
    const handleThemeChanged = (data) => {
        applyTheme(data.theme);
    };

    /**
     * Handle alarm changed
     * @param {object} data - Alarm data
     */
    const handleAlarmChanged = (data) => {
        currentState.alarm = data.enabled;
    };

    /**
     * Handle projector opened
     */
    const handleProjectorOpened = () => {
        announcePresence();
    };

    /**
     * Update timer display
     */
    const updateDisplay = () => {
        const timeString = TimerState.formatTime(currentState.remaining);
        elements.projectorTimer.textContent = timeString;
        currentState.colorState = TimerState.getColorState(currentState.remaining);
        elements.projectorTimer.className = `projector-timer timer-${currentState.colorState}`;
    };

    /**
     * Show TIME UP message
     */
    const showTimeUp = () => {
        elements.projectorTimer.style.display = 'none';
        elements.timeUpDisplay.style.display = 'block';
        document.body.classList.add('time-up-active');
    };

    /**
     * Hide TIME UP message
     */
    const hideTimeUp = () => {
        elements.projectorTimer.style.display = 'block';
        elements.timeUpDisplay.style.display = 'none';
        document.body.classList.remove('time-up-active');
    };

    /**
     * Apply theme
     * @param {string} theme - Theme name
     */
    const applyTheme = (theme) => {
        document.body.className = theme === 'dark' ? '' : `theme-${theme}`;
        currentState.theme = theme;
    };

    return {
        init
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Sync.init();
        TimerState.init();
        Projector.init();
    });
} else {
    Sync.init();
    TimerState.init();
    Projector.init();
}