import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/BankingWrapped.css';


function generateWrappedData(userData) {
  const {
    netMonthly,
    dining,
    groceries,
    subscriptions,
    travel,
    otherFlexible,
    totalFlexibleExpenses,
    totalFixedExpenses,
    monthlySavings,
    monthlyInvestments,
    firstName,
    savingsRate,
  } = userData;

  // Figure out top spending category
  const categories = [
    { name: 'Restaurants & Dining', amount: Number(dining || 0) },
    { name: 'Groceries', amount: Number(groceries || 0) },
    { name: 'Subscriptions', amount: Number(subscriptions || 0) },
    { name: 'Travel', amount: Number(travel || 0) },
    { name: 'Other Lifestyle', amount: Number(otherFlexible || 0) },
  ];
  const topCategory = [...categories].sort((a, b) => b.amount - a.amount)[0];

  // Simulate 4 weeks of spending
  const weeklySpend = [
    Math.round(totalFlexibleExpenses * 0.30),
    Math.round(totalFlexibleExpenses * 0.22),
    Math.round(totalFlexibleExpenses * 0.28),
    Math.round(totalFlexibleExpenses * 0.20),
  ];
  const biggestSpendWeek = weeklySpend.indexOf(Math.max(...weeklySpend)) + 1;

  // Simulate 4 weeks of saving
  const weeklySave = [
    Math.round(monthlySavings * 0.40),
    Math.round(monthlySavings * 0.25),
    Math.round(monthlySavings * 0.20),
    Math.round(monthlySavings * 0.15),
  ];
  const bestSaveWeek = weeklySave.indexOf(Math.max(...weeklySave)) + 1;

  // Behaviour classification based on savings rate
  let behaviourLabel, behaviourDesc, behaviourEmoji;
  if (savingsRate >= 25) {
    behaviourLabel = 'The Wealth Builder';
    behaviourDesc = "You're disciplined, focused and playing the long game. Future you says thank you.";
    behaviourEmoji = '💎';
  } else if (savingsRate >= 15) {
    behaviourLabel = 'The Balanced Planner';
    behaviourDesc = "You enjoy life but keep an eye on the future. A solid foundation is forming.";
    behaviourEmoji = '⚖️';
  } else if (savingsRate >= 5) {
    behaviourLabel = 'The Lifestyle Lover';
    behaviourDesc = "You live well — but there's room to grow your savings muscle.";
    behaviourEmoji = '🌴';
  } else {
    behaviourLabel = 'The Big Spender';
    behaviourDesc = "You enjoy the now — but your future self needs a little more love.";
    behaviourEmoji = '💸';
  }

  // Simulated blesser (who sent you the most)
  const blessers = ['Mom', 'Dad', 'The Client', 'Your Side Hustle', 'Grandma'];
  const blesser = blessers[Math.floor(Math.random() * blessers.length)];

  // Simulated top beneficiary (who you sent the most to)
  const beneficiaries = ['Netflix & Co.', 'The Landlord', 'Your Car', 'Woolies', 'The Restaurant Industry'];
  const topBeneficiary = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];

  // Current month name
  const month = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = new Date().getFullYear();

  return {
    firstName,
    month,
    year,
    biggestSpendWeek,
    biggestSpendAmount: weeklySpend[biggestSpendWeek - 1],
    bestSaveWeek,
    bestSaveAmount: weeklySave[bestSaveWeek - 1],
    topCategory,
    blesser,
    topBeneficiary,
    behaviourLabel,
    behaviourDesc,
    behaviourEmoji,
    totalSpent: totalFlexibleExpenses + totalFixedExpenses,
    totalSaved: monthlySavings + monthlyInvestments,
  };
}

