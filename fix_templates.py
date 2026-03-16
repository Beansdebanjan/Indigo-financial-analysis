import re
import os
import json

# This python script will read data.js to get the variables,
# then parse each HTML file, extract the exact ${...} block (with nested brackets support),
# and execute it locally using osascript (JXA) to evaluate it perfectly natively.

def get_data_js():
    with open('data.js', 'r') as f:
        content = f.read()
    # Replace const with var so eval works in JXA
    return content.replace('const ', 'var ').replace('let ', 'var ')

# Find ${...} with balanced brackets
def find_templates(text):
    templates = []
    i = 0
    while i < len(text):
        idx = text.find('${', i)
        if idx == -1:
            break
        
        # Found ${, now find balancing }
        brace_count = 1
        j = idx + 2
        in_string = False
        string_char = ''
        
        while j < len(text):
            c = text[j]
            if not in_string:
                if c in ('"', "'", '`'):
                    in_string = True
                    string_char = c
                elif c == '{':
                    brace_count += 1
                elif c == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        templates.append((idx, j + 1, text[idx:j+1]))
                        break
            else:
                raw_j = j
                if c == string_char and text[j-1] != '\\':
                    in_string = False
            j += 1
        i = max(idx + 1, j)
    return templates

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ('ratios.html', 'cash-flow.html', 'index.html')]
data_script = get_data_js()

for file in files:
    with open(file, 'r') as f:
        html = f.read()
    
    templates = find_templates(html)
    if not templates:
        continue
        
    print(f"Fixing {len(templates)} templates in {file}...")
    
    # We will build a single JXA script to evaluate all templates in one go for speed
    jxa_script = f"""
    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    
    // Mock DOM objects for data.js
    var window = {{ location: {{ search: '' }}, addEventListener: function() {{}} }};
    var URLSearchParams = function() {{ return {{ get: function() {{ return null; }} }}; }};
    var document = {{ addEventListener: function() {{}}, getElementById: function() {{ return {{ className: '', innerHTML: '', style: {{}} }}; }}, querySelectorAll: function() {{ return []; }} }};
    
    {data_script}
    
    function fmtCr(n) {{ if(n===null) return '—'; let v=Math.abs(n); if(v>=1000) return '₹'+(n/1000).toFixed(1)+'K Cr'; return '₹'+n.toFixed(0)+' Cr'; }}
    function fmtCrShort(n) {{ if(n===null) return '—'; let v=Math.abs(n); if(v>=1000) return '₹'+(n/1000).toFixed(1)+'K Cr'; return '₹'+n+' Cr'; }}
    function fmtN(n, dec=0) {{ if(n===null) return '—'; return n<0 ? '('+Math.abs(n).toFixed(dec)+')' : n.toFixed(dec); }}
    function pctChg(a,b) {{ if(!a||a===0) return '—'; let p=((b-a)/Math.abs(a)*100); return (p>=0?'+':'')+p.toFixed(1)+'%'; }}
    function colorOf(n) {{ return n >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'; }}
    function classOf(n) {{ return n >= 0 ? 'positive' : 'negative'; }}
    function last(arr) {{ return arr[arr.length - 1]; }}
    function secondLast(arr) {{ return arr[arr.length - 2]; }}
    
    var results = [];
    var expressions = [
    """
    
    for _, _, temp in templates:
        expr = temp[2:-1] # Remove ${ and }
        jxa_script += f"function() {{ return {expr}; }},\n"
        
    jxa_script += "];\n"
    jxa_script += "expressions.forEach(f => { try { results.push(f()); } catch(e) { results.push('ERROR:' + e.message); } });\n"
    jxa_script += "JSON.stringify(results);\n"
    
    # Run JXA
    with open('tmp_jxa.js', 'w') as f:
        f.write(jxa_script)
        
    import subprocess
    res = subprocess.run(['osascript', '-l', 'JavaScript', 'tmp_jxa.js'], capture_output=True, text=True)
    
    if res.returncode != 0:
        print("JXA Error:", res.stderr)
        continue
        
    try:
        results = json.loads(res.stdout)
    except:
        print("Failed to parse JSON:", res.stdout[:500])
        continue
        
    # Replace templates from last to first
    for i, (start, end, temp) in reversed(list(enumerate(templates))):
        if str(results[i]).startswith('ERROR:'):
            print("Template Eval Error in", file, ":", results[i])
            continue
        html = html[:start] + str(results[i]) + html[end:]
        
    with open(file, 'w') as f:
        f.write(html)
    print(f"Fixed {file}")

if os.path.exists('tmp_jxa.js'):
    os.remove('tmp_jxa.js')
