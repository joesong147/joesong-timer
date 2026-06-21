/**
 * Storage Module
 * Handles persistent storage of application state
 * Uses localStorage with automatic save/restore
 */

const Storage = (() => {
    const STORAGE_KEYS = {
        TITLE: 'joesong_timer_title',
        MESSAGE: 'joesong_timer_message',
        DURATION_HOURS: 'joesong_timer_duration_hours',
        DURATION_MINUTES: 'joesong_timer_duration_minutes',
        DURATION_SECONDS: 'joesong_timer_duration_seconds',
        THEME: 'joesong_timer_theme',
        ALARM: 'joesong_timer_alarm'
    };

    /**
     * Save title to storage
     * @param {string} title - The title text
     */
    const saveTitle = (title) => {
        localStorage.setItem(STORAGE_KEYS.TITLE, title);
    };

    /**
     * Get title from storage
     * @returns {string} The stored title or empty string
     */
    const getTitle = () => {
        return localStorage.getItem(STORAGE_KEYS.TITLE) || '';
    };

    /**
     * Save message to storage
     * @param {string} message - The message text
     */
    const saveMessage = (message) => {
        localStorage.setItem(STORAGE_KEYS.MESSAGE, message);
    };

    /**
     * Get message from storage
     * @returns {string} The stored message or empty string
     */
    const getMessage = () => {
        return localStorage.getItem(STORAGE_KEYS.MESSAGE) || '';
    };

    /**
     * Save timer duration to storage
     * @param {number} hours - Hours
     * @param {number} minutes - Minutes
     * @param {number} seconds - Seconds
     */
    const saveDuration = (hours, minutes, seconds) => {
        localStorage.setItem(STORAGE_KEYS.DURATION_HOURS, String(hours));
        localStorage.setItem(STORAGE_KEYS.DURATION_MINUTES, String(minutes));
        localStorage.setItem(STORAGE_KEYS.DURATION_SECONDS, String(seconds));
    };

    /**
     * Get timer duration from storage
     * @returns {object} Object with hours, minutes, seconds
     */
    const getDuration = () => {
        return {
            hours: parseInt(localStorage.getItem(STORAGE_KEYS.DURATION_HOURS) || '0'),
            minutes: parseInt(localStorage.getItem(STORAGE_KEYS.DURATION_MINUTES) || '5'),
            seconds: parseInt(localStorage.getItem(STORAGE_KEYS.DURATION_SECONDS) || '0')
        };
    };

    /**
     * Save theme to storage
     * @param {string} theme - Theme name (dark, blue, green, light)
     */
    const saveTheme = (theme) => {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    };

    /**
     * Get theme from storage
     * @returns {string} The stored theme or 'dark'
     */
    const getTheme = () => {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    };

    /**
     * Save alarm setting to storage
     * @param {boolean} enabled - Whether alarm is enabled
     */
    const saveAlarm = (enabled) => {
        localStorage.setItem(STORAGE_KEYS.ALARM, String(enabled));
    };

    /**
     * Get alarm setting from storage
     * @returns {boolean} Whether alarm is enabled
     */
    const getAlarm = () => {
        const value = localStorage.getItem(STORAGE_KEYS.ALARM);
        return value === null ? true : value === 'true';
    };

    /**
     * Clear all stored data
     */
    const clearAll = () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    };

    return {
        saveTitle,
        getTitle,
        saveMessage,
        getMessage,
        saveDuration,
        getDuration,
        saveTheme,
        getTheme,
        saveAlarm,
        getAlarm,
        clearAll
    };
})();