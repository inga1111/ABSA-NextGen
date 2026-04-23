// ============================================
// ABSA NEXTGEN WEALTH STUDIO — USERCONTEXT.JSX
// File location: src/context/UserContext.jsx
// ============================================

import { createContext, useContext, useState } from 'react';

// -----------------------------------------------
// Create the context
// This is what other files will import to read
// or update the user's financial data
// -----------------------------------------------
const UserContext = createContext(null);

// -----------------------------------------------
// SOUTH AFRICAN TAX LOGIC (2024/2025 tax year)
// Uses SARS progressive tax brackets to estimate
// monthly take-home pay from gross monthly salary
// -----------------------------------------------
export function calculateSATax(grossMonthly) {
  const grossAnnual = grossMonthly * 12;

  // SARS 2024/2025 tax brackets (annual income)
  let annualTax = 0;

  if (grossAnnual <= 237100) {
    annualTax = grossAnnual * 0.18;
  } else if (grossAnnual <= 370500) {
    annualTax = 42678 + (grossAnnual - 237100) * 0.26;
  } else if (grossAnnual <= 512800) {
    annualTax = 77362 + (grossAnnual - 370500) * 0.31;
  } else if (grossAnnual <= 673000) {
    annualTax = 121475 + (grossAnnual - 512800) * 0.36;
  } else if (grossAnnual <= 857900) {
    annualTax = 179147 + (grossAnnual - 673000) * 0.39;
  } else if (grossAnnual <= 1817000) {
    annualTax = 251258 + (grossAnnual - 857900) * 0.41;
  } else {
    annualTax = 644489 + (grossAnnual - 1817000) * 0.45;
  }

  // Primary rebate (everyone gets this, under 65)
  const primaryRebate = 17235;
  annualTax = Math.max(0, annualTax - primaryRebate);

  // UIF contribution: 1% of gross, capped at R177.12/month
  const uifMonthly = Math.min(grossMonthly * 0.01, 177.12);

  // Monthly tax and net income
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - monthlyTax - uifMonthly;

  return {
    grossMonthly,
    netMonthly: Math.round(netMonthly),
    monthlyTax: Math.round(monthlyTax),
    uifMonthly: Math.round(uifMonthly),
    effectiveTaxRate: Math.round((monthlyTax / grossMonthly) * 100),
  };
}

// -----------------------------------------------
// FINANCIAL HEALTH SCORE LOGIC
// Takes the user's financial data and returns
// a score from 0-100 with a colour status
// -----------------------------------------------
export function calculateFinancialHealth(userData) {
  const {
    netMonthly,
    totalFixedExpenses,
    totalFlexibleExpenses,
    totalDebt,
    monthlySavings,
    monthlyInvestments,
  } = userData;

  if (!netMonthly || netMonthly === 0) return { score: 0, status: 'red', label: 'No Data' };

  const totalExpenses = totalFixedExpenses + totalFlexibleExpenses;
  const totalSavingsAndInvestments = monthlySavings + monthlyInvestments;

  // Savings rate: savings + investments as % of net income
  const savingsRate = (totalSavingsAndInvestments / netMonthly) * 100;

  // Expense ratio: total expenses as % of net income
  const expenseRatio = (totalExpenses / netMonthly) * 100;

  // Debt ratio: monthly debt payments as % of net income
  const debtRatio = (totalDebt / netMonthly) * 100;

  // Score calculation (out of 100)
  let score = 100;

  // Penalise for low savings rate (target is 20%+)
  if (savingsRate < 5) score -= 40;
  else if (savingsRate < 10) score -= 25;
  else if (savingsRate < 15) score -= 15;
  else if (savingsRate < 20) score -= 5;

  // Penalise for high expense ratio (target under 70%)
  if (expenseRatio > 90) score -= 30;
  else if (expenseRatio > 80) score -= 20;
  else if (expenseRatio > 70) score -= 10;

  // Penalise for high debt (target under 30%)
  if (debtRatio > 50) score -= 20;
  else if (debtRatio > 40) score -= 12;
  else if (debtRatio > 30) score -= 6;

  score = Math.max(0, Math.min(100, score));

  // Map score to a status colour and label
  let status, label;
  if (score >= 70) {
    status = 'green';
    label = 'Healthy';
  } else if (score >= 40) {
    status = 'yellow';
    label = 'Average - Low';
  } else {
    status = 'red';
    label = 'Needs Attention';
  }

  return {
    score,
    status,
    label,
    savingsRate: Math.round(savingsRate),
    expenseRatio: Math.round(expenseRatio),
    debtRatio: Math.round(debtRatio),
  };
}

// -----------------------------------------------
// FORMAT CURRENCY — helper used across all pages
// e.g. 39000 → "R 39 000"
// -----------------------------------------------
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return 'R 0';
  return `R ${Math.round(amount).toLocaleString('en-ZA')}`;
}

