'use client'
import  {useState, useRef, useEffect} from 'react'

export default function Terminal() {
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    const commands: Record<string, string> = {
        about: "Hi, I'm Harshdeep Bhatty. I'm a software engineer with a passion for building scalable and efficient systems.",
        skills: "Java, JavaScript, TypeScript, Python, Next.js, Docker",
        education: "Bachelor of Computing - University of Guelph",
        interests: "I like to watch sports/e-sports, play games, read books, and go on long walks!",
        help: "Available commands: about, skills, education, interests, clear, help",
        clear: ""
    }

    useEffect(() => {
        if (terminalRef.current) {
            const { scrollHeight, clientHeight } = terminalRef.current;
            if (scrollHeight > clientHeight) {
                terminalRef.current.scrollTop = scrollHeight;
            }
        }
    }, [displayedLines]);

    const fakeTyping = (text: string, delay = 10) => {
        let i = 0;
        const typedOutput: string[] = [];

        const typeNext = () => {
            if (i <= text.length) {
              typedOutput.push(text.slice(0, i));
              setDisplayedLines((prev) => [...prev.slice(0, -1), text.slice(0, i)]);
              i++;
              setTimeout(typeNext, delay);
            }
          };
          typeNext();
    }

const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, `C:\\Users\\harsh> ${cmd}`];

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(null);

    if (cmd === 'clear') {
      setHistory([]);
      setDisplayedLines([]);
    } else {
      const output = commands[cmd] || `Command not found: ${cmd}`;

      setHistory([...newHistory, output]);

      setDisplayedLines([...newHistory, '']);
      fakeTyping(output);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex === null
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);

      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === null) return;

      const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || '');
    }
  };

  return (
    <div ref={terminalRef} className="bg-black text-green-400 font-mono p-6 rounded-lg shadow-md h-[325px] overflow-y-auto">
      {displayedLines.map((line, idx) => (
        <div key={idx} className="whitespace-pre-wrap">{line}</div>
      ))}

      <form onSubmit={handleCommand} className="flex mt-2">
        <span>C:\Users\harsh{'>'}</span>
        <div className="relative flex-1">
          <input
            className="bg-black text-green-400 outline-none w-full caret-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <span className="absolute cursor-blink text-green-400" style={{ left: `${input.length}ch` }}>|</span>
        </div>
      </form>
    </div>
  );
}