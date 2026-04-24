import { useEffect, useState } from "react";

type Result = {
  characters: number;
  words: number;
  upper: number;
  lower: number;
  vowels: number;
  consonants: number;
  uniqueLetters: number;
  specialChars: string[];
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
    specialChars: [],
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
          specialChars: special,
        });
      }
    );
  }, []);

  return (
    <div style={{ padding: "15px", width: "320px", fontFamily: "sans-serif" }}>
      <h2>Text Analyzer</h2>

      <p><b>Text:</b> {text || "No text selected"}</p>

      <hr />

      <p>Characters: {result.characters}</p>
      <p>Words: {result.words}</p>
      <p>Uppercase: {result.upper}</p>
      <p>Lowercase: {result.lower}</p>
      <p>Vowels: {result.vowels}</p>
      <p>Consonants: {result.consonants}</p>
      <p>Unique Letters: {result.uniqueLetters}</p>
      <p>Special Chars: {result.specialChars.join(", ") || "None"}</p>
    </div>
  );
}

export default App;