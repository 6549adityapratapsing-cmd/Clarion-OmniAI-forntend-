import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  FileText,
  Copy,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Filter,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import { Insight, IssueSeverity } from '../types';
import Button from '../components/Button';

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.getInsights();
      if (res?.insights) {
        setInsights(res.insights);
      }
    } catch (err) {
      console.error('Failed to fetch insights', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDismiss = (id: string) => {
    setInsights(prev => prev.map(item => (item.id === id ? { ...item, isDismissed: true } : item)));
  };

  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'WARNING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: Insight['insightType']) => {
    switch (type) {
      case 'POTENTIAL_DUPLICATE':
        return <Copy className="w-5 h-5 text-red-400" />;
      case 'PO_MISMATCH':
        return <TrendingDown className="w-5 h-5 text-amber-400" />;
      case 'TAX_ANOMALY':
        return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'LOW_CONFIDENCE':
        return <AlertTriangle className="w-5 h-5 text-cyan-400" />;
      case 'UPCOMING_DUE_DATE':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredInsights = insights
    .filter(i => !i.isDismissed)
    .filter(i => {
      if (filterType !== 'ALL' && i.insightType !== filterType) return false;
      if (filterSeverity !== 'ALL' && i.severity !== filterSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.explanation.toLowerCase().includes(q) ||
          JSON.stringify(i.evidence).toLowerCase().includes(q)
        );
      }
      return true;
    });

  const criticalCount = insights.filter(i => !i.isDismissed && (i.severity === 'CRITICAL' || i.severity === 'HIGH')).length;
  const duplicateCount = insights.filter(i => !i.isDismissed && i.insightType === 'POTENTIAL_DUPLICATE').length;
  const mismatchCount = insights.filter(i => !i.isDismissed && i.insightType === 'PO_MISMATCH').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
            Explainable Business Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Data-driven alerts grounded in deterministic validation, duplicate risk analysis, and cross-document verification.
          </p>
        </div>
        <Button variant="secondary" onClick={fetchInsights} isLoading={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{criticalCount}</div>
            <div className="text-xs text-slate-400">High / Critical Alerts</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Copy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{duplicateCount}</div>
            <div className="text-xs text-slate-400">Duplicate Risks</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{mismatchCount}</div>
            <div className="text-xs text-slate-400">PO Variances</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{insights.filter(i => !i.isDismissed).length}</div>
            <div className="text-xs text-slate-400">Active Actionable Items</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search insights or evidence..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="POTENTIAL_DUPLICATE">Duplicates</option>
              <option value="PO_MISMATCH">PO Mismatches</option>
              <option value="TAX_ANOMALY">Tax Anomalies</option>
              <option value="LOW_CONFIDENCE">Low Confidence</option>
              <option value="UPCOMING_DUE_DATE">Due Dates</option>
            </select>
          </div>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Insights List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Actionable Exceptions Detected</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            All documents have satisfied deterministic math, tax validations, and 2-way/3-way PO verification criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInsights.map(insight => (
            <div
              key={insight.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    {getTypeIcon(insight.insightType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base">{insight.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
                          insight.severity
                        )}`}
                      >
                        {insight.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Detected on {new Date(insight.createdAt).toLocaleDateString()} at{' '}
                      {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {insight.documentId && (
                    <Link to={`/documents/${insight.documentId}`}>
                      <Button variant="secondary" size="sm">
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Inspect Document
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleDismiss(insight.id)}>
                    Dismiss
                  </Button>
                </div>
              </div>

              {/* Explanation & Evidence Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Root Cause & Explanation
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/70">
                    {insight.explanation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Supporting Evidence
                  </h4>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/70 text-xs space-y-1.5 font-mono text-slate-300">
                    {Object.entries(insight.evidence || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 truncate">{key}:</span>
                        <span className="text-indigo-300 font-medium truncate max-w-[140px]">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
