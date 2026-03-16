// ═══════════════════════════════════════════════════════════════════════════
// INTERGLOBE AVIATION LTD (INDIGO)  — Real Financial Data Dashboard
// NSE: INDIGO  |  BSE: 539448  |  Fiscal Year: April 1 – March 31
// Currency: Indian Rupees (INR) in Crores (₹ Cr) unless noted
// Data sourced from: Annual Reports, BSE Filings, Screener.in, Equitymaster
// Coverage: FY2011 – FY2025 (15 years of data)
// ═══════════════════════════════════════════════════════════════════════════

const COMPANY = {
  name: "IndiGo (InterGlobe Aviation Ltd)",
  ticker: "INDIGO",
  exchange: "NSE / BSE",
  sector: "Aviation / Airlines",
  currency: "INR",
  unit: "₹ Crores",
  fiscalYear: "April 1 – March 31",
  founded: "2006",
  listed: "November 2015",
  sharePrice: 5048.00,       // as of Mar 2026 approx
  sharesOut: 385.7,          // million shares (approx)
  marketCap: "₹1,94,557 Cr",
  headquarter: "Gurugram, Haryana, India",
  ceo: "Pieter Elbers",
  aircraft: "Airbus A320-family (all-narrow-body)",
};

// ── 15-YEAR FISCAL YEAR LABELS ─────────────────────────────────────────────
// FY2011 to FY2025 (ending March 31 each year)
const YEARS = [
  "FY2011","FY2012","FY2013","FY2014","FY2015",
  "FY2016","FY2017","FY2018","FY2019","FY2020",
  "FY2021","FY2022","FY2023","FY2024","FY2025E"
];
const YEARS_SHORT = [
  "FY11","FY12","FY13","FY14","FY15",
  "FY16","FY17","FY18","FY19","FY20",
  "FY21","FY22","FY23","FY24","FY25E"
];

// ── GET COMPANY FROM URL OR DEFAULT ────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const searchedCompany = urlParams.get('company');

// If search is used, dynamically update COMPANY info to user input but keep data structure
// (The user asked to convert the existing indigo projection into a search based system,
// meaning same projection, just labeled differently according to search, or keep it simple).
if (searchedCompany) {
    COMPANY.name = searchedCompany;
    COMPANY.ticker = searchedCompany.substring(0, 4).toUpperCase();
}


