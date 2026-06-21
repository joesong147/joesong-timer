/**
 * Timer Module
 * Core countdown timer logic
 * Handles timing, state management, and color states
 */

const TimerState = (() => {
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;
    let isPaused = false;
    let intervalId = null;

    /**
     * Initialize timer with hours, minutes, seconds
     * @param {number} hours - Hours
     * @param {number} minutes - Minutes
     * @param {number} seconds - Seconds
     */
    const init = (hours = 0, minutes = 5, seconds = 0) => {
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
        remainingSeconds = totalSeconds;
        isRunning = false;
        isPaused = false;
        if (intervalId) clearInterval(intervalId);
    };

    /**
     * Start the timer
     */
    const start = () => {
        if (remainingSeconds <= 0) return;
        isRunning = true;
        isPaused = false;

        intervalId = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds < 0) remainingSeconds = 0;

            // Trigger update callbacks
            Sync.broadcast('timer-update', {
                remaining: remainingSeconds,
                isRunning: true,
                isPaused: false
            });

            if (remainingSeconds === 0) {
                stop();
                Sync.broadcast('timer-complete', {
                    remaining: 0,
                    isRunning: false,
                    isPaused: false
                });
            }
        }, 1000);
    };

    /**
     * Pause the timer
     */
    const pause = () => {
        if (!isRunning) return;
        isRunning = false;
        isPaused = true;
        if (intervalId) clearInterval(intervalId);
    };

    /**
     * Resume the timer from pause
     */
    const resume = () => {
        if (!isPaused || remainingSeconds <= 0) return;
        start();
    };

    /**
     * Stop the timer
     */
    const stop = () => {
        isRunning = false;
        isPaused = false;
        if (intervalId) clearInterval(intervalId);
    };

    /**
     * Reset timer to initial value
     */
    const reset = () => {
        stop();
        remainingSeconds = totalSeconds;
        Sync.broadcast('timer-reset', {
            remaining: remainingSeconds,
            isRunning: false,
            isPaused: false
        });
    };

    /**
     * Set custom duration
     * @param {number} hours - Hours
     * @param {number} minutes - Minutes
     * @param {number} seconds - Seconds
     */
    const setDuration = (hours, minutes, seconds) => {
        stop();
        init(hours, minutes, seconds);
        Sync.broadcast('duration-changed', {
            remaining: remainingSeconds,
            isRunning: false,
            isPaused: false
        });
    };

    /**
     * Get formatted time string
     * @param {number} seconds - Number of seconds
     * @returns {string} Formatted time (HH:MM:SS)
     */
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    /**
     * Get color state based on remaining time
     * @param {number} remaining - Remaining seconds
     * @returns {string} Color state: 'normal', 'yellow', 'amber', 'red'
     */
    const getColorState = (remaining) => {
        if (remaining > 120) return 'normal';      // > 2:00 = white
        if (remaining >= 61) return 'yellow';      // 2:00 to 1:01 = yellow
        if (remaining >= 11) return 'amber';       // 1:00 to 0:11 = flashing amber
        if (remaining > 0) return 'red';           // 0:10 to 0:01 = flashing red
        return 'zero';                             // 0:00 = flashing red background
    };

    /**
     * Get timer state
     * @returns {object} Current timer state
     */
    const getState = () => ({
        totalSeconds,
        remainingSeconds,
        isRunning,
        isPaused,
        formattedTime: formatTime(remainingSeconds),
        colorState: getColorState(remainingSeconds)
    });

    return {
        init,
        start,
        pause,
        resume,
        stop,
        reset,
        setDuration,
        formatTime,
        getColorState,
        getState
    };
})();