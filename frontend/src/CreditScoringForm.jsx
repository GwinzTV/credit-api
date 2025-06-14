import React, { useState } from "react";

const fields = [
  "status_of_account", "duration_in_months", "credit_history", "purpose",
  "credit_amount", "savings_account_bonds", "present_employment", "installment_rate",
  "personal_status", "other_debtors", "residence_since", "property",
  "age", "other_installment_plans", "housing", "existing_credits",
  "job", "number_dependents", "own_telephone", "foreign_worker"
];

export default function CreditScoringForm() {
  const [formData, setFormData] = useState(Object.fromEntries(fields.map(f => [f, ""])));
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => [key, parseFloat(val)])
    );

    const res = await fetch("http://127.0.0.1:8000/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Credit Score Predictor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="text-sm font-medium text-gray-700">
              {field.replaceAll("_", " ")}
            </label>
            <input
              id={field}
              name={field}
              type="number"
              step="any"
              value={formData[field]}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Predict Credit Score
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Risk Band:</strong> {result.risk_band}</p>
          <p className="mt-2 font-medium">Top Factors:</p>
          <ul className="list-disc list-inside">
            {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
