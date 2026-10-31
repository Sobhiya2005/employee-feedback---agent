import React, { useState } from "react";
import { api } from "../../services/api";
import {
  Bot,
  CornerDownLeft,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  Sparkles,
  User,
} from "lucide-react";
import { GeminiAIPill } from "../../components/Badges";

export const HRAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; time: string }>
  >([
    {
      sender: "ai",
      text: "Hello! I am your HR Intelligence Assistant powered by Google Gemini 3.8. I am connected directly to your organization's MySQL database, employee feedback records, department metrics, and risk calculations. How can I assist your team today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const promptSuggestions = [
    "Why are employees unhappy?",
    "Which department has the most negative feedback?",
    "What are the top employee concerns?",
    "Which employees have high risk and burnout signals?",
    "What should HR improve immediately this quarter?",
    "What are the major issues this month?",
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg = {
      sender: "user" as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.askAIAssistant(q);
      const aiMsg = {
        sender: "ai" as const,
        text: res.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error analyzing current organizational records. Please verify the Gemini API connectivity or try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>HR AI Strategic Assistant</span>
              <GeminiAIPill />
            </h2>
            <p className="text-xs text-slate-500">
              Grounded in live database feedback, risk matrices, and departmental metrics
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Recommended Queries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-white hover:bg-indigo-50/80 hover:text-indigo-700 text-slate-600 rounded-full border border-slate-200 transition-all font-medium disabled:opacity-50"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        {messages.map((m, idx) => {
          const isAI = m.sender === "ai";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isAI
                    ? "bg-slate-50 border border-slate-200/80 text-slate-800"
                    : "bg-indigo-600 text-white font-medium"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[10px] mt-2 font-normal ${
                    isAI ? "text-slate-400" : "text-indigo-200"
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Analyzing organization records with Gemini AI...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about employee sentiment, department issues, or risk factors..."
          disabled={loading}
          className="flex-1 px-4 py-2 text-xs outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-xs"
        >
          <span>Ask AI</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
