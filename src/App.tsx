// Main App Component - Mobile First Responsive Design

import React, { useState } from 'react';
import { TradingProvider, useTrading } from './hooks/useTrading';
import { PortfolioOverview } from './components/PortfolioOverview';
import { MarketOverview } from './components/MarketOverview';
import { BotControls } from './components/BotControls';
import { TradeHistory } from './components/TradeHistory';
import { StrategySettings } from './components/StrategySettings';
import { PerformanceChart } from './components/PerformanceChart';
import { TradingModeSelector } from './components/TradingModeSelector';
import { StockScanner } from './components/StockScanner';
import { VoiceFeedback } from './components/VoiceFeedback';
import { Bot, LayoutDashboard, History, Settings, Shield, AlertCircle, Search } from 'lucide-react';
import { TRADING_STYLE_INFO } from './lib/constants';

type Tab = 'dashboard' | 'history' | 'settings' | 'scanner';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { tradingStyle, setTradingStyle } = useTrading();
  const styleInfo = TRADING_STYLE_INFO[tradingStyle];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header - Mobile Optimized */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TradePal</h1>
                <p className="text-xs text-gray-400">Your Trading Buddy</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300">Paper</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1 mt-4">
            <TabButton
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
            />
            <TabButton
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              icon={<History className="w-4 h-4" />}
              label="History"
            />
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
            />
            <TabButton
              active={activeTab === 'scanner'}
              onClick={() => setActiveTab('scanner')}
              icon={<Search className="w-4 h-4" />}
              label="Scanner"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {/* Warning Banner - Mobile Optimized */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-400">Paper Mode Active</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Trading is simulated. Connect a brokerage in Settings to trade real money.
            </p>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Mobile: Stack components vertically */}
            <div className="space-y-4">
              <PortfolioOverview />
              <VoiceFeedback />
              <BotControls />
            </div>

            <PerformanceChart />
            <MarketOverview />

            {/* Mobile Quick Stats */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickStatMobile label="Mode" value={styleInfo.name} />
                <QuickStatMobile label="Expected" value={styleInfo.expectedReturn} />
                <QuickStatMobile label="Risk" value={styleInfo.risk} />
                <QuickStatMobile label="Stress" value={styleInfo.stress} />
              </div>
            </div>

            {/* Trading Mode Selector */}
            <TradingModeSelector
              currentMode={tradingStyle}
              onModeChange={setTradingStyle}
            />
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <TradeHistory />
            <PerformanceChart />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <StrategySettings />
          </div>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-4">
            <StockScanner />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
        <div className="flex items-center justify-around py-2 px-2">
          <MobileTabButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />
          <MobileTabButton
            active={activeTab === 'scanner'}
            onClick={() => setActiveTab('scanner')}
            icon={<Search className="w-5 h-5" />}
            label="Scanner"
          />
          <MobileTabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<History className="w-5 h-5" />}
            label="History"
          />
          <MobileTabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
          />
        </div>
      </nav>
    </div>
  );
}

// Desktop Tab Button
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-blue-500/20 text-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Mobile Bottom Tab Button
function MobileTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[60px] ${
        active
          ? 'text-blue-400'
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {active && <div className="w-1 h-1 bg-blue-400 rounded-full mt-1" />}
    </button>
  );
}

// Mobile Quick Stat
function QuickStatMobile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const isHighRisk = value === 'High';
  const isMediumRisk = value === 'Medium';

  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${
        isHighRisk ? 'text-red-400' :
        isMediumRisk ? 'text-yellow-400' :
        'text-green-400'
      }`}>
        {value}
      </p>
    </div>
  );
}

// Main App with Provider
export default function App() {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
}