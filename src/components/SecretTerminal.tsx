import React, { useState, useEffect, useRef } from 'react';

interface SecretTerminalProps {
  onActivateTerminalMode: () => void;
}

const SecretTerminal: React.FC<SecretTerminalProps> = ({ onActivateTerminalMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['> Sistema iniciado...', '> Digite um comando...']);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atalho secreto: Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // ESC para fechar
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `> ${cmd}`];

    if (trimmedCmd === 'mano deyvin' || trimmedCmd === 'chorume') {
      newHistory.push('[ SISTEMA ]: Protocolo ANTI-FRONTEND ativado!');
      newHistory.push('[ SISTEMA ]: Iniciando modo TERMINAL PURO...');
      newHistory.push('[ SISTEMA ]: "O GRANDE ROLLBACK COMEÇOU!"');
      newHistory.push('[ SISTEMA ]: "Frontend é para os fracos. Jogue via terminal agora!"');
      setHistory(newHistory);
      
      setTimeout(() => {
        onActivateTerminalMode();
        setIsOpen(false);
      }, 2000);
    } else if (trimmedCmd === 'help') {
      newHistory.push('Comandos disponíveis:');
      newHistory.push('  help - Mostra esta mensagem');
      newHistory.push('  clear - Limpa o terminal');
      newHistory.push('  exit - Fecha o terminal');
      newHistory.push('  ?????? - Comandos secretos existem...');
      setHistory(newHistory);
    } else if (trimmedCmd === 'clear') {
      setHistory(['> Sistema limpo...']);
      return;
    } else if (trimmedCmd === 'exit') {
      setIsOpen(false);
      setInput('');
      return;
    } else if (trimmedCmd) {
      newHistory.push(`Comando não reconhecido: ${cmd}`);
      setHistory(newHistory);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center animate-fade-in">
      <div className="w-[800px] h-[500px] bg-black border-2 border-green-500 rounded-lg p-4 font-mono shadow-[0_0_50px_rgba(0,255,0,0.3)]">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-green-500 text-sm">
            Terminal v1.337 - [Ctrl+Shift+D]
          </div>
        </div>
        
        <div 
          ref={terminalRef}
          className="h-[400px] overflow-y-auto text-green-500 text-sm mb-2"
        >
          {history.map((line, index) => (
            <div 
              key={index} 
              className={`mb-1 ${line.startsWith('[ SISTEMA ]') ? 'text-yellow-400 animate-pulse' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500 caret-green-500"
            placeholder="Digite um comando..."
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default SecretTerminal;