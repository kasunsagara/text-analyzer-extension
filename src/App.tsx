import { useEffect, useState } from "react";

type Result = {
  characters: number;
  words: number;
  upper: number;
  lower: number;
  vowels: number;
  consonants: number;
  uniqueLetters: number;
  specialChars: number;
};

function App() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<Result>({
    characters: 0,
    words: 0,
    upper: 0,
    lower: 0,
    vowels: 0,
    consonants: 0,
    uniqueLetters: 0,
    specialChars: 0,
  });

  useEffect(() => {
    chrome.storage.local.get(
      "selectedText",
      (data: { selectedText?: string }) => {
        const selected = data.selectedText || "";
        setText(selected);

        let upper = 0,
          lower = 0,
          vowels = 0,
          consonants = 0;

        const freq: Record<string, number> = {};
        const special: string[] = [];

        for (let char of selected) {
          if (/[a-zA-Z]/.test(char)) {
            const lowerChar = char.toLowerCase();
            freq[lowerChar] = (freq[lowerChar] || 0) + 1;

            if ("aeiou".includes(lowerChar)) vowels++;
            else consonants++;

            if (char === char.toUpperCase()) upper++;
            if (char === char.toLowerCase()) lower++;
          } else if (!/\s/.test(char)) {
            special.push(char);
          }
        }

        const words = selected.trim()
          ? selected.trim().split(/\s+/).length
          : 0;

        setResult({
          characters: selected.length,
          words,
          upper,
          lower,
          vowels,
          consonants,
          uniqueLetters: Object.keys(freq).length,
          specialChars: special.length,
        });
      }
    );
  }, []);

  return (
    <div className="w-[540px] min-h-[600px] p-6 font-sans bg-slate-900 text-white shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] rounded-full bg-indigo-600/20 blur-[80px]"></div>
        <div className="absolute top-[200px] -right-[100px] w-[250px] h-[250px] rounded-full bg-purple-600/20 blur-[80px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] mr-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-tight">
            Analyzer Pro
          </h2>
        </div>

        {/* Selected Text Area */}
        <div className="mb-6 group">
          <div className="relative bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-inner transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Analyzed Text</p>
              {text && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>}
            </div>
            <div className="max-h-24 overflow-y-auto pr-1">
              <p className="text-sm text-slate-300 leading-relaxed break-words font-medium">
                {text || "Highlight any text on a web page to see the analysis magic happen here ✨"}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-slate-800/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 space-y-4 shadow-lg">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Detailed statistics about the selected text</p>
          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Characters</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.characters}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Words</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.words}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Uppercase</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.upper}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-sky-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Lowercase</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.lower}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-pink-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(244,114,182,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Vowels</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.vowels}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Consonants</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.consonants}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Unique Letters</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{result.uniqueLetters}</span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-rose-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
              <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Special Characters</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md text-right max-w-[120px] truncate">
              {result.specialChars}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;