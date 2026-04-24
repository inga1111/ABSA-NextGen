import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Landing.css';

function Landing({ initialMode = 'signup' }) {
  const { hasOnboarded } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'signup') {
      navigate('/onboarding');
      return;
    }

    if (hasOnboarded) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-hero-brand">absa</div>
          <h1>NextGen | Wealth Studio</h1>
          <p>Know your money. Plan your future.</p>
        </div>
      </div>

      <div className="landing-panel">
        <div className="auth-card">
          <div className="auth-top">
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
            </div>

            <div className="auth-header">
              <h2>{mode === 'signup' ? 'Sign Up Account' : 'Welcome Back'}</h2>
              <p>
                {mode === 'signup'
                  ? 'Enter your personal data to create your account.'
                  : 'Log in to continue to your wealth dashboard.'}
              </p>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-social">
              <button type="button" className="auth-social-btn google">
                <span>Google</span>
              </button>
              <button type="button" className="auth-social-btn github">
                <span>Github</span>
              </button>
            </div>
          )}

          <div className="auth-divider"><span>Or</span></div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field-row">
                <label>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="eg. John"
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="eg. Francisco"
                  />
                </label>
              </div>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="eg. johnfrans@gmail.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </label>

            <p className="auth-note">Must be at least 8 characters.</p>

            <button type="submit" className="auth-submit-btn">
              {mode === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')}>
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{' '}
                <button type="button" onClick={() => setMode('signup')}>
                  Create one
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
