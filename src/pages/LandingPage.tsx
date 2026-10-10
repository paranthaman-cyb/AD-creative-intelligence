import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ScanLine,
  BarChart3,
  ListOrdered,
  FileDown,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAnalysis } from '../context/AnalysisContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadRealDataset, loadDemoData } = useAnalysis();

  const handleStartAnalysis = () => {
    navigate('/analyze');
  };

  const handleExploreRealData = () => {
    loadRealDataset();
    navigate('/dashboard');
  };

  const handleTryDemo = () => {
    loadDemoData();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-lavender-50 flex flex-col">
      {/* Top Navigation */}
      <header className="h-20 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center shadow-md shadow-brand-700/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-app-text">
            Ad Creative <span className="text-brand-700">Intelligence</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-app-muted">
          <a href="#features" className="hover:text-brand-700 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-brand-700 transition-colors">How It Works</a>
          <a href="#about" className="hover:text-brand-700 transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleTryDemo} className="hidden sm:inline-flex">
            Try Demo
          </Button>
          <Button variant="primary" size="sm" onClick={handleExploreRealData}>
            Explore Halcyon (150)
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-8 sm:pt-14 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based Ad Analytics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-app-text tracking-tight leading-[1.12]">
              Turn Ad Creatives into <span className="text-brand-700">Evidence-Based</span> Insights
            </h1>

            <p className="text-base sm:text-lg text-app-muted leading-relaxed max-w-xl">
              Automatically extract features from your advertisement images and performance data, and discover what really works — with statistical confidence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={handleExploreRealData}
                className="shadow-lg shadow-brand-700/20"
              >
                Explore Halcyon Dataset
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleStartAnalysis}
              >
                Upload Custom CSV
              </Button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-app-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success" />
                <span>Zero Hallucinations</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>95% Confidence Intervals</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card matching mockup */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 to-brand-700/10 rounded-3xl blur-2xl -z-10" />

            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-app-border space-y-6">
              {/* Creative Thumbnail with Ad Headline matching theme */}
              <div className="rounded-2xl overflow-hidden border border-app-border relative shadow-sm aspect-square max-h-72">
                <img
                  src="/purple_sneaker_ad.jpg"
                  alt="Step Forward in Style"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 p-5 flex flex-col justify-between pointer-events-none">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                      Step Forward<br />in Style
                    </h3>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#211044] text-white shadow-md border border-white/20">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Features List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-app-muted uppercase tracking-wider block">
                  Extracted Features
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-lavender-50 rounded-xl border border-app-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="font-semibold text-app-text">Dominant Colors</span>
                  </div>
                  <div className="p-2.5 bg-lavender-50 rounded-xl border border-app-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="font-semibold text-app-text">Text &amp; Typography</span>
                  </div>
                  <div className="p-2.5 bg-lavender-50 rounded-xl border border-app-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="font-semibold text-app-text">Objects &amp; Layout</span>
                  </div>
                  <div className="p-2.5 bg-lavender-50 rounded-xl border border-app-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="font-semibold text-app-text">Visual Quality</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Row */}
              <div className="pt-2 border-t border-app-border">
                <span className="text-xs font-bold text-app-muted uppercase tracking-wider block mb-2.5">
                  Performance Metrics
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-lavender-50 rounded-xl">
                    <span className="text-[10px] text-app-muted block">Impressions</span>
                    <span className="text-xs font-bold text-app-text">12,482</span>
                  </div>
                  <div className="p-2 bg-lavender-50 rounded-xl">
                    <span className="text-[10px] text-app-muted block">Clicks</span>
                    <span className="text-xs font-bold text-app-text">624</span>
                  </div>
                  <div className="p-2 bg-lavender-50 rounded-xl">
                    <span className="text-[10px] text-app-muted block">Conversions</span>
                    <span className="text-xs font-bold text-app-text">78</span>
                  </div>
                  <div className="p-2 bg-brand-100/60 rounded-xl">
                    <span className="text-[10px] text-brand-700 block font-semibold">CTR</span>
                    <span className="text-xs font-bold text-brand-700">5.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Row matching mockup */}
        <section id="features" className="mt-20 sm:mt-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-app-border shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-app-text mb-1">Extract Features</h3>
              <p className="text-xs text-app-muted">From images automatically with transparent provenance.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-app-border shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-app-text mb-1">Analyze Performance</h3>
              <p className="text-xs text-app-muted">With real metrics, zero-denominator guards, and true aggregations.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-app-border shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <ListOrdered className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-app-text mb-1">Rank Findings</h3>
              <p className="text-xs text-app-muted">With evidence strength: Supported, Inconclusive, and Underpowered.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-app-border shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-app-text mb-1">Export Reports</h3>
              <p className="text-xs text-app-muted">In CSV format and print-ready executive summaries.</p>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how-it-works" className="mt-20 pt-16 border-t border-app-border text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-app-text mb-3">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-sm text-app-muted max-w-xl mx-auto mb-12">
            No machine-learning black boxes. No exaggerated claims. Real statistical methods applied to your campaign assets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-5 bg-white rounded-2xl border border-app-border shadow-sm">
              <div className="text-xs font-bold text-brand-600 mb-2">STEP 1</div>
              <h4 className="text-sm font-bold text-app-text mb-1">Upload Assets &amp; Data</h4>
              <p className="text-xs text-app-muted">Select ad images and drop your performance CSV file.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-app-border shadow-sm">
              <div className="text-xs font-bold text-brand-600 mb-2">STEP 2</div>
              <h4 className="text-sm font-bold text-app-text mb-1">Validate &amp; Map</h4>
              <p className="text-xs text-app-muted">Auto-detect columns and review validation health before analysis.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-app-border shadow-sm">
              <div className="text-xs font-bold text-brand-600 mb-2">STEP 3</div>
              <h4 className="text-sm font-bold text-app-text mb-1">Statistical Analysis</h4>
              <p className="text-xs text-app-muted">Computes effect sizes and 95% confidence intervals across cohorts.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-app-border shadow-sm">
              <div className="text-xs font-bold text-brand-600 mb-2">STEP 4</div>
              <h4 className="text-sm font-bold text-app-text mb-1">Inspect &amp; Export</h4>
              <p className="text-xs text-app-muted">Explore ranked evidence, verify caveats, and export to CSV.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-app-border bg-white py-8 px-6 sm:px-12 text-center text-xs text-app-muted">
        <p>© 2026 Ad Creative Intelligence. Built for evidence-backed creative optimization.</p>
      </footer>
    </div>
  );
};
