import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/Profile.css';


function StatCard({ label, value, colour }) {
  return (
    <div className={`profile-stat-card ${colour}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}


function EditField({ label, name, value, onChange, type = 'text', prefix }) {
  return (
    <div className="edit-field">
      <label className="edit-label">{label}</label>
      <div className="edit-input-wrapper">
        {prefix && <span className="edit-prefix">{prefix}</span>}
        <input
          className={`edit-input ${prefix ? 'with-prefix' : ''}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}


export default function Profile() {
  const { userData, updateUserData, formatCurrency } = useUser();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  
  const [form, setForm] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUserData(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ ...userData });
    setEditing(false);
  };

  
  const healthColour =
    userData.healthStatus === 'green' ? 'green' :
    userData.healthStatus === 'yellow' ? 'yellow' : 'red';

  return (
    <div className="profile-page">

      {/* ── HEADER ── */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.firstName ? userData.firstName[0].toUpperCase() : '?'}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">
            {userData.firstName || 'Your'} {userData.lastName || 'Profile'}
          </h1>
          <p className="profile-occupation">{userData.occupation || 'NextGen Wealth Member'}</p>
          <span className={`profile-health-badge ${healthColour}`}>
            {userData.healthLabel || 'No Data'}
          </span>
        </div>
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* ── SAVE CONFIRMATION ── */}
      {saved && (
        <div className="save-toast">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* ── FINANCIAL OVERVIEW CARDS ── */}
      <div className="profile-stats-grid">
        <StatCard
          label="Gross Income"
          value={formatCurrency(userData.grossMonthly)}
          colour="blue"
        />
        <StatCard
          label="Take-Home"
          value={formatCurrency(userData.netMonthly)}
          colour="green"
        />
        <StatCard
          label="Monthly Tax"
          value={formatCurrency(userData.monthlyTax)}
          colour="red"
        />
        <StatCard
          label="Savings Rate"
          value={`${userData.savingsRate || 0}%`}
          colour={userData.savingsRate >= 20 ? 'green' : userData.savingsRate >= 10 ? 'yellow' : 'red'}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency((userData.totalFixedExpenses || 0) + (userData.totalFlexibleExpenses || 0))}
          colour="yellow"
        />
        <StatCard
          label="Health Score"
          value={`${userData.healthScore || 0}/100`}
          colour={healthColour}
        />
      </div>

      {/* ── VIEW MODE ── */}
      {!editing && (
        <div className="profile-sections">

          {/* Personal Info */}
          <div className="profile-section">
            <h3 className="section-title">👤 Personal Info</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">First Name</span>
                <span className="info-value">{userData.firstName || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last Name</span>
                <span className="info-value">{userData.lastName || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age</span>
                <span className="info-value">{userData.age || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Occupation</span>
                <span className="info-value">{userData.occupation || '—'}</span>
              </div>
            </div>
          </div>

          {/* Fixed Expenses */}
          <div className="profile-section">
            <h3 className="section-title">🏠 Fixed Expenses</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Rent</span>
                <span className="info-value">{formatCurrency(userData.rent)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Car Payment</span>
                <span className="info-value">{formatCurrency(userData.carPayment)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Insurance</span>
                <span className="info-value">{formatCurrency(userData.insurance)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Medical Aid</span>
                <span className="info-value">{formatCurrency(userData.medicalAid)}</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Expenses */}
          <div className="profile-section">
            <h3 className="section-title">🌴 Lifestyle Expenses</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Groceries</span>
                <span className="info-value">{formatCurrency(userData.groceries)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Dining</span>
                <span className="info-value">{formatCurrency(userData.dining)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Subscriptions</span>
                <span className="info-value">{formatCurrency(userData.subscriptions)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Travel</span>
                <span className="info-value">{formatCurrency(userData.travel)}</span>
              </div>
            </div>
          </div>

          {/* Savings & Investments */}
          <div className="profile-section">
            <h3 className="section-title">💹 Savings & Investments</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Monthly Savings</span>
                <span className="info-value">{formatCurrency(userData.monthlySavings)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Monthly Investments</span>
                <span className="info-value">{formatCurrency(userData.monthlyInvestments)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Student Loan</span>
                <span className="info-value">{formatCurrency(userData.studentLoan)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Credit Card Debt</span>
                <span className="info-value">{formatCurrency(userData.creditCard)}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── EDIT MODE ── */}
      {editing && (
        <div className="edit-form">
          <h3 className="section-title">✏️ Edit Your Information</h3>
          <p className="edit-hint">
            Update any field below. Your financial health score and insights will recalculate automatically.
          </p>

          <div className="edit-section">
            <h4 className="edit-section-title">Personal Info</h4>
            <div className="edit-grid">
              <EditField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
              <EditField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              <EditField label="Age" name="age" value={form.age} onChange={handleChange} type="number" />
              <EditField label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />
            </div>
          </div>

          <div className="edit-section">
            <h4 className="edit-section-title">Income</h4>
            <div className="edit-grid">
              <EditField label="Gross Monthly Income" name="grossMonthly" value={form.grossMonthly} onChange={handleChange} type="number" prefix="R" />
            </div>
          </div>

          <div className="edit-section">
            <h4 className="edit-section-title">Fixed Expenses</h4>
            <div className="edit-grid">
              <EditField label="Rent" name="rent" value={form.rent} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Car Payment" name="carPayment" value={form.carPayment} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Insurance" name="insurance" value={form.insurance} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Medical Aid" name="medicalAid" value={form.medicalAid} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Other Fixed" name="otherFixed" value={form.otherFixed} onChange={handleChange} type="number" prefix="R" />
            </div>
          </div>

          <div className="edit-section">
            <h4 className="edit-section-title">Lifestyle Expenses</h4>
            <div className="edit-grid">
              <EditField label="Groceries" name="groceries" value={form.groceries} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Dining" name="dining" value={form.dining} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Subscriptions" name="subscriptions" value={form.subscriptions} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Travel" name="travel" value={form.travel} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Other Lifestyle" name="otherFlexible" value={form.otherFlexible} onChange={handleChange} type="number" prefix="R" />
            </div>
          </div>

          <div className="edit-section">
            <h4 className="edit-section-title">Savings & Investments</h4>
            <div className="edit-grid">
              <EditField label="Monthly Savings" name="monthlySavings" value={form.monthlySavings} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Monthly Investments" name="monthlyInvestments" value={form.monthlyInvestments} onChange={handleChange} type="number" prefix="R" />
            </div>
          </div>

          <div className="edit-section">
            <h4 className="edit-section-title">Debt</h4>
            <div className="edit-grid">
              <EditField label="Student Loan" name="studentLoan" value={form.studentLoan} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Credit Card" name="creditCard" value={form.creditCard} onChange={handleChange} type="number" prefix="R" />
              <EditField label="Other Debt" name="otherDebt" value={form.otherDebt} onChange={handleChange} type="number" prefix="R" />
            </div>
          </div>

          {/* Save / Cancel buttons */}
          <div className="edit-actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      )}

    </div>
  );
}