// -----------------------------------------------
// DEFAULT / EMPTY USER DATA SHAPE
// This is what the data looks like before
// the user fills in the onboarding form
// -----------------------------------------------
const defaultUserData = {
  // Personal info
  firstName: '',
  lastName: '',
  age: '',
  occupation: '',

  // Income
  grossMonthly: 0,

  // Calculated by SA tax logic (auto-filled)
  netMonthly: 0,
  monthlyTax: 0,
  uifMonthly: 0,
  effectiveTaxRate: 0,

  // Fixed expenses (rent, car, insurance etc.)
  rent: 0,
  carPayment: 0,
  insurance: 0,
  medicalAid: 0,
  otherFixed: 0,
  totalFixedExpenses: 0,

  // Flexible / lifestyle expenses
  groceries: 0,
  dining: 0,
  subscriptions: 0,
  travel: 0,
  otherFlexible: 0,
  totalFlexibleExpenses: 0,

  // Debt
  studentLoan: 0,
  creditCard: 0,
  otherDebt: 0,
  totalDebt: 0,

  // Savings and investments
  monthlySavings: 0,
  monthlyInvestments: 0,

  // Goals
  primaryGoal: '', // 'property', 'balanced', 'growth'

  // Financial health (calculated)
  healthScore: 0,
  healthStatus: 'red',
  healthLabel: 'No Data',
};

// -----------------------------------------------
// USER PROVIDER
// Wrap this around the whole app in App.jsx
// so every page can read and update user data
// -----------------------------------------------
export function UserProvider({ children }) {
  const [userData, setUserData] = useState(defaultUserData);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null); // 'property', 'balanced', 'growth'

  // -----------------------------------------------
  // Called when the user completes the onboarding form
  // Takes the raw form data, runs the tax calculation,
  // calculates totals and health score, then saves it all
  // -----------------------------------------------
  const completeOnboarding = (formData) => {
    // Step 1: Calculate SA tax from gross income
    const taxResult = calculateSATax(Number(formData.grossMonthly));

    // Step 2: Calculate expense totals
    const totalFixedExpenses =
      Number(formData.rent || 0) +
      Number(formData.carPayment || 0) +
      Number(formData.insurance || 0) +
      Number(formData.medicalAid || 0) +
      Number(formData.otherFixed || 0);

    const totalFlexibleExpenses =
      Number(formData.groceries || 0) +
      Number(formData.dining || 0) +
      Number(formData.subscriptions || 0) +
      Number(formData.travel || 0) +
      Number(formData.otherFlexible || 0);

    const totalDebt =
      Number(formData.studentLoan || 0) +
      Number(formData.creditCard || 0) +
      Number(formData.otherDebt || 0);

    // Step 3: Build the full user data object
    const fullUserData = {
      ...formData,
      ...taxResult,
      totalFixedExpenses,
      totalFlexibleExpenses,
      totalDebt,
      monthlySavings: Number(formData.monthlySavings || 0),
      monthlyInvestments: Number(formData.monthlyInvestments || 0),
    };

    // Step 4: Calculate financial health score
    const health = calculateFinancialHealth(fullUserData);

    // Step 5: Save everything to state
    setUserData({
      ...fullUserData,
      healthScore: health.score,
      healthStatus: health.status,
      healthLabel: health.label,
      savingsRate: health.savingsRate,
      expenseRatio: health.expenseRatio,
      debtRatio: health.debtRatio,
    });

    // Step 6: Mark onboarding as complete
    setHasOnboarded(true);
  };

  // -----------------------------------------------
  // Called when the user updates their data
  // from the Profile page later on
  // -----------------------------------------------
  const updateUserData = (updatedFields) => {
    const merged = { ...userData, ...updatedFields };

    // Recalculate tax if gross income changed
    if (updatedFields.grossMonthly) {
      const taxResult = calculateSATax(Number(updatedFields.grossMonthly));
      Object.assign(merged, taxResult);
    }

    // Recalculate totals
    merged.totalFixedExpenses =
      Number(merged.rent || 0) +
      Number(merged.carPayment || 0) +
      Number(merged.insurance || 0) +
      Number(merged.medicalAid || 0) +
      Number(merged.otherFixed || 0);

    merged.totalFlexibleExpenses =
      Number(merged.groceries || 0) +
      Number(merged.dining || 0) +
      Number(merged.subscriptions || 0) +
      Number(merged.travel || 0) +
      Number(merged.otherFlexible || 0);

    merged.totalDebt =
      Number(merged.studentLoan || 0) +
      Number(merged.creditCard || 0) +
      Number(merged.otherDebt || 0);

    // Recalculate health score
    const health = calculateFinancialHealth(merged);
    merged.healthScore = health.score;
    merged.healthStatus = health.status;
    merged.healthLabel = health.label;
    merged.savingsRate = health.savingsRate;
    merged.expenseRatio = health.expenseRatio;
    merged.debtRatio = health.debtRatio;

    setUserData(merged);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        hasOnboarded,
        selectedTrack,
        setSelectedTrack,
        completeOnboarding,
        updateUserData,
        formatCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// -----------------------------------------------
// Custom hook — import this in any page like:
// const { userData, formatCurrency } = useUser();
// -----------------------------------------------
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside a UserProvider');
  }
  return context;
}

export default UserContext;