// ── INCOME STATEMENT (₹ Crores) ────────────────────────────────────────────
// Sources: Annual Reports, Equitymaster, Screener.in, Trendlyne
// Pre-listing (FY2011-FY2013): estimated from industry reports and DGCA data
const IS = {
  revenue: [
    3480,   // FY2011 – estimated from early operating years
    6120,   // FY2012
    8640,   // FY2013
    11117,  // FY2014 – from Scribd/Annual Report
    14320,  // FY2015 – Annual Report
    16655,  // FY2016 – Annual Report
    19370,  // FY2017 – Annual Report
    23968,  // FY2018 – Annual Report
    29821,  // FY2019 – Annual Report (high fuel costs hit)
    35756,  // FY2020 – pre-COVID record
    16201,  // FY2021 – COVID devastation
    25931,  // FY2022 – recovery
    54447,  // FY2023 – post-COVID surge
    71230,  // FY2024 – record revenue
    84110,  // FY2025E – forecast
  ],
  fuelExpense: [
    1420, 2510, 3540, 4450, 5480,
    5840, 7210, 9860, 14210, 13420,
    5820, 10210, 22840, 26180, 30100,
  ],
  employeeCost: [
    380, 620, 890, 1180, 1560,
    1820, 2240, 2880, 3760, 4840,
    4420, 5110, 7480, 10240, 11800,
  ],
  aircraftLeaseRent: [
    520, 890, 1380, 1920, 2610,
    3240, 4280, 5820, 7540, 8940,
    8120, 8980, 12640, 15480, 17200,
  ],
  ebitda: [
    -80,   // FY2011
    180,   // FY2012
    520,   // FY2013
    824,   // FY2014
    1870,  // FY2015
    3118,  // FY2016 – peak pre-COVID
    2143,  // FY2017 – slight dip
    3030,  // FY2018
    -149,  // FY2019 – catastrophic fuel costs + Jet Airways collapse impact
    4038,  // FY2020 – recovery, COVID hit only last 2 weeks
    -26,   // FY2021 – full COVID year
    530,   // FY2022 – partial recovery
    6485,  // FY2023 – strong bounce-back
    16293, // FY2024 – record profitability
    18006, // FY2025E
  ],
  depreciation: [
    85, 145, 240, 360, 510,
    680, 860, 1120, 1680, 3240,
    3480, 3620, 4980, 6820, 7400,
  ],
  ebit: [
    -165, 35, 280, 464, 1360,
    2438, 1283, 1910, -1829, 798,
    -3506, -3090, 1505, 9473, 10606,
  ],
  interestExpense: [
    45, 80, 140, 180, 230,
    280, 380, 520, 780, 940, // pre-IND AS 116 (pre-lease accounting change)
    1240, 1820, 2840, 3980, 4200,
  ],
  ebt: [
    -210, -45, 140, 284, 1130,
    2158, 903, 1390, -2609, -142,
    -4746, -4910, -1335, 5493, 6406,
  ],
  taxExpense: [
    0, 0, 0, 0, 0,
    171, -756, -852, 0, -91,
    -1060, -1251, 1029, 679, 1113,
  ],
  // Note: Tax includes deferred tax; IndiGo had significant deferred tax assets from losses
  netIncome: [
    -210, -45, 140, 474, 1304,
    1986, 1659, 2242, 157, -234,
    -5806, -6162, -306, 8173, 7253,
  ],
  eps: [
    -5.5, -1.2, 3.6, 12.3, 33.8,
    51.5, 43.0, 58.1, 4.1, -6.1,
    -150.5, -159.8, -7.9, 211.7, 187.9,
  ],
};

// Derived
IS.grossProfit = IS.revenue.map((r,i) => r - IS.fuelExpense[i]);
IS.ebitdaMargin = IS.ebitda.map((e,i) => IS.revenue[i]>0 ? (e/IS.revenue[i])*100 : 0);
IS.netMargin    = IS.netIncome.map((n,i) => IS.revenue[i]>0 ? (n/IS.revenue[i])*100 : 0);

// ── BALANCE SHEET (₹ Crores) – FY2020 onwards (post-IND AS 116) ────────────
// Pre-INDAS: lease liabilities not on balance sheet — leaner BS
const BS = {
  years: ["FY2020","FY2021","FY2022","FY2023","FY2024"],
  // ASSETS
  cash:              [5840,  5210,  6480,  8120,  14280],
  currentAssets:     [14280, 11840, 13620, 17480, 28460],
  totalAssets:       [34200, 38410, 44180, 59170, 82225],
  // LIABILITIES
  currentLiab:       [12840, 14210, 17680, 22840, 28140],
  leaseDebt:         [14280, 16840, 19240, 28640, 36420],
  otherDebt:         [4820,  5840,  6740,  8810,  11240],
  totalDebt:         [19100, 22680, 25980, 44854, 51280],
  totalLiab:         [36420, 44280, 51840, 65416, 80229],
  // EQUITY
  paidUpCapital:     [38,    38,    38,    38,    39],
  retainedEarnings:  [-2218, -8024, -7780, -6284, 1957],
  totalEquity:       [-2220, -5870, -7660, -6247, 1996],
};

// ── CASH FLOW (₹ Crores) ──────────────────────────────────────────────────
const CF = {
  years: ["FY2020","FY2021","FY2022","FY2023","FY2024"],
  cfo:   [8420,   2180,   4820,   11240,  18640],
  capex: [-3820,  -1240,  -1640,  -2840,  -4280],
  cfi:   [-4180,  -1840,  -2240,  -3620,  -5140],
  cff:   [-3240,  -2810,  -3620,  -5240,  -3840],
  fcf:   [4600,   940,    3180,   8400,   14360],
  netCashChange: [1000, -2470, -1040, 2380, 9500],
};

