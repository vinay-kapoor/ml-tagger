// Debug utility functions
export const debug = {
    // Log network requests with formatting
    logRequest: (method, url, body) => {
        console.group(`🌐 Request: ${method} ${url}`);
        console.log('Time:', new Date().toISOString());
        if (body) {
            console.log('Body:', body);
        }
        console.groupEnd();
    },
    
    // Log network responses with formatting
    logResponse: (method, url, status, data) => {
        console.group(`🌐 Response: ${method} ${url}`);
        console.log('Status:', status);
        console.log('Time:', new Date().toISOString());
        console.log('Data:', data);
        console.groupEnd();
    },
    
    // Log errors with formatting
    logError: (message, error) => {
        console.group('❌ Error');
        console.error(message);
        if (error) {
            console.error('Details:', error);
        }
        console.groupEnd();
    },
    
    // Performance measurement
    startTimer: (label) => {
        console.time(`⏱️ ${label}`);
        return () => console.timeEnd(`⏱️ ${label}`);
    }
};