import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';


const PIE_COLORS = [
  '#b00000', // orange - rent
  '#0046e8', // blue - car
  '#008a17', // green - savings
  '#fad000', // yellow - lifestyle
  '#ac00ca', // purple - debt
  '#ff6a00', // teal - investments
  '#ff349a', // pink - other
];

function Dashboard() {
  const { userData, formatCurrency } = useUser();
  const navigate = useNavigate();

  const {
    firstName,
    netMonthly,
    grossMonthly,
    monthlyTax,
    uifMonthly,
    effectiveTaxRate,
    totalFixedExpenses,
    totalFlexibleExpenses,
    totalDebt,
    monthlySavings,
    monthlyInvestments,
    healthStatus,
    healthLabel,
    healthScore,
    savingsRate,
    expenseRatio,
    rent,
    carPayment,
    groceries,
    dining,
    subscriptions,
    travel,
    otherFlexible,
    otherFixed,
  } = userData;

 
  const pieData = [
    { name: 'Rent / Bond', value: Number(rent) || 0 },
    { name: 'Car Payment', value: Number(carPayment) || 0 },
    { name: 'Savings', value: Number(monthlySavings) || 0 },
    { name: 'Lifestyle', value: (Number(groceries) + Number(dining) + Number(subscriptions) + Number(travel) + Number(otherFlexible)) || 0 },
    { name: 'Debt', value: Number(totalDebt) || 0 },
    { name: 'Investments', value: Number(monthlyInvestments) || 0 },
    { name: 'Other', value: Number(otherFixed) || 0 },
  ].filter(item => item.value > 0);

  // -----------------------------------------------
  // Spending percentage of net income
  // -----------------------------------------------
  const totalSpending = totalFixedExpenses + totalFlexibleExpenses;
  const spendingPercent = netMonthly > 0
    ? Math.round((totalSpending / netMonthly) * 100)
    : 0;

  // -----------------------------------------------
  // Leftover money after all expenses
  // -----------------------------------------------
  const leftover = netMonthly - totalSpending - monthlySavings - monthlyInvestments - totalDebt;

  // -----------------------------------------------
  // Health status colour mapping
  // -----------------------------------------------
  const healthColour = {
    green: '#2ecc58',
    yellow: '#F4D03F',
    red: '#d61a05',
  }[healthStatus] || '#d34434';

  // -----------------------------------------------
  // Custom tooltip for the pie chart
  // -----------------------------------------------
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pie-tooltip">
          <p className="pie-tooltip-label">{payload[0].name}</p>
          <p className="pie-tooltip-value">{formatCurrency(payload[0].value)}</p>
          <p className="pie-tooltip-percent">
            {netMonthly > 0 ? Math.round((payload[0].value / netMonthly) * 100) : 0}% of income
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-wrapper">

      {/* ---- PAGE HEADER ---- */}
      <div className="dashboard-header">
        <div>
          <h1>
            Good day, <span className="text-orange">{firstName || 'there'}</span> 👋
          </h1>
          <p>Here is your financial snapshot for this month.</p>
        </div>
        <div className="dashboard-header-tag">
          Money Snapshot
        </div>
      </div>

      {/* ---- TOP ROW: Key financial cards ---- */}
      <div className="dashboard-top-row">

        {/* Net Income Card */}
        <div className="dashboard-card income-card">
          <div className="card-label">Monthly Take-Home Salary</div>
          <div className="card-subtitle">This is how much you have after tax deductions</div>
          <div className="income-amount">{formatCurrency(netMonthly)}</div>
          <div className="income-breakdown">
            <div className="income-breakdown-item">
              <span>Gross Income</span>
              <span>{formatCurrency(grossMonthly)}</span>
            </div>
            <div className="income-breakdown-item deduction">
              <span>Tax (PAYE)</span>
              <span>- {formatCurrency(monthlyTax)}</span>
            </div>
            <div className="income-breakdown-item deduction">
              <span>UIF</span>
              <span>- {formatCurrency(uifMonthly)}</span>
            </div>
            <div className="income-breakdown-divider" />
            <div className="income-breakdown-item highlight">
              <span>Effective Tax Rate</span>
              <span>{effectiveTaxRate}%</span>
            </div>
          </div>
        </div>

        {/* Financial Health Card */}
        <div className="dashboard-card health-card">
          <div className="card-label">Financial Health Status</div>
          <div
            className="health-label"
            style={{ color: healthColour }}
          >
            {healthLabel || 'No Data'}
          </div>

          {/* Health score bar */}
          <div className="health-bar-wrapper">
            <div className="health-bar-track">
              <div
                className="health-bar-fill"
                style={{
                  width: `${healthScore}%`,
                  background: healthColour,
                }}
              />
            </div>
            <span className="health-score-text">{healthScore}/100</span>
          </div>

          {/* Health breakdown stats */}
          <div className="health-stats">
            <div className="health-stat">
              <span className="health-stat-label">Savings Rate</span>
              <span
                className="health-stat-value"
                style={{ color: (savingsRate || 0) >= 20 ? '#2ECC71' : (savingsRate || 0) >= 10 ? '#F4D03F' : '#E74C3C' }}
              >
                {savingsRate || 0}%
              </span>
            </div>
            <div className="health-stat">
              <span className="health-stat-label">Expense Ratio</span>
              <span
                className="health-stat-value"
                style={{ color: (expenseRatio || 0) <= 70 ? '#2ECC71' : (expenseRatio || 0) <= 80 ? '#F4D03F' : '#E74C3C' }}
              >
                {expenseRatio || 0}%
              </span>
            </div>
            <div className="health-stat">
              <span className="health-stat-label">Health Score</span>
              <span
                className="health-stat-value"
                style={{ color: healthColour }}
              >
                {healthScore}/100
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ---- MIDDLE ROW: Pie chart + Insight cards ---- */}
      <div className="dashboard-middle-row">

        {/* Pie Chart Card */}
        <div className="dashboard-card chart-card">
          <div className="card-label">Where Your Money Goes</div>
          <div className="chart-spending-note">
            You are spending{' '}
            <span className="text-orange">{spendingPercent}% of your income</span>
          </div>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: '#A0A0C0', fontSize: '0.78rem' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              No expense data to display yet
            </div>
          )}
        </div>

        {/* Insight Cards (right side) */}
        <div className="dashboard-insights">
          <div className="card-label" style={{ marginBottom: '16px' }}>
            Your Financial Insights
          </div>

          {/* Spending insight */}
          <div className={`insight-card ${spendingPercent > 80 ? 'insight-red' : spendingPercent > 60 ? 'insight-yellow' : 'insight-green'}`}>
            <div className="insight-icon">💸</div>
            <div className="insight-content">
              <div className="insight-title">Spending</div>
              <div className="insight-message">
                You are spending <strong>{spendingPercent}%</strong> of your income
              </div>
            </div>
          </div>

          {/* Savings insight */}
          <div className={`insight-card ${(savingsRate || 0) >= 20 ? 'insight-green' : (savingsRate || 0) >= 10 ? 'insight-yellow' : 'insight-red'}`}>
            <div className="insight-icon">💰</div>
            <div className="insight-content">
              <div className="insight-title">Savings Rate</div>
              <div className="insight-message">
                Your savings rate is currently at <strong>{savingsRate || 0}%</strong>
                {(savingsRate || 0) < 20 ? ' (below recommended level)' : ' (great work!)'}
              </div>
            </div>
          </div>

          {/* Leftover insight */}
          <div className={`insight-card ${leftover > 0 ? 'insight-green' : 'insight-red'}`}>
            <div className="insight-icon">🏦</div>
            <div className="insight-content">
              <div className="insight-title">Monthly Leftover</div>
              <div className="insight-message">
                You have <strong>{formatCurrency(leftover > 0 ? leftover : 0)}</strong> unallocated this month
              </div>
            </div>
          </div>

          {/* Debt insight */}
          <div className={`insight-card ${totalDebt === 0 ? 'insight-green' : totalDebt < netMonthly * 0.3 ? 'insight-yellow' : 'insight-red'}`}>
            <div className="insight-icon">📋</div>
            <div className="insight-content">
              <div className="insight-title">Debt Obligations</div>
              <div className="insight-message">
                Monthly debt payments: <strong>{formatCurrency(totalDebt)}</strong>
              </div>
            </div>
          </div>

          {/* CTA to Strategy Tracks */}
          <button
            className="dashboard-cta-btn"
            onClick={() => navigate('/strategy-tracks')}
          >
            View My 5-Year Plan →
          </button>
        </div>

      </div>

      {/* ---- BOTTOM ROW: Summary stats ---- */}
      <div className="dashboard-bottom-row">
        <div className="summary-stat-card">
          <div className="summary-stat-icon">🏠</div>
          <div className="summary-stat-label">Fixed Expenses</div>
          <div className="summary-stat-value">{formatCurrency(totalFixedExpenses)}</div>
          <div className="summary-stat-sub">per month</div>
        </div>

        <div className="summary-stat-card">
          <div className="summary-stat-icon">🛍️</div>
          <div className="summary-stat-label">Lifestyle Expenses</div>
          <div className="summary-stat-value">{formatCurrency(totalFlexibleExpenses)}</div>
          <div className="summary-stat-sub">per month</div>
        </div>

        <div className="summary-stat-card">
          <div className="summary-stat-icon">💎</div>
          <div className="summary-stat-label">Savings</div>
          <div className="summary-stat-value">{formatCurrency(monthlySavings)}</div>
          <div className="summary-stat-sub">per month</div>
        </div>

        <div className="summary-stat-card">
          <div className="summary-stat-icon">📈</div>
          <div className="summary-stat-label">Investments</div>
          <div className="summary-stat-value">{formatCurrency(monthlyInvestments)}</div>
          <div className="summary-stat-sub">per month</div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