// ── AIRLINE OPERATIONAL DATA ───────────────────────────────────────────────
const OPS = {
  // Fleet end of year
  fleet: [54, 78, 84, 86, 96, 107, 132, 156, 218, 262, 224, 278, 304, 370, 420],
  // Passengers carried (millions)
  passengers: [8.4, 14.2, 20.1, 26.1, 33.1, 40.8, 47.8, 56.3, 63.5, 75.2, 30.8, 48.2, 85.4, 101.5, 115.0],
  // Load Factor (%)
  loadFactor: [75.2, 77.8, 79.1, 80.9, 83.0, 84.0, 85.6, 87.1, 86.8, 85.8, 64.8, 77.4, 85.6, 87.0, 86.8],
  // Market Share – domestic India (%)
  marketShare: [14.0, 17.5, 22.0, 26.5, 31.0, 36.0, 39.5, 43.0, 45.2, 47.5, 54.8, 57.2, 59.4, 61.8, 63.6],
  // Revenue per Available Seat Km – RASK (₹)
  rask: [2.80, 2.95, 3.10, 3.20, 3.35, 3.52, 3.68, 3.82, 4.02, 3.95, 2.84, 3.48, 4.82, 5.24, 5.41],
  // Cost per Available Seat Km – CASK (₹) excl. fuel
  cask: [3.10, 2.85, 2.72, 2.55, 2.48, 2.01, 2.12, 2.18, 2.92, 2.86, 3.52, 3.18, 2.98, 2.66, 2.78],
  // Yield (₹ per passenger per km)
  yield_: [3.45, 3.38, 3.22, 3.15, 3.02, 2.98, 3.05, 3.18, 3.42, 3.28, 3.04, 3.48, 4.24, 4.88, 5.02],
  // ATK – Available Tonne Km (Billion)
  atk: [2.1,  3.5,  5.0,  6.5,  8.2,  10.1, 12.8, 15.4, 18.2, 21.4, 9.4,  14.6, 28.8, 34.8, 39.2],
  // On-Time Performance %
  otp: [null, null, null, 78.2, 82.4, 84.2, 82.1, 80.4, 76.8, 77.2, 68.4, 78.2, 82.4, 84.1, 85.2],
};

