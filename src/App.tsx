import { useEffect, useState } from "react";

type Result = {
  characters: number;
  words: number;
  upper: number;
  lower: number;
  vowels: number;
  consonants: number;
  uniqueLetters: number;
  specialCount: number;
};

type ColorTheme = "blue" | "indigo" | "purple" | "emerald" | "pink" | "amber";

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
    specialCount: 0,
  });

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(
        "selectedText",
        (data: { selectedText?: string }) => {
          const selected = data.selectedText || "";
          analyzeText(selected);
        }
      );
    } else {
      const demoText = "Select some text on any webpage to analyze it! This is a Text Analyzer Extension using Tailwind CSS v4.";
      analyzeText(demoText);
    }
  }, []);

  const analyzeText = (selected: string) => {
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
      } else if (!/\s/.test(char) && !/[0-9]/.test(char)) {
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
      specialCount: special.length,
    });
  };

  const colorClasses: Record<ColorTheme, { border: string; bg: string; text: string; glow: string }> = {
    blue: {
      border: "hover:border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      glow: "group-hover:bg-blue-500/20"
    },
    indigo: {
      border: "hover:border-indigo-500/30",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      glow: "group-hover:bg-indigo-500/20"
    },
    purple: {
      border: "hover:border-purple-500/30",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      glow: "group-hover:bg-purple-500/20"
    },
    emerald: {
      border: "hover:border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "group-hover:bg-emerald-500/20"
    },
    pink: {
      border: "hover:border-pink-500/30",
      bg: "bg-pink-500/10",
      text: "text-pink-400",
      glow: "group-hover:bg-pink-500/20"
    },
    amber: {
      border: "hover:border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      glow: "group-hover:bg-amber-500/20"
    }
  };

  const StatBox = ({ label, value, color }: { label: string; value: string | number; color: ColorTheme }) => {
    const classes = colorClasses[color];
    return (
      <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-sm transition-all hover:scale-[1.02] ${classes.border} overflow-hidden relative group`}>
        <div className={`absolute -right-2 -bottom-2 w-12 h-12 ${classes.bg} rounded-full blur-xl ${classes.glow} transition-all`}></div>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">{label}</p>
        <p className={`text-xl font-bold ${classes.text}`}>{value}</p>
      </div>
    );
  };

  return (
    <div className="w-[360px] min-h-[480px] bg-slate-900 text-slate-100 p-5 font-sans selection:bg-blue-500/30">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Text Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">Intelligent text insights</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 ml-1">Analyzed Text</h3>
        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 max-h-24 overflow-y-auto text-sm leading-relaxed text-slate-300 italic scrollbar-thin scrollbar-thumb-slate-700">
          {text ? `"${text}"` : <span className="text-slate-600">No text selected...</span>}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatBox label="Words" value={result.words} color="blue" />
        <StatBox label="Characters" value={result.characters} color="indigo" />
        <StatBox label="Uppercase" value={result.upper} color="emerald" />
        <StatBox label="Lowercase" value={result.lower} color="pink" />
        <StatBox label="Vowels" value={result.vowels} color="purple" />
        <StatBox label="Consonants" value={result.consonants} color="amber" />
        <StatBox label="Unique Letters" value={result.uniqueLetters} color="blue" />
        <StatBox label="Special Chars" value={result.specialCount} color="indigo" />
      </div>

      <footer className="mt-auto text-center border-t border-slate-800 pt-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Text Analyzer Extension • v1.2.0</p>
      </footer>
    </div>
  );
}

export default App;