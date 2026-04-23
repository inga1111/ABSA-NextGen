
import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Studios.css';

// Identity labels based on car % of income
function getIdentity(carPercent, investPercent) {
  if (carPercent > 40) return { label: 'The Big Spender', emoji: '💸', colour: '#E74C3C', desc: 'You are prioritising lifestyle now over long-term wealth.' };
  if (carPercent > 25) return { label: 'The Lifestyle Lover', emoji: '🌟', colour: '#F4D03F', desc: 'You enjoy the finer things but your future self may feel the pinch.' };
  if (investPercent > 20) return { label: 'The Future Millionaire', emoji: '🚀', colour: '#2ECC71', desc: 'You are making smart choices that will compound over time.' };
  return { label: 'The Balanced Builder', emoji: '⚖️', colour: '#00C9B1', desc: 'You are finding a healthy middle ground between lifestyle and wealth.' };
}

function LifestyleStudio() {
  const { userData, formatCurrency } = useUser();
  const navigate = useNavigate();

  const [carPrice, setCarPrice] = useState(300000);
  const [investAmount, setInvestAmount] = useState(userData.monthlyInvestments || 2000);
  const [hasSimulated, setHasSimulated] = useState(false);

  const netMonthly = userData.netMonthly || 39000;

  // Monthly car repayment estimate (60 month loan at ~13% interest)
  const monthlyCarRepayment = useMemo(() => {
    const rate = 0.13 / 12;
    const n = 60;
    return Math.round((carPrice * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
  }, [carPrice]);

  // What that investment would be worth in 5 years at 10% annual return
  const investmentFutureValue = useMemo(() => {
    const monthlyRate = 0.10 / 12;
    const n = 60;
    return Math.round(investAmount * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate));
  }, [investAmount]);

  // What the car repayment invested instead would be worth
  const carInvestedFutureValue = useMemo(() => {
    const monthlyRate = 0.10 / 12;
    const n = 60;
    return Math.round(monthlyCarRepayment * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate));
  }, [monthlyCarRepayment]);

  const carPercent = Math.round((monthlyCarRepayment / netMonthly) * 100);
  const investPercent = Math.round((investAmount / netMonthly) * 100);
  const identity = getIdentity(carPercent, investPercent);

  return (
    <div className="studio-wrapper">

      {/* Back button */}
      <button className="studio-back-btn" onClick={() => navigate('/simulation-lab')}>
        ← Back to Studios
      </button>

      {/* Header */}
      <div className="studio-header">
        <div className="studio-header-icon">🚗</div>
        <div>
          <h1>Lifestyle <span className="text-orange">Studio</span></h1>
          <p>Compare the real cost of a car purchase vs investing that money. See how your choices shape your future.</p>
        </div>
      </div>

      <div className="studio-content">

        {/* ---- LEFT: Controls ---- */}
        <div className="studio-controls">

          <div className="studio-card-block">
            <div className="studio-block-title">Your Monthly Income</div>
            <div className="studio-income-display">{formatCurrency(netMonthly)}</div>
            <div className="studio-income-sub">take-home per month</div>
          </div>

          {/* Car slider */}
          <div className="studio-card-block">
            <div className="studio-block-title">Car Budget</div>
            <div className="studio-slider-value">{formatCurrency(carPrice)}</div>
            <input
              type="range"
              min={100000}
              max={1500000}
              step={10000}
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="studio-slider"
            />
            <div className="studio-slider-labels">
              <span>R100k</span>
              <span>R1.5M</span>
            </div>
            <div className="studio-repayment-note">
              Estimated monthly repayment: <strong style={{ color: '#E74C3C' }}>{formatCurrency(monthlyCarRepayment)}</strong>
              <span className="studio-repayment-sub"> (60 months at 13% interest)</span>
            </div>
            <div className="studio-percent-bar-label">
              That is <strong style={{ color: carPercent > 30 ? '#E74C3C' : '#F4D03F' }}>{carPercent}%</strong> of your income
            </div>
            <div className="studio-percent-bar-track">
              <div
                className="studio-percent-bar-fill"
                style={{
                  width: `${Math.min(carPercent, 100)}%`,
                  background: carPercent > 30 ? '#E74C3C' : '#F4D03F'
                }}
              />
            </div>
          </div>

          {/* Investment amount */}
          <div className="studio-card-block">
            <div className="studio-block-title">Monthly Investment Amount</div>
            <div className="studio-slider-value">{formatCurrency(investAmount)}</div>
            <input
              type="range"
              min={500}
              max={20000}
              step={500}
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              className="studio-slider teal"
            />
            <div className="studio-slider-labels">
              <span>R500</span>
              <span>R20 000</span>
            </div>
          </div>

          <button
            className="studio-simulate-btn"
            onClick={() => setHasSimulated(true)}
          >
            Simulate My Future →
          </button>
        </div>

        {/* ---- RIGHT: Results ---- */}
        <div className="studio-results">

          {!hasSimulated ? (
            <div className="studio-results-placeholder">
              <div className="studio-placeholder-icon">🎯</div>
              <div className="studio-placeholder-text">Adjust the sliders and hit Simulate to see your results</div>
            </div>
          ) : (
            <>
              {/* Identity card */}
              <div className="studio-identity-card" style={{ borderColor: identity.colour }}>
                <div className="studio-identity-emoji">{identity.emoji}</div>
                <div className="studio-identity-label" style={{ color: identity.colour }}>{identity.label}</div>
                <div className="studio-identity-desc">{identity.desc}</div>
              </div>

              {/* Comparison cards */}
              <div className="studio-comparison">
                <div className="studio-compare-card red">
                  <div className="studio-compare-icon">🚗</div>
                  <div className="studio-compare-title">If You Buy The Car</div>
                  <div className="studio-compare-value">{formatCurrency(monthlyCarRepayment)}<span>/month</span></div>
                  <div className="studio-compare-sub">Total cost over 5 years: {formatCurrency(monthlyCarRepayment * 60)}</div>
                  <div className="studio-compare-opportunity">
                    If invested instead, that could grow to: <strong>{formatCurrency(carInvestedFutureValue)}</strong>
                  </div>
                </div>

                <div className="studio-compare-card green">
                  <div className="studio-compare-icon">📈</div>
                  <div className="studio-compare-title">If You Invest Instead</div>
                  <div className="studio-compare-value">{formatCurrency(investAmount)}<span>/month</span></div>
                  <div className="studio-compare-sub">Over 5 years at 10% return:</div>
                  <div className="studio-compare-future">{formatCurrency(investmentFutureValue)}</div>
                </div>
              </div>

              {/* Narrative */}
              <div className="studio-narrative">
                <div className="studio-narrative-title">Your Story</div>
                <div className="studio-narrative-text">
                  {carPercent > 30
                    ? `You chose a car worth ${formatCurrency(carPrice)}. The monthly repayment of ${formatCurrency(monthlyCarRepayment)} takes up ${carPercent}% of your income. This decision may delay your wealth growth by 3-5 years. Consider a more affordable option to free up capital for investments.`
                    : `You chose a manageable car at ${formatCurrency(carPrice)}. With ${carPercent}% of income going to repayments, you still have room to invest. If you put ${formatCurrency(investAmount)} away monthly, you could have ${formatCurrency(investmentFutureValue)} in 5 years.`
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LifestyleStudio;