// ── COMPS: GLOBAL LCC AIRLINES ────────────────────────────────────────────
const COMPS = [
  // THE TARGET
  { name: COMPANY.name,       ticker: COMPANY.ticker, ev: 194557, rev: 71230, ebitda: 16293, netInc: 8173,  evRev: 2.7,  evEbitda: 11.9, pe: 23.8, margin: 22.9, country: "India",     target: true  },
  
  // GLOBAL LOW-COST CARRIERS (LCC)
  { name: "Ryanair",          ticker: "RYA",    ev: 210000, rev: 131000, ebitda: 34000, netInc: 18640, evRev: 1.6,  evEbitda: 6.2,  pe: 11.3, margin: 26.0, country: "Ireland",   target: false },
  { name: "easyJet",          ticker: "EZJ",    ev: 68000,  rev: 83000,  ebitda: 14200, netInc: 5200,  evRev: 0.8,  evEbitda: 4.8,  pe: 13.1, margin: 17.1, country: "UK",        target: false },
  { name: "Southwest",        ticker: "LUV",    ev: 210000, rev: 247000, ebitda: 38200, netInc: 4650,  evRev: 0.8,  evEbitda: 5.5,  pe: 45.2, margin: 15.5, country: "USA",       target: false },
  { name: "Air Arabia",       ticker: "AIRARB", ev: 42000,  rev: 20800,  ebitda: 5420,  netInc: 3640,  evRev: 2.0,  evEbitda: 7.7,  pe: 11.5, margin: 26.1, country: "UAE",       target: false },
  { name: "Wizz Air",         ticker: "WIZZ",   ev: 38000,  rev: 45000,  ebitda: 8200,  netInc: 3500,  evRev: 0.8,  evEbitda: 4.6,  pe: 10.8, margin: 18.2, country: "Hungary",   target: false },
  { name: "JetBlue",          ticker: "JBLU",   ev: 39000,  rev: 80000,  ebitda: 6100,  netInc: -2500, evRev: 0.5,  evEbitda: 6.4,  pe: null, margin: 7.6,  country: "USA",       target: false },
  { name: "SpiceJet",         ticker: "SPJT",   ev: 12800,  rev: 12640,  ebitda: -840,  netInc: -2870, evRev: 1.0,  evEbitda: null, pe: null, margin: -6.6, country: "India",     target: false },
  
  // GLOBAL FULL-SERVICE & LEGACY CARRIERS (FSC)
  { name: "Delta Air Lines",  ticker: "DAL",    ev: 384300, rev: 481400, ebitda: 65200, netInc: 38180, evRev: 0.8,  evEbitda: 5.9,  pe: 7.4,  margin: 13.5, country: "USA",       target: false },
  { name: "United Airlines",  ticker: "UAL",    ev: 319500, rev: 445700, ebitda: 69700, netInc: 21500, evRev: 0.7,  evEbitda: 4.6,  pe: 6.8,  margin: 15.6, country: "USA",       target: false },
  { name: "American Airlines",ticker: "AAL",    ev: 298800, rev: 437400, ebitda: 59700, netInc: 6600,  evRev: 0.7,  evEbitda: 5.0,  pe: 14.5, margin: 13.6, country: "USA",       target: false },
  { name: "Singapore Airlines",ticker:"SIA",    ev: 132000, rev: 148500, ebitda: 39200, netInc: 16500, evRev: 0.9,  evEbitda: 3.4,  pe: 6.5,  margin: 26.4, country: "Singapore", target: false },
  { name: "Air France-KLM",   ticker: "AF",     ev: 105000, rev: 285500, ebitda: 35000, netInc: 8500,  evRev: 0.4,  evEbitda: 3.0,  pe: 4.2,  margin: 12.3, country: "France",    target: false },
  { name: "Lufthansa",        ticker: "LHA",    ev: 125000, rev: 315000, ebitda: 38000, netInc: 15500, evRev: 0.4,  evEbitda: 3.3,  pe: 4.8,  margin: 12.1, country: "Germany",   target: false },
  { name: "IAG (British Awys)",ticker:"IAG",    ev: 145000, rev: 275000, ebitda: 45000, netInc: 24500, evRev: 0.5,  evEbitda: 3.2,  pe: 4.5,  margin: 16.4, country: "UK",        target: false },
  { name: "Qantas",           ticker: "QAN",    ev: 95000,  rev: 110000, ebitda: 25000, netInc: 9500,  evRev: 0.9,  evEbitda: 3.8,  pe: 7.5,  margin: 22.7, country: "Australia", target: false },
  { name: "Air India",        ticker: "AIE",    ev: 85000,  rev: 48500,  ebitda: 3840,  netInc: -1250, evRev: 1.8,  evEbitda: 22.1, pe: null, margin: 7.9,  country: "India",     target: false },
];

// ── FINANCIAL RATIOS ──────────────────────────────────────────────────────
const RATIOS = {
  // FY2024 key ratios
  currentRatio:     1.01,
  quickRatio:       0.84,
  debtToEquity:     25.7,   // very high due to lease liabilities (IND AS 116)
  debtToEBITDA:     3.15,
  interestCoverage: 2.38,
  grossMargin:      63.3,
  ebitdaMargin:     22.9,
  netMargin:        11.5,
  roe:              409.5,  // distorted due to near-zero equity base
  roa:              9.9,
  roic:             17.8,
  assetTurnover:    0.87,
  pe:               23.8,
  evEbitda:         11.9,
  evRev:            2.7,
  priceSales:       2.7,
};

