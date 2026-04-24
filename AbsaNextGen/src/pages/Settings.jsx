import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/Settings.css';

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="settings-toggle-row">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        {description && <span className="toggle-desc">{description}</span>}
      </div>
      <button
        className={`toggle-switch ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
        aria-label={label}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}


function SettingsSection({ title, icon, children }) {
  return (
    <div className="settings-section">
      <h3 className="settings-section-title">{icon} {title}</h3>
      <div className="settings-section-body">{children}</div>
    </div>
  );
}


export default function Settings() {
  const { userData, setSelectedTrack, selectedTrack } = useUser();

  // Notification preferences
  const [notifications, setNotifications] = useState({
    overspendingAlerts: true,
    savingsNudges: true,
    monthlyWrapped: true,
    weeklyDigest: false,
    milestoneAlerts: true,
  });

  // Display preferences
  const [display, setDisplay] = useState({
    darkMode: true,
    showHealthScore: true,
    showSavingsRate: true,
    compactView: false,
  });

  // Privacy preferences
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotif = (key) => (val) =>
    setNotifications((prev) => ({ ...prev, [key]: val }));

  const toggleDisplay = (key) => (val) =>
    setDisplay((prev) => ({ ...prev, [key]: val }));

  const togglePrivacy = (key) => (val) =>
    setPrivacy((prev) => ({ ...prev, [key]: val }));

  const tracks = [
    { id: 'property', label: '🏠 Property Track', desc: 'Save for a home deposit in 3–5 years' },
    { id: 'balanced', label: '⚖️ Balanced Track', desc: 'Build wealth while enjoying life' },
    { id: 'growth', label: '💹 Growth Track', desc: 'Maximise investments aggressively' },
  ];

  return (
    <div className="settings-page">

      {/* ── HEADER ── */}
      <div className="settings-header">
        <h1 className="settings-title">⚙️ Settings</h1>
        <p className="settings-subtitle">
          Manage your preferences and personalise your experience.
        </p>
      </div>

      {/* ── SAVE TOAST ── */}
      {saved && (
        <div className="settings-toast">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* ── ACCOUNT SUMMARY ── */}
      <div className="settings-account-card">
        <div className="account-avatar">
          {userData.firstName ? userData.firstName[0].toUpperCase() : '?'}
        </div>
        <div className="account-info">
          <p className="account-name">
            {userData.firstName || 'Your'} {userData.lastName || 'Account'}
          </p>
          <p className="account-detail">{userData.occupation || 'NextGen Member'} · Age {userData.age || '—'}</p>
        </div>
        <span className="account-badge">Active</span>
      </div>

      {/* ── STRATEGY TRACK SELECTOR ── */}
      <SettingsSection title="Strategy Track" icon="🎯">
        <p className="settings-track-hint">
          Your selected track shapes your milestones, nudges and recommendations.
        </p>
        <div className="track-options">
          {tracks.map((track) => (
            <button
              key={track.id}
              className={`track-option ${selectedTrack === track.id ? 'active' : ''}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <span className="track-option-label">{track.label}</span>
              <span className="track-option-desc">{track.desc}</span>
              {selectedTrack === track.id && (
                <span className="track-checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* ── NOTIFICATIONS ── */}
      <SettingsSection title="Notifications" icon="🔔">
        <Toggle
          label="Overspending Alerts"
          description="Get nudged when spending exceeds your targets"
          value={notifications.overspendingAlerts}
          onChange={toggleNotif('overspendingAlerts')}
        />
        <Toggle
          label="Savings Nudges"
          description="Reminders to stay on track with your savings goals"
          value={notifications.savingsNudges}
          onChange={toggleNotif('savingsNudges')}
        />
        <Toggle
          label="Monthly Banking Wrapped"
          description="Receive your monthly financial recap"
          value={notifications.monthlyWrapped}
          onChange={toggleNotif('monthlyWrapped')}
        />
        <Toggle
          label="Weekly Digest"
          description="A summary of your week's financial activity"
          value={notifications.weeklyDigest}
          onChange={toggleNotif('weeklyDigest')}
        />
        <Toggle
          label="Milestone Alerts"
          description="Celebrate when you hit savings or investment milestones"
          value={notifications.milestoneAlerts}
          onChange={toggleNotif('milestoneAlerts')}
        />
      </SettingsSection>

      {/* ── DISPLAY ── */}
      <SettingsSection title="Display" icon="🎨">
        <Toggle
          label="Dark Mode"
          description="Keep the dark aesthetic across all pages"
          value={display.darkMode}
          onChange={toggleDisplay('darkMode')}
        />
        <Toggle
          label="Show Health Score"
          description="Display your financial health score on the dashboard"
          value={display.showHealthScore}
          onChange={toggleDisplay('showHealthScore')}
        />
        <Toggle
          label="Show Savings Rate"
          description="Show your savings rate percentage prominently"
          value={display.showSavingsRate}
          onChange={toggleDisplay('showSavingsRate')}
        />
        <Toggle
          label="Compact View"
          description="Reduce card sizes for a more condensed layout"
          value={display.compactView}
          onChange={toggleDisplay('compactView')}
        />
      </SettingsSection>

      {/* ── PRIVACY ── */}
      <SettingsSection title="Privacy" icon="🔒">
        <Toggle
          label="Share Anonymous Data"
          description="Help improve ABSA NextGen with anonymised usage data"
          value={privacy.shareData}
          onChange={togglePrivacy('shareData')}
        />
        <Toggle
          label="Analytics"
          description="Allow in-app behaviour analytics to personalise your experience"
          value={privacy.analytics}
          onChange={togglePrivacy('analytics')}
        />
      </SettingsSection>

      {/* ── ABOUT ── */}
      <SettingsSection title="About" icon="ℹ️">
        <div className="about-row">
          <span className="about-label">App</span>
          <span className="about-value">ABSA NextGen Wealth Studio</span>
        </div>
        <div className="about-row">
          <span className="about-label">Version</span>
          <span className="about-value">1.0.0 · First Five Years</span>
        </div>
        <div className="about-row">
          <span className="about-label">Designed by</span>
          <span className="about-value">{userData.firstName || 'Inga'} · 2582423</span>
        </div>
        <div className="about-row">
          <span className="about-label">Built for</span>
          <span className="about-value">ABSA · South African Young Professionals</span>
        </div>
      </SettingsSection>

      {/* ── SAVE BUTTON ── */}
      <div className="settings-save-row">
        <button className="settings-save-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>

    </div>
  );
}