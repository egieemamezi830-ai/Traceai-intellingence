'use client';

import { useState } from 'react';
import apiClient from '@/lib/api-client';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/chat/message', {
        message: userMessage,
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.content,
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
          <p className="text-slate-400">Ask me anything about your transactions</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-slate-400">Start a conversation. Ask me about your transactions!</p>
              <p className="text-slate-500 text-sm mt-2">Example: "Why was I charged $89?"</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about a transaction..."
            disabled={loading}
            className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