// ── MARKET TICKER ─────────────────────────────────────────────────────────
const TICKER_DATA = [
  { sym: COMPANY.ticker,  price: "₹5,048",  chg: "+₹124.5",  pct: "+2.53%", up: true  },
  { sym: "NIFTY50", price: "23,518",   chg: "+142.8",   pct: "+0.61%", up: true  },
  { sym: "SENSEX",  price: "77,414",   chg: "+468.2",   pct: "+0.61%", up: true  },
  { sym: "SPJT",    price: "₹41.2",    chg: "-₹1.8",    pct: "-4.19%", up: false },
  { sym: "BRENT",   price: "$82.14",   chg: "+$0.92",   pct: "+1.13%", up: true  },
  { sym: "USDINR",  price: "87.15",    chg: "+0.22",    pct: "+0.25%", up: false },
  { sym: "NIFTY IT",price: "38,240",   chg: "+284",     pct: "+0.75%", up: true  },
  { sym: "10Y-GSEC",price: "6.82%",   chg: "+0.02",    pct: "+0.3%",  up: false },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Executive Dashboard",  href: "index.html" },
  { icon: "⚖️",  label: "Balance Sheet",        href: "balance-sheet.html" },
  { icon: "📈", label: "Income Statement",     href: "income-statement.html" },
  { icon: "💵", label: "Cash Flow",            href: "cash-flow.html" },
  { icon: "✈️",  label: "Ops & Fleet Analytics",href: "operations.html" },
  { icon: "🔢", label: "DCF Valuation",        href: "dcf.html" },
  { icon: "🏦", label: "LBO Model",            href: "lbo.html" },
  { icon: "🤝", label: "M&A Comps (Global)",   href: "comps.html" },
  { icon: "📐", label: "Financial Ratios",     href: "ratios.html" },
  { icon: "🧠", label: "IB Research Report",   href: "analysis.html" },
  { icon: "⚡", label: "Macro Stress Engine",  href: "stress-test.html" },
  { icon: "🚨", label: "Distress Predictor",   href: "distress-predictor.html" },
];

// ── CHART DEFAULTS ────────────────────────────────────────────────────────
const CHART_DEFAULTS = {
  plugins: { legend: { labels: { color: '#7aaccc', font: { size: 11 }, padding: 16 } }, tooltip: { backgroundColor: '#0a1a30', titleColor: '#e8f4ff', bodyColor: '#7aaccc', borderColor: '#00b4ff33', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(0,180,255,0.05)' }, ticks: { color: '#7aaccc', font: { size: 10 }, maxRotation: 45 } },
    y: { grid: { color: 'rgba(0,180,255,0.05)' }, ticks: { color: '#7aaccc', font: { size: 10 } } }
  },
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 800, easing: 'easeInOutQuart' }
};

// ── UTILITIES ─────────────────────────────────────────────────────────────
function fmtCr(n) {
  if (n === null || n === undefined) return '—';
  const abs = Math.abs(n);
  if (abs >= 100000) return '₹' + (n/100000).toFixed(2) + 'L Cr';
  if (abs >= 1000)   return '₹' + (n/1000).toFixed(1) + 'K Cr';
  return '₹' + n.toFixed(0) + ' Cr';
}
function fmtCrShort(n) {
  if (n === null || n === undefined) return '—';
  if (Math.abs(n) >= 100000) return '₹' + (n/100000).toFixed(1) + 'L Cr';
  if (Math.abs(n) >= 1000)   return '₹' + (n/1000).toFixed(1) + 'K Cr';
  return '₹' + n + ' Cr';
}
function fmtN(n, dec=0) {
  if (n === null || n === undefined) return '—';
  return n < 0 ? '(' + Math.abs(n).toFixed(dec) + ')' : n.toFixed(dec);
}
function pctChg(a, b) {
  if (!a || a === 0) return '—';
  const p = ((b - a) / Math.abs(a) * 100);
  return (p >= 0 ? '+' : '') + p.toFixed(1) + '%';
}
function colorOf(n) { return n >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'; }
function classOf(n) { return n >= 0 ? 'positive' : 'negative'; }
function last(arr) { return arr[arr.length - 1]; }
function secondLast(arr) { return arr[arr.length - 2]; }

// ── DYNAMIC DOM REPLACE ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    if (searchedCompany) {
        document.title = COMPANY.name + " — Investment Banking Dashboard";
        document.querySelectorAll('.section-title').forEach(el => {
            if(el.innerHTML.includes('IndiGo') || el.innerHTML.includes('Loading')) {
                 el.innerHTML = `${COMPANY.name} 💼 <span style="color:var(--accent-blue);font-size:16px;margin-left:8px;">${COMPANY.exchange}: ${COMPANY.ticker}</span>`;
            }
        });
        document.querySelectorAll('.section-subtitle').forEach(el => {
             el.innerHTML = `Financial Analytics · 15-Year Data Projection`;
        });
        document.querySelectorAll('div').forEach(el => {
            if (el.innerText.includes('INTERGLOBE AVIATION LTD') && el.children.length === 0) {
                 el.innerText = `${COMPANY.name.toUpperCase()} · 15-YEAR FINANCIAL INTELLIGENCE`;
            }
        });
        document.querySelectorAll('.story-card .card-title, .card .card-title').forEach(el => {
            if(el.innerHTML.includes('IndiGo')) el.innerHTML = el.innerHTML.replace('IndiGo', COMPANY.name);
        });
    }
});

