import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/Onboarding.css';


const STEPS = [
  'Personal Info',a
  'Income & Expenses',
  'Lifestyle & Debt',
  'Savings & Goals',
];

function Onboarding() {
  const { completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState(0);

  // All form data lives here in one object
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    age: '',
    occupation: '',

    // Step 2
    grossMonthly: '',
    rent: '',
    carPayment: '',
    insurance: '',
    medicalAid: '',
    otherFixed: '',

    // Step 3
    groceries: '',
    dining: '',
    subscriptions: '',
    travel: '',
    otherFlexible: '',
    studentLoan: '',
    creditCard: '',
    otherDebt: '',

    // Step 4
    monthlySavings: '',
    monthlyInvestments: '',
    primaryGoal: '',
  });

  // Generic change handler — updates whichever field changed
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Called when the user submits the final step
  const handleSubmit = () => {
    completeOnboarding(formData);
  };

  // Progress percentage for the progress bar
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="onboarding-wrapper">
      {/* Left panel — branding */}
      <div className="onboarding-left">
        <div className="onboarding-brand">
          <div className="onboarding-logo">absa</div>
          <h1>NextGen<br />Wealth Studio</h1>
          <p>Your first five years of financial independence, guided by ABSA.</p>
        </div>

        <div className="onboarding-quote">
          <span className="quote-mark">"</span>
          <p>Money without financial intelligence is money soon gone.</p>
          <span className="quote-author">— Robert T. Kiyosaki</span>
        </div>

        <div className="onboarding-tagline">
          Earn. Save. Invest. <strong>Repeat.</strong>
        </div>
      </div>

      {/* Right panel — the form */}
      <div className="onboarding-right">
        {/* Progress bar */}
        <div className="onboarding-progress">
          <div className="progress-labels">
            {STEPS.map((step, index) => (
              <span
                key={step}
                className={`progress-label ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'done' : ''}`}
              >
                {step}
              </span>
            ))}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="progress-text">Step {currentStep + 1} of {STEPS.length}</p>
        </div>

        {/* Step content */}
        <div className="onboarding-form">

          {/* ---- STEP 1: Personal Info ---- */}
          {currentStep === 0 && (
            <div className="form-step">
              <h2>Let's get to know you</h2>
              <p>This helps us personalise your experience.</p>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Milani"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Khumalo"
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 26"
                    min="18"
                    max="65"
                  />
                </div>

                <div className="form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g. Software Developer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 2: Income & Fixed Expenses ---- */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Income & Fixed Expenses</h2>
              <p>We'll calculate your take-home pay using South African PAYE tax brackets.</p>

              <div className="form-section-label">💰 Monthly Income</div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Gross Monthly Salary (before tax)</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="grossMonthly"
                      value={formData.grossMonthly}
                      onChange={handleChange}
                      placeholder="e.g. 55000"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-label">🏠 Fixed Monthly Expenses</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Rent / Bond Repayment</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      placeholder="e.g. 12000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Car Payment</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="carPayment"
                      value={formData.carPayment}
                      onChange={handleChange}
                      placeholder="e.g. 8500"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Insurance</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleChange}
                      placeholder="e.g. 1500"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Medical Aid</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="medicalAid"
                      value={formData.medicalAid}
                      onChange={handleChange}
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Other Fixed Expenses</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="otherFixed"
                      value={formData.otherFixed}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 3: Lifestyle & Debt ---- */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Lifestyle & Debt</h2>
              <p>Be honest — this helps us give you accurate insights.</p>

              <div className="form-section-label">🛍️ Monthly Lifestyle Expenses</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Groceries</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="groceries"
                      value={formData.groceries}
                      onChange={handleChange}
                      placeholder="e.g. 3000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dining & Takeaways</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="dining"
                      value={formData.dining}
                      onChange={handleChange}
                      placeholder="e.g. 2500"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subscriptions</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="subscriptions"
                      value={formData.subscriptions}
                      onChange={handleChange}
                      placeholder="e.g. 800"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Travel & Entertainment</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="travel"
                      value={formData.travel}
                      onChange={handleChange}
                      placeholder="e.g. 1500"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Other Lifestyle</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="otherFlexible"
                      value={formData.otherFlexible}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-label">💳 Monthly Debt Payments</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student Loan</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="studentLoan"
                      value={formData.studentLoan}
                      onChange={handleChange}
                      placeholder="e.g. 3000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Credit Card</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="creditCard"
                      value={formData.creditCard}
                      onChange={handleChange}
                      placeholder="e.g. 1000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Other Debt</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="otherDebt"
                      value={formData.otherDebt}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 4: Savings & Goals ---- */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Savings & Your Goal</h2>
              <p>Choose the financial path that best matches where you want to be in 5 years.</p>

              <div className="form-section-label">💎 Monthly Savings & Investments</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Monthly Savings</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="monthlySavings"
                      value={formData.monthlySavings}
                      onChange={handleChange}
                      placeholder="e.g. 3000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Monthly Investments</label>
                  <div className="input-prefix-wrapper">
                    <span className="input-prefix">R</span>
                    <input
                      type="number"
                      name="monthlyInvestments"
                      value={formData.monthlyInvestments}
                      onChange={handleChange}
                      placeholder="e.g. 1000"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-label">🎯 Your Primary Financial Goal</div>
              <div className="goal-cards">
                {/* Property Track */}
                <div
                  className={`goal-card ${formData.primaryGoal === 'property' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, primaryGoal: 'property' })}
                >
                  <div className="goal-icon">🏠</div>
                  <div className="goal-title">Buy Property</div>
                  <div className="goal-desc">I want to own a home within 3–5 years</div>
                </div>

                {/* Balanced Track */}
                <div
                  className={`goal-card ${formData.primaryGoal === 'balanced' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, primaryGoal: 'balanced' })}
                >
                  <div className="goal-icon">⚖️</div>
                  <div className="goal-title">Balanced Lifestyle</div>
                  <div className="goal-desc">I want to build wealth without sacrificing my lifestyle</div>
                </div>

                {/* Growth Track */}
                <div
                  className={`goal-card ${formData.primaryGoal === 'growth' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, primaryGoal: 'growth' })}
                >
                  <div className="goal-icon">📈</div>
                  <div className="goal-title">Aggressive Growth</div>
                  <div className="goal-desc">I want to maximise investments and build long-term wealth</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="form-nav">
            {currentStep > 0 && (
              <button className="btn-back" onClick={handleBack}>
                ← Back
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button className="btn-next" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={!formData.primaryGoal}
              >
                Let's Go 🚀
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Onboarding;
