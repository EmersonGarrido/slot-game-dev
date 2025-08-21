import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const devPhrases = [
  // 💻 Clássicos do sofrimento dev
  "Hoje é sexta e você precisa subir em prod 😱",
  "O bug só aparece quando o cliente usa 🤷",
  "Funciona na minha máquina 💻",
  "Deploy falhou e não tem log 📝",
  "O estagiário tinha razão 😅",
  "Você quebrou a master 💔",
  "O rollback também quebrou 🔥",
  "Só funciona se reiniciar o servidor 🔄",
  "Você esqueceu o ; 😭",
  "O cliente atualizou o navegador 🌐",
  
  // 📅 Prazos e cobranças
  "O pagamento não cai sem a task 💸",
  "A task 'fácil' virou épica 📚",
  "A daily virou retrospectiva ⏰",
  "Sprint acaba amanhã e nada funciona 🏃",
  "O prazo era ontem ⚡",
  "O PO adicionou 'só mais uma coisinha' 🎯",
  "Você virou responsável pelo legado 👴",
  "O deploy é meia-noite de domingo 🌙",
  "Tem hotfix na madrugada 🌃",
  "Ninguém sabe quem escreveu isso 🕵️",
  
  // 🐛 Bugs e imprevistos
  "Bug só aparece em produção 🐞",
  "Você arrumou um bug e criou três 🎰",
  "O log está vazio 📋",
  "O teste passa, mas quebra em prod ✅❌",
  "O bug só acontece na máquina do chefe 👔",
  "O bug sumiu sozinho 👻",
  "O bug volta sempre às 3h da manhã ⏰",
  "O bug só acontece na Black Friday 🛍️",
  "O bug é 'feature' ✨",
  "Você corrigiu o bug errado 🎯",
  
  // ☕ Vida dev sofrida
  "O café acabou ☕",
  "A call podia ser um e-mail 📧",
  "O Jira caiu 📊",
  "O GitHub tá fora do ar 🐙",
  "Merge conflict infinito 🔀",
  "O Wi-Fi caiu no deploy 📡",
  "Você esqueceu de dar git pull ⬇️",
  "Você fez o push na branch errada 🌳",
  "O backup não existe 💾",
  "O Jenkins morreu 🤖",
  
  // 🔥 Tragédias maiores
  "O banco foi apagado em produção 🗑️",
  "O servidor caiu no feriado 🏖️",
  "O staging está igual à produção 🎭",
  "O token do cliente vazou 🔑",
  "Você subiu a senha no Git 🔒",
  "A API de terceiros mudou sem aviso 🔌",
  "A LGPD bateu na sua porta 📜",
  "A task tem dependência não feita 🔗",
  "O front e o back não se falam 💔",
  "O commit é sexta-feira 18h 🕰️",
  
  // PHP específicos
  "PHP é vida! 💜",
  "PHP > Node.js 🐘",
  "Laravel salvou o dia 🚀",
  "Composer install resolveu 📦",
  "PHP 8 é o futuro 🔮",
];

const ElephantSpeechBubble = () => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const showNewPhrase = () => {
      const randomPhrase = devPhrases[Math.floor(Math.random() * devPhrases.length)];
      setCurrentPhrase(randomPhrase);
      setShowBubble(true);
      
      // Hide bubble after 4 seconds
      setTimeout(() => {
        setShowBubble(false);
      }, 4000);
    };

    // Show first phrase after 2 seconds
    const firstTimeout = setTimeout(showNewPhrase, 2000);
    
    // Then show new phrase every 8 seconds
    const interval = setInterval(showNewPhrase, 8000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBubble && (
        <motion.div
          className="absolute top-0 left-1/4 bg-white rounded-3xl px-8 py-5 shadow-2xl max-w-md"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ 
            opacity: 1,
            scale: [0, 1.1, 1],
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            y: -10
          }}
          transition={{
            duration: 0.3,
            scale: {
              times: [0, 0.6, 1],
              duration: 0.4
            }
          }}
          style={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2)'
          }}
        >
          <p className="text-lg sm:text-xl font-bold text-purple-600">
            {currentPhrase}
          </p>
          <div className="absolute bottom-0 right-12 w-0 h-0 
                          border-l-[16px] border-l-transparent
                          border-t-[16px] border-t-white
                          border-r-[16px] border-r-transparent
                          translate-y-full"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElephantSpeechBubble;