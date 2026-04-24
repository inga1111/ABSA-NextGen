import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/ChatBot.css';


const SUGGESTED = [
  'Am I saving enough?',
  'What is a TFSA?',
  'Why is my spending high?',
  'What is my savings rate?',
  'How does tax work?',
  'What is a good emergency fund?',
  'Which strategy track suits me?',
  'What is compound interest?',
  'How do I improve my credit score?',
  'What is a bond?',
];


function generateResponse(message, userData, formatCurrency) {
  const msg = message.toLowerCase();
  const {
    firstName,
    netMonthly,
    grossMonthly,
    savingsRate,
    monthlySavings,
    monthlyInvestments,
    totalFixedExpenses,
    totalFlexibleExpenses,
    totalDebt,
    healthLabel,
    healthScore,
    dining,
    subscriptions,
    rent,
    primaryGoal,
  } = userData;

  const name = firstName ? `, ${firstName}` : '';
  const totalSavings = Number(monthlySavings || 0) + Number(monthlyInvestments || 0);

  // ── SAVINGS ──
  if (msg.includes('saving enough') || msg.includes('savings enough')) {
    if (savingsRate >= 20) {
      return `Great news${name}! 🎉 You're saving ${savingsRate}% of your income — that's above the recommended 20%. You're on a solid path. Keep it up and consider maxing out your TFSA if you haven't already.`;
    } else if (savingsRate >= 10) {
      return `You're saving ${savingsRate}% of your income${name}, which is a decent start — but the recommended target is at least 20%. You're currently putting away ${formatCurrency(totalSavings)} a month. Try increasing by even R500/month to build momentum.`;
    } else {
      return `Your current savings rate is ${savingsRate}%${name}, which is below the recommended 20%. You're saving ${formatCurrency(totalSavings)} per month from a net income of ${formatCurrency(netMonthly)}. Look at your lifestyle expenses — that's usually the best place to free up money.`;
    }
  }

  // ── SAVINGS RATE ──
  if (msg.includes('savings rate') || msg.includes('my rate')) {
    return `Your current savings rate is ${savingsRate}%${name}. This means you're saving ${formatCurrency(totalSavings)} out of your net monthly income of ${formatCurrency(netMonthly)}. Financial experts recommend saving at least 20% of your net income. ${savingsRate >= 20 ? "You're doing great! 💚" : 'There's room to grow — small increases add up fast.'}`;
  }

  // ── TFSA ──
  if (msg.includes('tfsa') || msg.includes('tax free') || msg.includes('tax-free')) {
    return `A Tax-Free Savings Account (TFSA) is one of the best tools for South Africans${name}! 💡 Here's how it works:\n\n• You can contribute up to R36 000 per year\n• Lifetime limit is R500 000\n• All growth, interest and withdrawals are 100% tax-free\n• ABSA offers TFSA products you can explore\n\nIt's ideal for medium to long-term savings goals like a property deposit or retirement.`;
  }

  // ── SPENDING HIGH ──
  if (msg.includes('spending high') || msg.includes('spend too much') || msg.includes('overspending')) {
    const topExpense = Number(rent || 0) > Number(dining || 0) ? 'rent/housing' : 'dining & lifestyle';
    return `Let's break it down${name}. Your monthly expenses are:\n\n• Fixed expenses: ${formatCurrency(totalFixedExpenses)}\n• Lifestyle expenses: ${formatCurrency(totalFlexibleExpenses)}\n\nYour biggest pressure point looks like ${topExpense}. A good rule of thumb is the 50/30/20 rule — 50% on needs, 30% on wants, 20% on savings. ${totalFlexibleExpenses > netMonthly * 0.3 ? 'Your lifestyle spending is a bit high — small cuts here can make a big difference.' : "You're doing reasonably well on lifestyle spending!"}`;
  }

  // ── TAX ──
  if (msg.includes('tax') && !msg.includes('tfsa')) {
    return `Great question${name}! In South Africa, we use a PAYE (Pay As You Earn) system. Here's a simple breakdown:\n\n• SARS deducts tax from your salary before you receive it\n• Tax is calculated on progressive brackets — the more you earn, the higher % you pay\n• You also pay 1% UIF (Unemployment Insurance Fund), capped at R177/month\n• Your effective tax rate is currently ${userData.effectiveTaxRate || '~25'}%\n\nYour gross income is ${formatCurrency(grossMonthly)} and your take-home is ${formatCurrency(netMonthly)} after PAYE and UIF.`;
  }

  // ── EMERGENCY FUND ──
  if (msg.includes('emergency fund') || msg.includes('emergency')) {
    const target = Math.round(netMonthly * 3);
    const sixMonth = Math.round(netMonthly * 6);
    return `An emergency fund is money set aside for unexpected events${name} — job loss, medical bills, car trouble etc.\n\n• Minimum target: 3 months of expenses = ${formatCurrency(target)}\n• Ideal target: 6 months of expenses = ${formatCurrency(sixMonth)}\n\nKeep it in a separate savings account that earns interest but is still accessible. Don't invest your emergency fund — it needs to be liquid!`;
  }

  // ── STRATEGY TRACK ──
  if (msg.includes('strategy') || msg.includes('track') || msg.includes('which track') || msg.includes('suits me')) {
    if (primaryGoal === 'property') {
      return `Based on your profile${name}, you're on the Property Track 🏠. This means your focus is saving aggressively for a deposit (10–20% of property value) and improving your credit profile. Keep your lifestyle spending low and prioritise your deposit fund above all else.`;
    } else if (primaryGoal === 'growth') {
      return `Based on your profile${name}, you're on the Aggressive Growth Track 💹. Your focus is maximising investments — TFSA, ETFs, unit trusts and offshore exposure. Make sure savings rate stays above 25% and avoid idle cash.`;
    } else {
      return `Based on your profile${name}, the Balanced Lifestyle Track ⚖️ suits you well. This means enjoying your lifestyle while steadily building wealth — saving 10–15%, contributing to a TFSA, and avoiding big unnecessary debt. It's the most sustainable path.`;
    }
  }

  // ── COMPOUND INTEREST ──
  if (msg.includes('compound') || msg.includes('compound interest')) {
    return `Compound interest is one of the most powerful forces in personal finance${name}! 🚀\n\nIt means you earn interest on your interest — so your money grows exponentially over time.\n\nExample: If you invest ${formatCurrency(monthlyInvestments || 2000)}/month at 10% annual return:\n• After 5 years: ~${formatCurrency((monthlyInvestments || 2000) * 12 * 5 * 1.28)}\n• After 10 years: ~${formatCurrency((monthlyInvestments || 2000) * 12 * 10 * 1.63)}\n\nThe earlier you start, the more powerful it becomes. Time is your biggest asset!`;
  }

  // ── CREDIT SCORE ──
  if (msg.includes('credit score') || msg.includes('credit')) {
    return `Your credit score is crucial${name} — especially if you want to buy property! Here's how to improve it:\n\n✅ Pay all accounts on time, every time\n✅ Keep credit card balances below 30% of your limit\n✅ Don't apply for too many accounts at once\n✅ Pay more than the minimum on loans\n✅ Check your credit report regularly (TransUnion & Experian are free)\n\nA good score (650+) will get you better interest rates on a home loan — saving you hundreds of thousands over time.`;
  }

  // ── BOND ──
  if (msg.includes('bond') || msg.includes('home loan') || msg.includes('mortgage')) {
    return `A bond (also called a home loan) is a long-term loan from a bank to buy property${name} 🏡\n\nKey things to know:\n• South African banks typically require a 10–20% deposit\n• Loan terms are usually 20 years\n• Interest rates are linked to the prime lending rate (currently ~11.75%)\n• Monthly repayment on a R1.5M bond ≈ R15 000–R17 000/month\n\nBefore applying, make sure your debt-to-income ratio is below 30% and your credit score is healthy!`;
  }

  // ── NET INCOME ──
  if (msg.includes('net income') || msg.includes('take home') || msg.includes('take-home')) {
    return `Your net (take-home) income is ${formatCurrency(netMonthly)}${name}. This is your gross salary of ${formatCurrency(grossMonthly)} after PAYE tax and UIF deductions. This is the amount you actually have available to budget with each month.`;
  }

  // ── FINANCIAL HEALTH ──
  if (msg.includes('financial health') || msg.includes('health score') || msg.includes('how am i doing')) {
    return `Your current financial health status is: ${healthLabel} (${healthScore}/100)${name}.\n\n${healthScore >= 70 ? '💚 You\'re in great shape! Keep maintaining your savings and managing expenses.' : healthScore >= 40 ? '🟡 You\'re on the right track but there\'s room to improve — focus on increasing savings and reducing unnecessary spending.' : '🔴 There are some areas that need attention. Try to reduce expenses and start building a savings habit, even if it\'s small.'}`;
  }

  // ── HELLO / HI ──
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hola')) {
    return `Hey${name}! 👋 I'm your ABSA NextGen financial assistant. I'm here to help you understand your finances, answer money questions, and guide you on your wealth journey.\n\nTry asking me something like "Am I saving enough?" or "What is a TFSA?"`;
  }

  // ── THANK YOU ──
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('dankie')) {
    return `You're welcome${name}! 💚 Remember, every smart financial decision you make today is building a better tomorrow. Is there anything else you'd like to know?`;
  }

  // ── DEFAULT ──
  return `That's a great question${name}! I'm still learning to answer everything — but I can help with topics like:\n\n• Savings & investment advice\n• Understanding your tax\n• TFSA explained\n• Credit scores & bonds\n• Your financial health score\n• Which strategy track suits you\n\nTry one of the suggested questions below, or rephrase your question! 😊`;
}

// ─────────────────────────────────────────────
// MAIN CHATBOT PAGE
// ─────────────────────────────────────────────
export default function ChatBot() {
  const { userData, formatCurrency } = useUser();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hey ${userData.firstName || 'there'}! 👋 I'm your ABSA NextGen financial assistant. Ask me anything about your finances, savings, tax, or investments — I'm here to help!\n\nTry one of the suggested questions below to get started.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay then respond
    setTimeout(() => {
      const response = generateResponse(userText, userData, formatCurrency);
      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-page">

      {/* ── HEADER ── */}
      <div className="chatbot-header">
        <div className="chatbot-avatar">💬</div>
        <div>
          <h2 className="chatbot-title">Financial Assistant</h2>
          <p className="chatbot-status">● Online · Powered by ABSA NextGen</p>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrapper ${msg.role}`}>
            {msg.role === 'bot' && (
              <div className="bot-avatar">🤖</div>
            )}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble-wrapper bot">
            <div className="bot-avatar">🤖</div>
            <div className="chat-bubble bot typing-bubble">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── SUGGESTED QUESTIONS ── */}
      <div className="chatbot-suggestions">
        {SUGGESTED.map((q, i) => (
          <button
            key={i}
            className="suggestion-btn"
            onClick={() => sendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── INPUT BAR ── */}
      <div className="chatbot-input-bar">
        <input
          className="chatbot-input"
          type="text"
          placeholder="Ask me anything about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="chatbot-send-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim()}
        >
          ➤
        </button>
      </div>

    </div>
  );
}