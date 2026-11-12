import React, { useState, useEffect } from 'react';
import { AppScreen, AnalysisResult } from './types/contract';
import { getSavedAiConfig } from './services/analyzer';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { UploadView } from './components/UploadView';
import { ResultsView } from './components/ResultsView';
import { CounterOfferView } from './components/CounterOfferView';
import { SettingsModal } from './components/SettingsModal';
import { HistoryDrawer } from './components/HistoryDrawer';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check whether Groq API key is configured
  useEffect(() => {
    const config = getSavedAiConfig();
    setHasApiKey(Boolean(config?.apiKey));
  }, [isSettingsOpen]);

  // Navigate to Upload screen
  const handleStartAnalysis = () => {
    setCurrentScreen('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inspect a sample contract directly
  const handleSelectSample = (sample: AnalysisResult) => {
    setCurrentResult(sample);
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upload or parse completed
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start a fresh audit
  const handleNewAudit = () => {
    setCurrentResult(null);
    setCurrentScreen('upload');
  };

  // Select audit from history drawer
  const handleSelectHistoryAudit = (result: AnalysisResult) => {
    setCurrentResult(result);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Landing View */}
      {currentScreen === 'landing' && (
        <>
          <Navbar
            onStartAnalysis={handleStartAnalysis}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasApiKey={hasApiKey}
          />
          <LandingView
            onStartUpload={handleStartAnalysis}
            onSelectSample={handleSelectSample}
          />
        </>
      )}

      {/* Upload View */}
      {currentScreen === 'upload' && (
        <UploadView
          onBackToLanding={() => setCurrentScreen('landing')}
          onAnalysisComplete={handleAnalysisComplete}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />
      )}

      {/* Results View */}
      {currentScreen === 'results' && currentResult && (
        <ResultsView
          result={currentResult}
          onBackToUpload={() => setCurrentScreen('upload')}
          onNewAudit={handleNewAudit}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onGoToCounterOffer={() => setCurrentScreen('counterOffer')}
          hasApiKey={hasApiKey}
        />
      )}

      {/* Counter-Offer View */}
      {currentScreen === 'counterOffer' && currentResult && (
        <CounterOfferView
          result={currentResult}
          onBackToResults={() => setCurrentScreen('results')}
          onNewAudit={handleNewAudit}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />
      )}

      {/* Modals & Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigChanged={() => {
          const config = getSavedAiConfig();
          setHasApiKey(Boolean(config?.apiKey));
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectAudit={handleSelectHistoryAudit}
      />
    </div>
  );
};

export default App;
