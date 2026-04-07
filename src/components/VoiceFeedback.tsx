// Voice Feedback Component - Announces trades and explains decisions

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, MessageSquare } from 'lucide-react';

interface VoiceMessage {
  id: string;
  text: string;
  type: 'trade' | 'reasoning' | 'alert' | 'status';
  timestamp: Date;
}

export function VoiceFeedback() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  const speak = useCallback((text: string, type: VoiceMessage['type'] = 'status') => {
    if (!isEnabled || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Different voices for different message types
    if (type === 'trade') {
      utterance.rate = 0.9;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);

    // Add to message log
    setMessages(prev => [{
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  }, [isEnabled]);

  const announceTrade = useCallback((action: 'BUY' | 'SELL', symbol: string, shares: number, price: number, reason: string) => {
    const actionText = action === 'BUY' ? 'Buying' : 'Selling';
    const priceText = `at $${price.toFixed(2)} per share`;
    const sharesText = `${shares} shares of ${symbol}`;
    const reasonText = `Reason: ${reason}`;

    const fullMessage = `${actionText} ${sharesText} ${priceText}. ${reasonText}`;
    speak(fullMessage, 'trade');
  }, [speak]);

  const announceReasoning = useCallback((symbol: string, reason: string) => {
    speak(`Analyzing ${symbol}. ${reason}`, 'reasoning');
  }, [speak]);

  const announceAlert = useCallback((message: string) => {
    speak(message, 'alert');
  }, [speak]);

  const announceStatus = useCallback((message: string) => {
    speak(message, 'status');
  }, [speak]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Expose functions globally for other components to use
  useEffect(() => {
    (window as any).voiceFeedback = {
      announceTrade,
      announceReasoning,
      announceAlert,
      announceStatus,
      isEnabled: () => isEnabled
    };
  }, [announceTrade, announceReasoning, announceAlert, announceStatus, isEnabled]);

  const getMessageIcon = (type: VoiceMessage['type']) => {
    switch (type) {
      case 'trade': return '📈';
      case 'reasoning': return '💡';
      case 'alert': return '⚠️';
      default: return '📢';
    }
  };

  const getMessageColor = (type: VoiceMessage['type']) => {
    switch (type) {
      case 'trade': return 'text-blue-400';
      case 'reasoning': return 'text-yellow-400';
      case 'alert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Voice Feedback</h3>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isEnabled
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-slate-700 text-gray-400 border border-slate-600'
          }`}
        >
          {isEnabled ? (
            <>
              <Volume2 className="w-3 h-3" />
              ON
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3" />
              OFF
            </>
          )}
        </button>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex gap-1">
            <span className="w-1 h-3 bg-blue-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-4 bg-blue-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-3 bg-blue-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-xs text-blue-400">Speaking...</span>
          <button
            onClick={stopSpeaking}
            className="ml-auto text-xs text-gray-400 hover:text-white"
          >
            Stop
          </button>
        </div>
      )}

      {/* Message Log */}
      {messages.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-1">Recent Announcements:</p>
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2 text-xs">
              <span>{getMessageIcon(msg.type)}</span>
              <p className={`${getMessageColor(msg.type)} flex-1`}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          Bot will announce trades and explain decisions out loud
        </p>
      )}
    </div>
  );
}

// Hook for components to use voice feedback
export function useVoiceFeedback() {
  const speak = useCallback((text: string, type: 'trade' | 'reasoning' | 'alert' | 'status' = 'status') => {
    const voice = (window as any).voiceFeedback;
    if (voice?.isEnabled()) {
      voice.announceTrade?.(text, type);
    }
  }, []);

  const announceTrade = useCallback((action: 'BUY' | 'SELL', symbol: string, shares: number, price: number, reason: string) => {
    const voice = (window as any).voiceFeedback;
    if (voice?.isEnabled()) {
      voice.announceTrade?.(action, symbol, shares, price, reason);
    }
  }, []);

  return { speak, announceTrade };
}