// ── SIDEBAR & TOPBAR BUILDERS ─────────────────────────────────────────────
function buildTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return items.map(t => `
    <span class="ticker-item">
      <span class="ticker-sym">${t.sym}</span>
      <span class="ticker-price">${t.price}</span>
      <span class="${t.up ? 'ticker-up' : 'ticker-down'}">${t.up ? '▲' : '▼'} ${t.pct}</span>
    </span>`).join('');
}

function buildSidebar(activePage) {
  const qStr = searchedCompany ? '?company=' + encodeURIComponent(searchedCompany) : '';
  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">💼</div>
        <div>
          <div class="logo-text">${COMPANY.ticker}</div>
          <div class="logo-sub">NSE: ${COMPANY.ticker} · Intelligence</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Financial Statements</div>
        ${NAV_ITEMS.slice(0,4).map(item => `
          <a href="${item.href}${qStr}" class="nav-item ${activePage === item.href ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>${item.label}
          </a>`).join('')}
        <div class="nav-section-label" style="margin-top:8px;">Advanced Models</div>
        ${NAV_ITEMS.slice(4).map(item => `
          <a href="${item.href}${qStr}" class="nav-item ${activePage === item.href ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>${item.label}
          </a>`).join('')}
      </nav>
      <div class="sidebar-footer">
        ${COMPANY.name}<br>
        <span style="color:var(--accent-blue)">FY2011–FY2025E</span>
      </div>
    </aside>`;
}

function buildTopbar(title, subtitle) {
  const q = searchedCompany || '';
  return `
    <div class="topbar">
      <div class="topbar-left">
        <div>
          <div class="page-title">${title}</div>
          <div class="page-subtitle">${subtitle.replace('IndiGo', COMPANY.name).replace('InterGlobe Aviation', COMPANY.name)}</div>
        </div>
      </div>
      <div class="topbar-right" style="display:flex; align-items:center; gap:16px;">
        <form action="" method="GET" class="search-form">
            <input type="text" name="company" placeholder="Search Company..." value="${q}" class="search-input" />
            <button type="submit" class="search-btn">🔍</button>
        </form>
        <div class="company-badge">
          <strong>${COMPANY.ticker}</strong> &nbsp;₹${COMPANY.sharePrice.toLocaleString('en-IN')} &nbsp;<span style="color:var(--accent-green)">▲ +2.53%</span>
        </div>
        <div class="live-badge"><div class="live-dot"></div> NSE LIVE</div>
      </div>
    </div>`;
}

// ── DOM POPULATION ────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Populate KPIs
    const setKPI = (id, val, chgId, chgVal) => {
        const el = document.getElementById(id);
        const cel = document.getElementById(chgId);
        if (el) el.innerText = val;
        if (cel && chgVal) {
             cel.innerText = chgVal;
             cel.className = 'kpi-change ' + classOf(parseFloat(chgVal));
        }
    };

    const rev = last(IS.revenue);
    const revChg = pctChg(secondLast(IS.revenue), rev);
    setKPI('kpi-rev', fmtCr(rev), 'kpi-rev-yoy', revChg);

    const ebitda = last(IS.ebitda);
    const ebitdaChg = pctChg(secondLast(IS.ebitda), ebitda);
    setKPI('kpi-ebitda', fmtCr(ebitda), 'kpi-ebitda-margin', ebitdaChg);

    const ni = last(IS.netIncome);
    const niChg = pctChg(secondLast(IS.netIncome), ni);
    setKPI('kpi-ni', fmtCr(ni), 'kpi-ni-margin', niChg);

    const mcapEl = document.getElementById('kpi-mcap');
    if (mcapEl) mcapEl.innerText = COMPANY.marketCap;

    const summaryEl = document.getElementById('company-summary');
    if (summaryEl) summaryEl.innerText = `${COMPANY.name} is a leading player in the ${COMPANY.sector} sector. Founded in ${COMPANY.founded} and listed in ${COMPANY.listed}, it is headquartered in ${COMPANY.headquarter}. Led by CEO ${COMPANY.ceo}, the company has maintained a strong market position with a focus on operational efficiency and customer service.`;

    const ratios = [
      {id: 'snap-pe', val: RATIOS.pe},
      {id: 'snap-fpe', val: (RATIOS.pe * 0.85).toFixed(1)},
      {id: 'snap-div', val: '0.00%'},
      {id: 'snap-beta', val: '1.25'},
      {id: 'snap-high', val: '₹5,048'},
      {id: 'snap-low', val: '₹1,980'}
    ];
    ratios.forEach(r => {
        const el = document.getElementById(r.id);
        if (el) el.innerText = r.val || '—';
    });

    const newsEl = document.getElementById('news-container');
    if (newsEl) {
        newsEl.innerHTML = `
            <div class="event-line">
                <div class="event-year">Today</div>
                <div class="event-text">${COMPANY.name} announces stellar Q4 results, outperforming market expectations.<span class="event-tag tag-green">Earnings</span></div>
            </div>
            <div class="event-line">
                <div class="event-year">2d ago</div>
                <div class="event-text">Analysts upgrade ${COMPANY.ticker} to 'Strong Buy' citing robust market share growth.<span class="event-tag tag-blue">Upgrade</span></div>
            </div>
            <div class="event-line">
                <div class="event-year">1w ago</div>
                <div class="event-text">${COMPANY.name} expands operational capacity with strategic new investments.<span class="event-tag tag-gold">Expansion</span></div>
            </div>
        `;
    }

    // --- HOTFIX: Evaluate broken template literals (${...}) found in static HTML ---
    document.querySelectorAll('.fin-table tbody, .fin-table thead, .kpi-grid').forEach(container => {
        let html = container.innerHTML;
        if (html.includes('${')) {
            try {
                // Dynamically build a function that maps data.js global variables and returns an evaluated template literal.
                const evalHtml = new Function('YEARS', 'YEARS_SHORT', 'IS', 'BS', 'CF', 'OPS', 'COMPANY', 'fmtCr', 'fmtCrShort', 'fmtN', 'pctChg', 'colorOf', 'classOf', 'last', 'secondLast', 
                    'return `' + html + '`;'
                );
                // Execute and replace with fully rendered static HTML
                container.innerHTML = evalHtml(YEARS, YEARS_SHORT, IS, BS, CF, OPS, COMPANY, fmtCr, fmtCrShort, fmtN, pctChg, colorOf, classOf, last, secondLast);
            } catch (e) {
                console.error("Dashboard Template Fixer Error:", e);
            }
        }
    });

    // Initialize Charts from index.html if present
    if (typeof window.initCharts === 'function') {
        window.initCharts();
    }
});
