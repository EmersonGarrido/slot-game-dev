import React, { useState, useEffect, useRef } from 'react';

interface SecretTerminalProps {
  onActivateTerminalMode: () => void;
  onSecretCommand?: (command: string) => { success: boolean; message: string } | null;
  onHackerMode?: (winChance: number) => void;
  onPhysicsMode?: () => void;
}

const SecretTerminal: React.FC<SecretTerminalProps> = ({ onActivateTerminalMode, onSecretCommand, onHackerMode, onPhysicsMode }) => {
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

  const [hackerMode, setHackerMode] = useState(false);
  const [winChance, setWinChance] = useState(50);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `> ${cmd}`];

    // Comando secreto do dinheiro
    if (trimmedCmd === 'faz o l' && onSecretCommand) {
      const result = onSecretCommand(cmd);
      if (result) {
        if (result.success) {
          newHistory.push('[ SISTEMA ]: 💰💰💰 MONEY GLITCH ATIVADO! 💰💰💰');
          newHistory.push(`[ SISTEMA ]: ${result.message}`);
          newHistory.push('[ SISTEMA ]: "Aproveite enquanto dura..."');
        } else {
          newHistory.push('[ SISTEMA ]: ❌ ERRO CRÍTICO ❌');
          newHistory.push(`[ SISTEMA ]: ${result.message}`);
          newHistory.push('[ SISTEMA ]: "Quando tivemos a chance de estocar vento, nós não fizemos isso!"');
        }
        setHistory(newHistory);
        return;
      }
    }

    // Modo HACKER
    if (trimmedCmd === 'ruyter' || trimmedCmd === 'virginia' || trimmedCmd === 'silvercop') {
      if (!hackerMode) {
        setHackerMode(true);
        newHistory.push('[ SISTEMA ]: 🔓 MODO HACKER ATIVADO! 🔓');
        newHistory.push('[ SISTEMA ]: "Você agora tem o controle do RNG!"');
        newHistory.push('');
        newHistory.push('COMANDOS HACKER:');
        newHistory.push('  win [0-100]  - Define chance de vitória (%)');
        newHistory.push('  apply        - Aplica as modificações');
        newHistory.push('  reset        - Restaura valores padrões');
        newHistory.push('');
        newHistory.push(`[ STATUS ]: Chance de vitória atual: ${winChance}%`);
      } else {
        newHistory.push('[ SISTEMA ]: Modo hacker já está ativo!');
      }
      setHistory(newHistory);
      return;
    }

    // Comandos do modo HACKER
    if (hackerMode) {
      if (trimmedCmd.startsWith('win ')) {
        const chance = parseInt(trimmedCmd.split(' ')[1]);
        if (!isNaN(chance) && chance >= 0 && chance <= 100) {
          setWinChance(chance);
          newHistory.push(`[ HACKER ]: Chance de vitória definida para ${chance}%`);
          newHistory.push(`[ HACKER ]: Use 'apply' para aplicar as mudanças`);
        } else {
          newHistory.push('[ ERRO ]: Use um valor entre 0 e 100');
        }
        setHistory(newHistory);
        return;
      }

      if (trimmedCmd === 'apply') {
        if (onHackerMode) {
          onHackerMode(winChance);
          newHistory.push('[ HACKER ]: ✅ Modificações aplicadas!');
          newHistory.push(`[ HACKER ]: Jogo manipulado com ${winChance}% de chance de vitória`);
          newHistory.push('[ HACKER ]: Feche o terminal (ESC) e jogue!');
        }
        setHistory(newHistory);
        return;
      }

      if (trimmedCmd === 'reset') {
        setWinChance(50);
        if (onHackerMode) {
          onHackerMode(50);
        }
        newHistory.push('[ HACKER ]: Valores restaurados ao padrão');
        setHistory(newHistory);
        return;
      }
    }

    // Comando FELCA - ativa física
    if (trimmedCmd === 'felca') {
      if (onPhysicsMode) {
        onPhysicsMode();
        newHistory.push('[ SISTEMA ]: 🌪️ GRAVIDADE ATIVADA! 🌪️');
        newHistory.push('[ SISTEMA ]: "A física tomou conta do cassino!"');
        newHistory.push('[ SISTEMA ]: "Tudo está caindo... LITERALMENTE!"');
      }
      setHistory(newHistory);
      return;
    }

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
      newHistory.push('  [DICA]: Alguns comandos podem fazer o L...');
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