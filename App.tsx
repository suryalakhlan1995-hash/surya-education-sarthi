
import React, { useState, useEffect, Suspense, ReactNode, ErrorInfo, Component } from 'react'; 
import { UserRole, User, ServiceName } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { MenuIcon, WrenchScrewdriverIcon, EduSarthiLogo, ArrowPathIcon } from './components/icons/AllIcons';
import AdmissionScreen from './components/AdmissionScreen';
import Website from './components/Website';
import SetupScreen from './components/SetupScreen'; 
import { useAppConfig } from './contexts/AppConfigContext';
import VoiceNavigation from './components/VoiceNavigation';
import { useLanguage } from './contexts/LanguageContext'; 
import { ThemeCustomizer } from './components/ThemeCustomizer'; 
import GlobalReader from './components/GlobalReader';
import SOSButton from './components/SOSButton';
import LocalizationModal from './components/LocalizationModal';
import OfflineIndicator from './components/OfflineIndicator';
import Loader from './components/Loader';
import SystemCheck from './components/SystemCheck';

// --- ROBUST ERROR BOUNDARY ---
interface ErrorBoundaryProps { children?: ReactNode; } 
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { 
    return { hasError: true, error }; 
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error("App Crash:", error, errorInfo);
  }
  
  handleHardReset = () => { 
      // Safe Reset: Clear data and reload once
      if(window.confirm("This will clear your local data and restart. Continue?")) {
          localStorage.clear();
          sessionStorage.clear();
          if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                      registration.unregister();
                  }
              });
          }
          window.location.href = window.location.origin;
      }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white font-sans">
          <div className="bg-slate-900 p-10 rounded-[2rem] shadow-2xl max-w-md w-full border-2 border-red-500/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 bg-red-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <WrenchScrewdriverIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-black mb-2 tracking-tight">System Paused</h1>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                   We caught a technical glitch. To prevent looping, we have paused the app.
                   <br/><br/>
                   <span className="font-mono text-xs bg-black/40 p-2 rounded block text-red-300 border border-red-900/30 break-words">
                       {this.state.error?.message || 'Unknown Error'}
                   </span>
                </p>
                <button 
                    onClick={this.handleHardReset} 
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                >
                    <ArrowPathIcon className="h-5 w-5" /> REPAIR & RESTART
                </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const GlobalWatermark = () => {
  const { logoUrl } = useAppConfig();
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none opacity-[0.03]">
        {logoUrl ? (
            <img src={logoUrl} className="w-[80vw] h-[80vw] object-contain grayscale" alt="" />
        ) : (
            <div className="scale-[8] rotate-[-10deg]">
                <EduSarthiLogo />
            </div>
        )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'website' | 'portal' | 'setup' | 'dashboard'>('website');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { institutionName } = useAppConfig();
  const [activeService, setActiveService] = useState<ServiceName | 'overview'>('overview');
  const { t } = useLanguage(); 
  const [isLocalizationModalOpen, setIsLocalizationModalOpen] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Safe Session Loading to prevent flickering/loops
  useEffect(() => {
    const loadSession = async () => {
        try {
            const savedUser = localStorage.getItem('sarthi_logged_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                if (user && user.id) {
                    setCurrentUser(user);
                    setAppState('dashboard');
                }
            }
            
            if (!localStorage.getItem('sarthi_country')) {
                setIsLocalizationModalOpen(true);
            }
        } catch(e) {
            console.error("Session load error", e);
            localStorage.removeItem('sarthi_logged_user');
        } finally {
            setIsSessionLoaded(true);
        }
    };
    loadSession();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.Student || user.role === UserRole.JobSeeker) {
        setAppState('setup');
    } else {
        setAppState('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sarthi_logged_user');
    setCurrentUser(null);
    setAppState('website');
    setActiveService('overview');
  };

  if (!isSessionLoaded) {
      return <div className="h-screen w-screen bg-[#020617] flex items-center justify-center"><Loader message="Initializing System..." /></div>;
  }

  return (
    <div className="flex h-[100dvh] w-screen bg-[#020617] text-slate-200 font-sans overflow-hidden relative">
      <GlobalWatermark />
      <OfflineIndicator />
      {appState === 'dashboard' && <SystemCheck />}
      <LocalizationModal isOpen={isLocalizationModalOpen} onClose={() => setIsLocalizationModalOpen(false)} />

      <div className="relative z-10 w-full h-full flex overflow-hidden">
          {appState === 'website' && (
            <div className="w-full h-full overflow-y-auto bg-transparent scroll-smooth">
                <Website onNavigateToLogin={() => setAppState('portal')} onNavigateToAdmission={() => setAppState('portal')} />
            </div>
          )}

          {appState === 'portal' && (
            <div className="w-full h-full overflow-y-auto animate-fade-in">
                <AdmissionScreen onBack={() => setAppState('website')} onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

          {appState === 'setup' && currentUser && (
             <div className="w-full h-full overflow-y-auto bg-slate-50">
                <SetupScreen user={currentUser} onSetupComplete={() => setAppState('dashboard')} />
             </div>
          )}
          
          {appState === 'dashboard' && currentUser && (
            <>
              <Sidebar 
                user={currentUser} 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
                activeService={activeService} 
                setActiveService={(s) => {setActiveService(s); setSidebarOpen(false);}} 
              />
              
              <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative w-full">
                <header className="h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 mt-2">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-4 shadow-lg w-full max-w-xl">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)} 
                            className="p-3 bg-primary text-slate-900 rounded-full hover:scale-105 transition-transform"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        
                        <div className="flex flex-col pr-6 overflow-hidden">
                             <h2 className="font-black text-white tracking-tighter uppercase truncate text-base md:text-lg italic leading-none">
                                {activeService === 'overview' ? (institutionName ? institutionName.split(',')[0] : 'Dashboard') : activeService}
                            </h2>
                            <p className="text-[9px] font-bold text-primary-light uppercase tracking-[0.3em]">ACTIVE SESSION</p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-3">
                        <button onClick={handleLogout} className="text-[10px] font-black text-white bg-red-500 px-6 py-2.5 rounded-full shadow-lg hover:bg-red-600 transition-all uppercase tracking-widest border border-white/20">
                             {t('Logout', 'लॉग आउट')}
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar flex flex-col w-full">
                    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader message="Loading Module..." /></div>}>
                        <Dashboard user={currentUser} activeService={activeService} setActiveService={setActiveService} />
                    </Suspense>
                </div>

                <div className="fixed bottom-24 left-6 z-[100] no-print scale-75 sm:scale-100 origin-bottom-left">
                     <SOSButton />
                </div>
                <div className="fixed bottom-6 left-6 z-[100] no-print scale-75 sm:scale-100 origin-bottom-left">
                     <GlobalReader />
                </div>
                <div className="fixed bottom-6 right-6 z-[100] no-print scale-75 sm:scale-100 origin-bottom-right">
                     <VoiceNavigation onNavigate={setActiveService} />
                </div>
              </main>
            </>
          )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <AppContent />
      <ThemeCustomizer />
    </GlobalErrorBoundary>
  );
};

export default App;