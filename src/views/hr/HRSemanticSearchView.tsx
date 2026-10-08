import React, { useState } from "react";
import { Feedback } from "../../types";
import { api } from "../../services/api";
import { Bot, ChevronRight, Eye, Loader2, Search, Sparkles } from "lucide-react";
import { SentimentBadge, SeverityBadge, RiskBadge, GeminiAIPill } from "../../components/Badges";

interface HRSemanticSearchViewProps {
  onOpenFeedback: (fb: Feedback) => void;
}

export const HRSemanticSearchView: React.FC<HRSemanticSearchViewProps> = ({
  onOpenFeedback,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Feedback[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const sampleSearches = [
    "employees complaining about workload",
    "people unhappy with salary",
    "employees mentioning burnout",
    "complaints about office facilities",
    "positive feedback about engineering leadership",
    "frustrations with weekend on-call rotations",
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q || loading) return;

    if (searchQuery) setQuery(searchQuery);
    setLoading(true);
    setHasSearched(true);

    try {
      const data = await api.semanticSearch(q);
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI Semantic Feedback Search</span>
            <GeminiAIPill />
          </h2>
          <p className="text-xs text-slate-500">
            Query across intent, tone, and implicit meaning — finds relevant submissions even when exact keywords don't match
          </p>
        </div>
      </div>

      {/* Natural Language Query Bar */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g., "employees complaining about workload and tight deadlines"...'
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Semantic Search</span>
          </button>
        </form>

        {/* Example prompts */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Try Example Natural Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleSearches.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(s)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg transition-colors font-medium border border-slate-200/60"
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {hasSearched ? `Semantic Matches (${results.length} found)` : "Search Results"}
          </h3>
        </div>

        {loading ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500">
              Running semantic vector match with Google Gemini...
            </p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No feedback entries matched this semantic context. Try broadening your query terms.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {results.map((fb) => (
              <div
                key={fb.id}
                onClick={() => onOpenFeedback(fb)}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{fb.title}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {fb.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      By {fb.isAnonymous ? "Anonymous" : fb.employee?.name || "Employee"} •{" "}
                      {fb.department?.name || "General"} • {fb.createdAt.split("T")[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SentimentBadge sentiment={fb.analysis?.sentiment} size="sm" />
                    <SeverityBadge severity={fb.analysis?.severity} />
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {fb.description}
                </p>

                {fb.analysis?.summary && (
                  <div className="flex items-center justify-between text-xs text-indigo-700 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/80">
                    <span className="truncate max-w-xl">
                      <strong>AI Summary:</strong> {fb.analysis.summary}
                    </span>
                    <button className="font-semibold hover:underline flex items-center shrink-0 ml-2">
                      Inspect Record <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
