# Ad Creative Intelligence 🚀
### Turn Ad Creatives into Evidence-Based Insights

![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Tests](https://img.shields.io/badge/Tests-31%20Passed-emerald?logo=vitest)
![License](https://img.shields.io/badge/License-MIT-gray)

**Ad Creative Intelligence** is a modern, high-performance web application designed for growth marketers, performance analysts, and creative strategists. It bridges the gap between creative design and paid media performance by combining **computer vision attribute extraction** with **rigorous statistical significance testing** — replacing subjective guesswork with audit-ready, evidence-backed findings.

---

## 🌟 Key Highlights

- **Zero Hallucinations & Honest Statistics**: Proportions (CTR, CVR) are evaluated using two-sample proportion tests with **95% Wald confidence intervals**, while continuous metrics (CPC, CPA, ROAS) use **Welch's t-tests**. Never claims causality where sample size is insufficient.
- **100% Client-Side Privacy**: Data parsing, visual feature extraction, and statistical calculations run directly in the user's browser. No creative assets or financial data leave your environment.
- **Real Hackathon Dataset Integrated**: Pre-loaded with the **Halcyon Drinkware** ad campaign dataset featuring **150 creatives**, **20.4M impressions**, **308k clicks**, and **$336k in revenue**.
- **Interactive Visualizations**: Includes executive trend analysis, evidence confidence breakdown donuts, and group performance comparison bar charts built with Recharts.
- **Audit-Ready Reporting**: Export findings with full methodology statements, confidence intervals, sample sizes, and acknowledged limitations to standard CSV.

---

## 📸 Application Pages & Workflows

1. **Landing Page (`/`)**: Hero overview featuring campaign highlights, value propositions, and 1-click access to the Halcyon benchmark dataset.
2. **Analysis Wizard (`/analyze`)**: 3-step CSV upload workflow with drag-and-drop validation, intelligent fuzzy column mapping, and data preview.
3. **Executive Dashboard (`/dashboard`)**: Campaign-level KPI scorecards, performance trend charts over time, evidence status distribution, and top-ranking findings.
4. **Findings & Evidence Grid (`/results`)**: Filterable, searchable catalog of all extracted hypotheses categorised as *Supported*, *Directional*, or *Inconclusive*.
5. **Finding Deep-Dive (`/results/:id`)**: Comprehensive statistical breakdown displaying confidence intervals, sample sizes, creative side-by-side comparisons, methodology explanations, and practical recommendations.
6. **Campaign Creatives Gallery (`/creatives`)**: Visual grid of all 150 creative assets with their extracted dominant colors, contrast metrics, aspect ratios, and performance metrics.
7. **Settings & Data Management (`/settings`)**: Switch between the Halcyon benchmark dataset and custom sessions, review schema mappings, and configure statistical thresholds.

---

## 🔬 Statistical Methodology

Unlike naive analytics tools that average ratios, **Ad Creative Intelligence** adheres to strict data science best practices:
- **True Aggregations**: CTR is strictly calculated as $\sum \text{Clicks} / \sum \text{Impressions}$, and CVR as $\sum \text{Purchases} / \sum \text{Clicks}$.
- **Evidence Classification**:
  - 🟢 **Supported**: Statistically significant effect where the 95% confidence interval does not overlap zero, with adequate statistical power.
  - 🟡 **Directional**: Visible trend observed, but the confidence interval bounds touch or slightly cross null effect; recommends further testing.
  - ⚪ **Inconclusive**: Insufficient sample size or variance spans both positive and negative territory.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom lavender/purple design tokens)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paranthaman-cyb/AD-creative-intelligence.git
   cd AD-creative-intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🧪 Testing & Validation

The codebase includes comprehensive unit and integration test suites:

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Type check TypeScript without emitting files
npx tsc --noEmit

# Run ESLint linter
npm run lint
```

**Test Coverage Summary**:
- `tests/unit/metrics.test.ts`: Aggregate metrics, proportion calculations, edge case division-by-zero handling.
- `tests/unit/analysis.test.ts`: Statistical significance checks, Wald confidence intervals, and hypothesis classification.
- `tests/unit/csv-validation.test.ts`: CSV parser, fuzzy column matcher, and schema validation.
- `tests/unit/export.test.ts`: Audit-ready CSV formatting and escape sequences.
- `tests/unit/real-dataset.test.ts`: Integrity validation of the 150 Halcyon creatives and performance data.
- `tests/integration/upload-flow.test.tsx`: Component integration and user workflow tests.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
AD-creative-intelligence/
├── assets/                  # UI design references and mockup assets
├── docs/                    # Technical architecture, PRD, and design system specs
│   ├── ARCHITECTURE.md      # System design and component data flow
│   ├── CODE_STYLE.md        # TypeScript and Tailwind conventions
│   ├── DATABASE.md          # In-memory and IndexedDB schema definitions
│   ├── DESIGN_SYSTEM.md     # Color tokens, typography, and UI specs
│   ├── PRD.md               # Product Requirements Document
│   ├── SECURITY.md          # Client-side privacy and data handling
│   └── TESTING.md           # Testing standards and coverage matrices
├── public/                  # Static assets
│   ├── creatives/           # 150 Halcyon ad creative images (ad_001.png - ad_150.png)
│   └── dataset/             # Real campaign performance CSV
├── src/
│   ├── app/                 # App root and React Router configuration
│   ├── components/          # Reusable UI primitives, layout shell, and charts
│   ├── context/             # Global AnalysisContext state management
│   ├── data/                # Pre-extracted Halcyon dataset and demo fixtures
│   ├── features/            # Feature-specific components (CSV upload, column mapper)
│   ├── hooks/               # Custom React hooks (useAnalysis)
│   ├── lib/                 # Utility functions and classname merger
│   ├── pages/               # Page routes (Landing, Dashboard, Results, Detail, Settings)
│   ├── services/            # Statistical analysis, CSV parsing, metric calculations
│   ├── styles/              # Global Tailwind CSS styles and custom utilities
│   └── types/               # TypeScript interfaces and domain models
└── tests/                   # Vitest unit and integration suites
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
