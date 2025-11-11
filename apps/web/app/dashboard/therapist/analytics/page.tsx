'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLeads: number;
    newLeadsCount: number;
    conversionRate: number;
    micrositeStatus: string;
    publishedAt: string | null;
  };
  periods: {
    last7Days: {
      views: number;
      leads: number;
    };
    last30Days: {
      views: number;
      leads: number;
    };
  };
  chartData: Array<{
    date: string;
    views: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/therapist/analytics');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Fehler beim Laden der Daten');
      }
    } catch (err) {
      setError('Netzwerkfehler beim Laden der Analytics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Fehler</h2>
          <p className="text-red-700">{error || 'Daten konnten nicht geladen werden'}</p>
        </div>
      </div>
    );
  }

  const maxViews = Math.max(...data.chartData.map((d) => d.views), 1);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Übersicht über Ihre Microsite-Performance der letzten 30 Tage
        </p>
      </div>

      {/* Status Banner */}
      {data.overview.micrositeStatus !== 'PUBLISHED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            💡 <strong>Ihre Microsite ist nicht veröffentlicht.</strong> Veröffentlichen Sie Ihre Microsite, um Besucher und Anfragen zu erhalten.
            <Link href="/dashboard/therapist/microsite" className="ml-2 underline font-medium">
              Jetzt veröffentlichen
            </Link>
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Views */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{data.periods.last30Days.views} (30d)</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{data.overview.totalViews}</h3>
          <p className="text-sm text-gray-600 mt-1">Gesamt Seitenaufrufe</p>
        </div>

        {/* Total Leads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <span className="text-sm text-gray-500">{data.periods.last30Days.leads} (30d)</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{data.overview.totalLeads}</h3>
          <p className="text-sm text-gray-600 mt-1">Kontaktanfragen</p>
        </div>

        {/* New Leads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            {data.overview.newLeadsCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {data.overview.newLeadsCount}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{data.overview.newLeadsCount}</h3>
          <p className="text-sm text-gray-600 mt-1">Neue Anfragen</p>
          {data.overview.newLeadsCount > 0 && (
            <Link href="/dashboard/therapist/leads" className="text-xs text-teal-600 hover:text-teal-700 mt-2 inline-block">
              Anfragen ansehen →
            </Link>
          )}
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{data.overview.conversionRate}%</h3>
          <p className="text-sm text-gray-600 mt-1">Conversion Rate (30d)</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Seitenaufrufe (Letzte 30 Tage)</h2>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-2">
          {data.chartData.map((item) => {
            const percentage = (item.views / maxViews) * 100;
            const date = new Date(item.date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div key={item.date} className="flex items-center gap-3">
                <span className={`text-xs w-20 text-right ${isWeekend ? 'text-gray-400' : 'text-gray-600'}`}>
                  {date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isWeekend
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                    }`}
                    style={{ width: `${Math.max(percentage, item.views > 0 ? 5 : 0)}%` }}
                  />
                  {item.views > 0 && (
                    <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-gray-700">
                      {item.views} {item.views === 1 ? 'Aufruf' : 'Aufrufe'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {data.chartData.every((d) => d.views === 0) && (
          <div className="text-center py-12 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Noch keine Seitenaufrufe vorhanden</p>
            <p className="text-sm mt-1">Teilen Sie Ihre Microsite-URL, um Besucher zu gewinnen</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/therapist/microsite"
          className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Microsite verwalten</h3>
          <p className="text-sm text-gray-600">Slug anpassen, veröffentlichen oder zurückziehen</p>
        </Link>

        <Link
          href="/dashboard/therapist/leads"
          className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Kontaktanfragen</h3>
          <p className="text-sm text-gray-600">Verwalten Sie Ihre Anfragen und markieren Sie den Status</p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Profil bearbeiten</h3>
          <p className="text-sm text-gray-600">Aktualisieren Sie Ihre Informationen auf der Microsite</p>
        </Link>
      </div>
    </div>
  );
}
