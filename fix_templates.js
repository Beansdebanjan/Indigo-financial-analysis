const fs = require('fs');
const path = require('path');

// Read data.js to get the data
const dataJs = fs.readFileSync('data.js', 'utf8');

// The original file sets `const COMPANY`, `const IS`, etc.
// We need to evaluate data.js in this context
let evalScript = dataJs.replace(/const /g, 'var '); // Make them accessible
eval(evalScript);

// Utility functions from data.js
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

const files = ['income-statement.html', 'balance-sheet.html', 'operations.html', 'stress-test.html', 'dcf.html', 'lbo.html', 'comps.html', 'distress-predictor.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // We only want to replace `${...}` inside the HTML body, but NOT inside the `<script>` tag.
    // The `<script>` tags usually contain valid JS.
    let parts = content.split('<script>');
    
    let htmlPart = parts[0];
    let scriptPart = parts.length > 1 ? '<script>' + parts.slice(1).join('<script>') : '';
    
    // Replace ${...} in HTML part
    // Using a regex to match ${...} where the inner content doesn't contain another ${...}
    let modifiedHtml = htmlPart.replace(/\$\{([^}]+)\}/g, (match, expression) => {
        try {
            // Evaluate the expression within the context
            const result = eval(expression);
            return result === undefined ? '' : result;
        } catch (e) {
            console.error(`Error evaluating expression in ${file}: ${expression}`, e.message);
            return match; // Leave it intact if error
        }
    });

    let newContent = modifiedHtml + scriptPart;
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Fixed template literals in ${file}`);
    }
}
console.log('Done fixing HTML templates!');
