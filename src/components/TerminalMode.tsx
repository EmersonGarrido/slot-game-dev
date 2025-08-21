import React, { useState, useEffect, useRef } from 'react';

interface TerminalModeProps {
  balance: number;
  onSpin: () => { symbols: string[], won: boolean, winAmount: number };
  onUpdateBalance: (amount: number) => void;
}

const TerminalMode: React.FC<TerminalModeProps> = ({ balance, onSpin, onUpdateBalance }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOutput([
      '████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗',     
      '╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║',     
      '   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║',     
      '   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║',     
      '   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗',
      '   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝',
      '',
      '[ SISTEMA ANTI-FRONTEND ATIVADO ]',
      '[ O GRANDE ROLLBACK COMEÇOU - FRONTEND É PARA OS FRACOS ]',
      '[ JOGUE VIA TERMINAL AGORA! ]',
      '',
      '=================================================================',
      `SALDO: R$ ${balance.toFixed(2)}`,
      '=================================================================',
      '',
      'COMANDOS:',
      '  spin [valor]  - Gira o slot com aposta específica',
      '  balance       - Mostra saldo atual', 
      '  help          - Lista comandos',
      '  exit          - Sair do modo terminal',
      '',
      '> Aguardando comando...'
    ]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [balance]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (lines: string[]) => {
    setOutput(prev => [...prev, ...lines]);
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    addOutput([`> ${cmd}`]);

    switch (command) {
      case 'spin':
        if (isSpinning) {
          addOutput(['[ ERRO ]: Já existe um giro em andamento!']);
          return;
        }

        const betAmount = parseFloat(args[0]) || 10;
        
        if (betAmount > balance) {
          addOutput(['[ ERRO ]: Saldo insuficiente!']);
          return;
        }

        if (betAmount <= 0) {
          addOutput(['[ ERRO ]: Aposta deve ser maior que zero!']);
          return;
        }

        setIsSpinning(true);
        onUpdateBalance(-betAmount);
        
        addOutput([
          '',
          `[ APOSTANDO ]: R$ ${betAmount.toFixed(2)}`,
          '[ GIRANDO ]: ░░░░░░░░░░'
        ]);

        setTimeout(() => {
          const result = onSpin();
          const displaySymbols = result.symbols.map(s => {
            switch(s) {
              case '🐞': return 'BUG';
              case '🔥': return 'FIRE';
              case '💾': return 'MEMORY';
              case '🔧': return 'DEPLOY';
              case '☕': return 'COFFEE';
              case '💀': return 'DEATH';
              default: return s;
            }
          });

          addOutput([
            '[ GIRANDO ]: ████████░░',
          ]);

          setTimeout(() => {
            addOutput([
              '[ GIRANDO ]: ██████████',
              '',
              '┌─────────────────────────────┐',
              `│  ${displaySymbols[0]}  │  ${displaySymbols[1]}  │  ${displaySymbols[2]}  │`,
              '└─────────────────────────────┘',
              ''
            ]);

            if (result.won) {
              onUpdateBalance(result.winAmount);
              addOutput([
                '██╗   ██╗██╗████████╗ ██████╗ ██████╗ ██╗ █████╗ ██╗',
                '██║   ██║██║╚══██╔══╝██╔═══██╗██╔══██╗██║██╔══██╗██║',
                '██║   ██║██║   ██║   ██║   ██║██████╔╝██║███████║██║',
                '╚██╗ ██╔╝██║   ██║   ██║   ██║██╔══██╗██║██╔══██║╚═╝',
                ' ╚████╔╝ ██║   ██║   ╚██████╔╝██║  ██║██║██║  ██║██╗',
                '  ╚═══╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝',
                '',
                `[ GANHOU ]: R$ ${result.winAmount.toFixed(2)}!`,
                `[ NOVO SALDO ]: R$ ${(balance - betAmount + result.winAmount).toFixed(2)}`
              ]);
            } else {
              addOutput([
                '[ PERDEU ]: Tente novamente!',
                `[ NOVO SALDO ]: R$ ${(balance - betAmount).toFixed(2)}`
              ]);
            }

            setIsSpinning(false);
          }, 500);
        }, 1000);
        break;

      case 'balance':
        addOutput([
          '',
          `[ SALDO ATUAL ]: R$ ${balance.toFixed(2)}`,
          ''
        ]);
        break;

      case 'help':
        addOutput([
          '',
          'COMANDOS DISPONÍVEIS:',
          '  spin [valor]  - Gira o slot (padrão: R$ 10)',
          '  balance       - Mostra saldo atual',
          '  clear         - Limpa terminal',
          '  exit          - Volta ao modo visual',
          ''
        ]);
        break;

      case 'clear':
        setOutput([
          '[ TERMINAL LIMPO ]',
          `[ SALDO ]: R$ ${balance.toFixed(2)}`,
          '> Aguardando comando...'
        ]);
        break;

      case 'exit':
        addOutput(['[ AVISO ]: Use F5 para recarregar e voltar ao modo visual']);
        break;

      default:
        if (cmd.trim()) {
          addOutput([`[ ERRO ]: Comando não reconhecido: ${cmd}`]);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
      // Mantém o foco no input após enviar o comando
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono p-4 overflow-hidden">
      <div 
        ref={terminalRef}
        className="h-[calc(100vh-60px)] overflow-y-auto whitespace-pre text-sm leading-relaxed"
      >
        {output.map((line, index) => (
          <div 
            key={index}
            className={
              line.includes('VITORIA') || line.includes('GANHOU') 
                ? 'text-yellow-400 animate-pulse' 
                : line.includes('ERRO') || line.includes('PERDEU')
                ? 'text-red-400'
                : line.includes('SISTEMA') || line.includes('ROLLBACK')
                ? 'text-cyan-400'
                : ''
            }
          >
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span className="text-green-400 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
          disabled={isSpinning}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default TerminalMode;