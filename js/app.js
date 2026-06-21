/**
 * Main Application Module
 * Initializes all modules and coordinates the application
 */

const App = (() => {
    /**
     * Initialize the application
     */
    const init = () => {
        console.log('Joesong Timer - Initializing...');
        
        // Initialize modules in order
        Sync.init();
        TimerState.init();
        UI.init();
        
        console.log('Joesong Timer - Ready!');
        
        // Periodically check for projector
        checkProjectorConnection();
    };

    /**
     * Check projector connection status
     */
    const checkProjectorConnection = () => {
        setInterval(() => {
            // This is handled by projector announcements
            // If we haven't heard from projector in 10 seconds, mark as disconnected
        }, 10000);
    };

    return {
        init
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}