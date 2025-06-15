// App.js
import React, { useState } from 'react';
import './App.css';

const FEATURE_LABELS = {
  status_of_account: "Status of Account",
  duration_in_months: "Duration (Months)",
  credit_history: "Credit History",
  purpose: "Purpose",
  credit_amount: "Credit Amount",
  savings_account_bonds: "Savings Account/Bonds",
  present_employment: "Present Employment",
  installment_rate: "Installment Rate",
  personal_status: "Personal Status",
  other_debtors: "Other Debtors",
  residence_since: "Residence Since",
  property: "Property",
  age: "Age",
  other_installment_plans: "Other Installment Plans",
  housing: "Housing",
  existing_credits: "Existing Credits",
  job: "Job",
  number_dependents: "Number of Dependents",
  own_telephone: "Own Telephone",
  foreign_worker: "Foreign Worker"
};

function App() {
  const [formData, setFormData] = useState(
    Object.keys(FEATURE_LABELS).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  );
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow only integer values
    if (/[^0-9]/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newErrors = {};
    const numericData = {};

    for (const [key, value] of Object.entries(formData)) {
      const num = parseInt(value, 10);

      if (value === "") {
        newErrors[key] = "This field is required.";
      } else if (isNaN(num)) {
        newErrors[key] = "Must be an integer.";
      } else if (num < 0) {
        newErrors[key] = "Must be 0 or greater.";
      } else {
        numericData[key] = num;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBandColor = (riskBand) => {
    switch (riskBand?.toLowerCase()) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const clearForm = () => {
    setFormData(Object.keys(formData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {}));
    setResult(null);
    setError(null);
    setErrors({});
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>AI-Powered Credit Scoring</h1>
          <p>Enter the credit features below to get a risk assessment</p>
        </header>

        <div className="main-content">
          <form onSubmit={handleSubmit} className="credit-form">
            <div className="form-grid">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{label}</label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter integer value"
                    className={errors[key] ? 'input-error' : ''}
                  />
                  {errors[key] && <p className="error-text">{errors[key]}</p>}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Calculating...' : 'Calculate Credit Score'}
              </button>
              <button type="button" onClick={clearForm} className="clear-btn">
                Clear Form
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="results">
              <h2>Credit Assessment Results</h2>

              <div className="score-display">
                <div className="score-circle">
                  <span className="score-value">{result.score}</span>
                  <span className="score-label">Credit Score</span>
                </div>

                <div className="risk-band" style={{ backgroundColor: getRiskBandColor(result.risk_band) }}>
                  <span className="risk-label">Risk Band</span>
                  <span className="risk-value">{result.risk_band}</span>
                </div>
              </div>

              <div className="explanations">
                <h3>Top Influencing Factors</h3>
                <div className="reasons-list">
                  {result.reasons.map((reason, index) => (
                    <div key={index} className="reason-item">
                      <span className="reason-rank">#{index + 1}</span>
                      <span className="reason-text">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
