
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './hooks/useToast';
import { AppConfigProvider } from './contexts/AppConfigContext';
import { ClassroomProvider } from './contexts/ClassroomContext';
import { LanguageProvider } from './contexts/LanguageContext';

// --- SYSTEM STABILITY ---
// Clear console to remove clutter on reload
console.clear();

function initializeApp() {
    const container = document.getElementById('root');
    
    // Version Control for Data Safety
    const CURRENT_VERSION = '7.1.0-STABLE';
    const storedVersion = localStorage.getItem('sarthi_app_version');

    if (storedVersion !== CURRENT_VERSION) {
        console.log("System Update Detected: Refreshing Caches");
        // Only clear non-essential data if version mismatch
        // We keep 'sarthi_logged_user' to avoid logging users out unnecessarily if possible,
        // unless it's a major breaking change. For now, we perform a safe cleanup.
        if (!localStorage.getItem('sarthi_logged_user')) {
             localStorage.clear();
        }
        localStorage.setItem('sarthi_app_version', CURRENT_VERSION);
    }

    if (container) {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <AppConfigProvider>
                    <LanguageProvider>
                        <ClassroomProvider>
                            <ToastProvider>
                                <App />
                            </ToastProvider>
                        </ClassroomProvider>
                    </LanguageProvider>
                </AppConfigProvider>
            </React.StrictMode>
        );
    }
}

// Service Worker Registration for Offline Capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

initializeApp();
