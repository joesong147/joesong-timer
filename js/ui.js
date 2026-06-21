/**
 * UI Module
 * Handles all UI updates and interactions
 * Manages DOM elements, event listeners, and visual states
 */

const UI = (() => {
    let elements = {};
    let projectorWindow = null;

    /**
     * Initialize UI elements
     */
    const init = () => {
        cacheElements();
        setupEventListeners();
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        restoreState();
    };

    /**
     * Cache all DOM elements
     */
    const cacheElements = () => {
        elements = {
            // Inputs
            titleInput: document.getElementById('titleInput'),
            messageInput: document.getElementById('messageInput'),
            hoursInput: document.getElementById('hoursInput'),
            minutesInput: document.getElementById('minutesInput'),
            secondsInput: document.getElementById('secondsInput'),
            alarmCheckbox: document.getElementById('alarmCheckbox'),

            // Buttons
            updateTitleBtn: document.getElementById('updateTitleBtn'),
            updateMessageBtn: document.getElementById('updateMessageBtn'),
            applyDurationBtn: document.getElementById('applyDurationBtn'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            resetBtn: document.getElementById('resetBtn'),
            projectorBtn: document.getElementById('projectorBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            presetBtns: document.querySelectorAll('.btn-preset'),
            themeBtns: document.querySelectorAll('.btn-theme'),

            // Display
            currentTime: document.getElementById('currentTime'),
            statusIndicator: document.getElementById('statusIndicator'),
            statusText: document.getElementById('statusText'),
            previewTitle: document.getElementById('previewTitle'),
            previewTimer: document.getElementById('previewTimer'),
            previewMessage: document.getElementById('previewMessage')
        };
    };

    /**
     * Setup all event listeners
     */
    const setupEventListeners = () => {
        // Title
        elements.updateTitleBtn.addEventListener('click', handleUpdateTitle);
        elements.titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUpdateTitle();
        });

        // Message
        elements.updateMessageBtn.addEventListener('click', handleUpdateMessage);

        // Duration
        elements.applyDurationBtn.addEventListener('click', handleApplyDuration);
        elements.presetBtns.forEach(btn => {
            btn.addEventListener('click', handlePreset);
        });

        // Timer controls
        elements.startBtn.addEventListener('click', handleStart);
        elements.pauseBtn.addEventListener('click', handlePause);
        elements.stopBtn.addEventListener('click', handleStop);
        elements.resetBtn.addEventListener('click', handleReset);

        // Projector
        elements.projectorBtn.addEventListener('click', handleOpenProjector);
        elements.fullscreenBtn.addEventListener('click', handleFullscreen);

        // Theme
        elements.themeBtns.forEach(btn => {
            btn.addEventListener('click', handleThemeChange);
        });

        // Alarm
        elements.alarmCheckbox.addEventListener('change', handleAlarmChange);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);

        // Subscribe to sync events
        Sync.subscribe('timer-update', updateTimerDisplay);
        Sync.subscribe('timer-reset', updateTimerDisplay);
        Sync.subscribe('timer-complete', handleTimerComplete);
        Sync.subscribe('duration-changed', updateTimerDisplay);
        Sync.subscribe('projector-connected', handleProjectorConnected);
        Sync.subscribe('projector-disconnected', handleProjectorDisconnected);
    };

    /**
     * Update current time display
     */
    const updateCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        elements.currentTime.textContent = `${hours}:${minutes}:${seconds}`;
    };

    /**
     * Handle title update
     */
    const handleUpdateTitle = () => {
        const title = elements.titleInput.value.trim();
        Storage.saveTitle(title);
        elements.previewTitle.textContent = title || 'Enter title';
        Sync.broadcast('title-changed', { title });
    };

    /**
     * Handle message update
     */
    const handleUpdateMessage = () => {
        const message = elements.messageInput.value.trim();
        Storage.saveMessage(message);
        elements.previewMessage.textContent = message || '';
        Sync.broadcast('message-changed', { message });
    };

    /**
     * Handle duration apply
     */
    const handleApplyDuration = () => {
        const hours = parseInt(elements.hoursInput.value) || 0;
        const minutes = parseInt(elements.minutesInput.value) || 0;
        const seconds = parseInt(elements.secondsInput.value) || 0;

        Storage.saveDuration(hours, minutes, seconds);
        TimerState.setDuration(hours, minutes, seconds);
        updateTimerDisplay();
    };

    /**
     * Handle preset selection
     * @param {Event} e - Click event
     */
    const handlePreset = (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        elements.hoursInput.value = '0';
        elements.minutesInput.value = String(minutes);
        elements.secondsInput.value = '0';
        handleApplyDuration();
    };

    /**
     * Handle start button
     */
    const handleStart = () => {
        TimerState.start();
        updateButtonStates();
        Sync.broadcast('timer-started', {});
    };

    /**
     * Handle pause button
     */
    const handlePause = () => {
        const state = TimerState.getState();
        if (state.isPaused) {
            TimerState.resume();
        } else {
            TimerState.pause();
        }
        updateButtonStates();
        Sync.broadcast('timer-paused', {});
    };

    /**
     * Handle stop button
     */
    const handleStop = () => {
        TimerState.stop();
        updateButtonStates();
        Sync.broadcast('timer-stopped', {});
    };

    /**
     * Handle reset button
     */
    const handleReset = () => {
        TimerState.reset();
        updateButtonStates();
        updateTimerDisplay();
    };

    /**
     * Handle timer complete
     */
    const handleTimerComplete = () => {
        updateButtonStates();
        if (elements.alarmCheckbox.checked) {
            playAlarm();
        }
        Sync.broadcast('timer-completed', {});
    };

    /**
     * Handle projector connection
     */
    const handleProjectorConnected = () => {
        elements.statusIndicator.classList.add('connected');
        elements.statusText.textContent = 'Projector Connected';
    };

    /**
     * Handle projector disconnection
     */
    const handleProjectorDisconnected = () => {
        elements.statusIndicator.classList.remove('connected');
        elements.statusText.textContent = 'Waiting for Projector';
    };

    /**
     * Handle open projector
     */
    const handleOpenProjector = () => {
        if (projectorWindow && !projectorWindow.closed) {
            projectorWindow.focus();
        } else {
            projectorWindow = window.open('projector.html', 'joesong-projector', 
                'fullscreen=yes,menubar=no,toolbar=no,location=no,status=no');
            if (projectorWindow) {
                Sync.broadcast('projector-opened', {});
                elements.statusIndicator.classList.add('connected');
                elements.statusText.textContent = 'Projector Connected';
            }
        }
    };

    /**
     * Handle fullscreen
     */
    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(() => {
                console.log('Fullscreen not available');
            });
        }
    };

    /**
     * Handle theme change
     * @param {Event} e - Click event
     */
    const handleThemeChange = (e) => {
        const theme = e.target.dataset.theme;
        applyTheme(theme);
        Storage.saveTheme(theme);
        Sync.broadcast('theme-changed', { theme });
    };

    /**
     * Handle alarm checkbox
     */
    const handleAlarmChange = () => {
        Storage.saveAlarm(elements.alarmCheckbox.checked);
        Sync.broadcast('alarm-changed', { enabled: elements.alarmCheckbox.checked });
    };

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleKeyboardShortcuts = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                handleStart();
                break;
            case 'KeyR':
                handleReset();
                break;
            case 'KeyS':
                handleStop();
                break;
            case 'KeyP':
                handleOpenProjector();
                break;
            case 'KeyF':
                handleFullscreen();
                break;
        }
    };

    /**
     * Update timer display
     */
    const updateTimerDisplay = () => {
        const state = TimerState.getState();
        const timeString = state.formattedTime;
        elements.previewTimer.textContent = timeString;
        elements.previewTimer.className = `projector-timer timer-${state.colorState}`;
        updateButtonStates();
    };

    /**
     * Update button states based on timer state
     */
    const updateButtonStates = () => {
        const state = TimerState.getState();
        
        if (state.isRunning) {
            elements.startBtn.style.display = 'none';
            elements.pauseBtn.style.display = 'flex';
            elements.pauseBtn.textContent = '\u23f8 Pause';
        } else if (state.isPaused) {
            elements.startBtn.style.display = 'none';
            elements.pauseBtn.style.display = 'flex';
            elements.pauseBtn.textContent = '\u25b6 Resume';
        } else {
            elements.startBtn.style.display = 'flex';
            elements.pauseBtn.style.display = 'none';
        }
    };

    /**
     * Apply theme
     * @param {string} theme - Theme name
     */
    const applyTheme = (theme) => {
        document.body.className = theme === 'dark' ? '' : `theme-${theme}`;
        elements.themeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        Sync.broadcast('theme-changed', { theme });
    };

    /**
     * Set connection status
     * @param {boolean} connected - Connection status
     */
    const setConnectionStatus = (connected) => {
        if (connected) {
            elements.statusIndicator.classList.add('connected');
            elements.statusText.textContent = 'Projector Connected';
        } else {
            elements.statusIndicator.classList.remove('connected');
            elements.statusText.textContent = 'Waiting for Projector';
        }
    };

    /**
     * Play alarm sound
     */
    const playAlarm = () => {
        const audio = document.getElementById('alarmAudio');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                console.log('Audio playback failed');
            });
        }
    };

    /**
     * Restore application state from storage
     */
    const restoreState = () => {
        // Restore title
        const title = Storage.getTitle();
        elements.titleInput.value = title;
        elements.previewTitle.textContent = title || 'Enter title';

        // Restore message
        const message = Storage.getMessage();
        elements.messageInput.value = message;
        elements.previewMessage.textContent = message || '';

        // Restore duration
        const duration = Storage.getDuration();
        elements.hoursInput.value = duration.hours;
        elements.minutesInput.value = duration.minutes;
        elements.secondsInput.value = duration.seconds;
        TimerState.init(duration.hours, duration.minutes, duration.seconds);
        updateTimerDisplay();

        // Restore theme
        const theme = Storage.getTheme();
        applyTheme(theme);

        // Restore alarm
        const alarmEnabled = Storage.getAlarm();
        elements.alarmCheckbox.checked = alarmEnabled;
    };

    return {
        init,
        updateTimerDisplay,
        setConnectionStatus,
        playAlarm
    };
})();