// ─────────────────────────────────────────────
// Single reveal card component
// Flips over when clicked to show the stat
// ─────────────────────────────────────────────
function WrappedCard({ number, frontLabel, backContent, delay }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`wrapped-card ${flipped ? 'flipped' : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="card-inner">
        {/* Front of card */}
        <div className="card-front">
          <span className="card-number">{number}</span>
          <span className="card-front-label">{frontLabel}</span>
          <span className="card-tap-hint">tap to reveal</span>
        </div>
        {/* Back of card */}
        <div className="card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN BANKING WRAPPED PAGE
// ─────────────────────────────────────────────
export default function BankingWrapped() {
  const { userData, formatCurrency } = useUser();
  const [data, setData] = useState(null);
  const [showBehaviour, setShowBehaviour] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const generated = generateWrappedData(userData);
    setData(generated);
  }, [userData]);

  // Trigger behaviour card after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowBehaviour(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="wrapped-page">

      {/* ── HEADER ── */}
      <div className="wrapped-header">
        <div className="wrapped-header-glow" />
        <p className="wrapped-eyebrow">ABSA NextGen · Banking Wrapped</p>
        <h1 className="wrapped-title">
          Replay your <span className="wrapped-month">{data.month} '{String(data.year).slice(2)}</span> highlights
        </h1>
        <p className="wrapped-subtitle">
          Here's how <strong>{data.firstName || 'you'}</strong> moved money this month.
        </p>
      </div>

      {/* ── WHAT'S INSIDE TEASER ── */}
      <div className="wrapped-teaser">
        <p>This month's recap includes:</p>
        <ul>
          <li>📅 The week you spent the most</li>
          <li>💰 The week you saved the most</li>
          <li>🙌 Your blesser for the month</li>
          <li>💳 Your top beneficiary</li>
        </ul>
      </div>

      {/* ── REVEAL CARDS ── */}
      <div className="wrapped-cards-grid">
        <WrappedCard
          number="1"
          frontLabel="The week you spent the most"
          delay={0.1}
          backContent={
            <div className="card-back-content">
              <span className="card-back-emoji">📅</span>
              <span className="card-back-week">Week {data.biggestSpendWeek}</span>
              <span className="card-back-amount">{formatCurrency(data.biggestSpendAmount)}</span>
              <span className="card-back-label">spent this week</span>
            </div>
          }
        />

        <WrappedCard
          number="2"
          frontLabel="The week you saved the most"
          delay={0.2}
          backContent={
            <div className="card-back-content">
              <span className="card-back-emoji">💰</span>
              <span className="card-back-week">Week {data.bestSaveWeek}</span>
              <span className="card-back-amount">{formatCurrency(data.bestSaveAmount)}</span>
              <span className="card-back-label">saved this week</span>
            </div>
          }
        />

        <WrappedCard
          number="3"
          frontLabel="Your blesser for the month"
          delay={0.3}
          backContent={
            <div className="card-back-content">
              <span className="card-back-emoji">🙌</span>
              <span className="card-back-week">{data.blesser}</span>
              <span className="card-back-label">sent you the most this month</span>
            </div>
          }
        />

        <WrappedCard
          number="4"
          frontLabel="Your top beneficiary"
          delay={0.4}
          backContent={
            <div className="card-back-content">
              <span className="card-back-emoji">💳</span>
              <span className="card-back-week">{data.topBeneficiary}</span>
              <span className="card-back-label">received the most from you</span>
            </div>
          }
        />
      </div>

      {/* ── TOP SPENDING CATEGORY ── */}
      <div className="wrapped-insight-card">
        <p className="insight-label">You spent most of your income on</p>
        <p className="insight-value">{data.topCategory.name}</p>
        <p className="insight-amount">{formatCurrency(data.topCategory.amount)} this month</p>
      </div>

      {/* ── BEHAVIOUR IDENTITY ── */}
      {showBehaviour && (
        <div className="wrapped-behaviour-card">
          <p className="behaviour-eyebrow">Your financial identity this month</p>
          <div className="behaviour-emoji">{data.behaviourEmoji}</div>
          <h2 className="behaviour-label">{data.behaviourLabel}</h2>
          <p className="behaviour-desc">{data.behaviourDesc}</p>
        </div>
      )}

      {/* ── SUMMARY ROW ── */}
      <div className="wrapped-summary-row">
        <div className="summary-pill spent">
          <span className="summary-pill-label">Total Spent</span>
          <span className="summary-pill-amount">{formatCurrency(data.totalSpent)}</span>
        </div>
        <div className="summary-pill saved">
          <span className="summary-pill-label">Total Saved</span>
          <span className="summary-pill-amount">{formatCurrency(data.totalSaved)}</span>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <p className="wrapped-footer">
        See you next month · ABSA NextGen Wealth Studio 💚
      </p>

    </div>
  );
}