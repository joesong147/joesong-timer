/**
 * Synchronization Module
 * Handles real-time communication between operator and projector windows
 * Uses BroadcastChannel API with fallback to Storage Events
 */

const Sync = (() => {
    let broadcastChannel = null;
    let isConnected = false;
    let listeners = {};
    const useBroadcastChannel = typeof BroadcastChannel !== 'undefined';

    /**
     * Initialize synchronization
     */
    const init = () => {
        if (useBroadcastChannel) {
            try {
                broadcastChannel = new BroadcastChannel('joesong-timer');
                broadcastChannel.onmessage = handleMessage;
                isConnected = true;
            } catch (error) {
                console.log('BroadcastChannel not available, using Storage Events');
                initStorageEvents();
            }
        } else {
            initStorageEvents();
        }
    };

    /**
     * Initialize storage events fallback
     */
    const initStorageEvents = () => {
        window.addEventListener('storage', (event) => {
            if (event.key && event.key.startsWith('joesong-timer-')) {
                try {
                    const data = JSON.parse(event.newValue || '{}');
                    const eventType = event.key.replace('joesong-timer-', '');
                    triggerListeners(eventType, data);
                } catch (e) {
                    console.error('Error parsing storage event:', e);
                }
            }
        });
    };

    /**
     * Handle incoming messages
     * @param {MessageEvent} event - The message event
     */
    const handleMessage = (event) => {
        const { type, data } = event.data;
        triggerListeners(type, data);
    };

    /**
     * Trigger all listeners for an event type
     * @param {string} type - Event type
     * @param {object} data - Event data
     */
    const triggerListeners = (type, data) => {
        if (listeners[type]) {
            listeners[type].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in listener for ${type}:`, error);
                }
            });
        }
    };

    /**
     * Broadcast message to other windows
     * @param {string} type - Event type
     * @param {object} data - Event data
     */
    const broadcast = (type, data) => {
        const message = { type, data };

        if (useBroadcastChannel && broadcastChannel) {
            try {
                broadcastChannel.postMessage(message);
            } catch (error) {
                console.error('Error broadcasting:', error);
                broadcastStorage(type, data);
            }
        } else {
            broadcastStorage(type, data);
        }
    };

    /**
     * Broadcast using storage events (fallback)
     * @param {string} type - Event type
     * @param {object} data - Event data
     */
    const broadcastStorage = (type, data) => {
        const key = `joesong-timer-${type}`;
        const value = JSON.stringify(data);
        try {
            localStorage.setItem(key, value);
            // Clear immediately to allow re-triggering same event
            setTimeout(() => {
                localStorage.removeItem(key);
            }, 100);
        } catch (error) {
            console.error('Error broadcasting via storage:', error);
        }
    };

    /**
     * Subscribe to an event type
     * @param {string} type - Event type
     * @param {function} callback - Callback function
     * @returns {function} Unsubscribe function
     */
    const subscribe = (type, callback) => {
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push(callback);

        // Return unsubscribe function
        return () => {
            listeners[type] = listeners[type].filter(cb => cb !== callback);
        };
    };

    /**
     * Set connection status
     * @param {boolean} connected - Connection status
     */
    const setConnected = (connected) => {
        isConnected = connected;
    };

    /**
     * Get connection status
     * @returns {boolean} Connection status
     */
    const getConnected = () => isConnected;

    /**
     * Send ping to check if projector is connected
     */
    const ping = () => {
        broadcast('ping', { timestamp: Date.now() });
    };

    return {
        init,
        broadcast,
        subscribe,
        setConnected,
        getConnected,
        ping
    };
})();