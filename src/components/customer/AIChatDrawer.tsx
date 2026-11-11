import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { askAIAssistant } from '../../services/geminiService';
import { ServiceCategory } from '../../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Hello! I'm your HomeEase AI Concierge. How can I help with your household maintenance today?" },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    const reply = await askAIAssistant(userMsg, messages);
    setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">HomeEase AI Assistant</h3>
        </div>
        <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-xl"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
