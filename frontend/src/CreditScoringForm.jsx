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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700 px-4 py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100 mb-8">
          🧠 Credit Score Predictor
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {field.replaceAll("_", " ")}
              </label>
              <input
                id={field}
                name={field}
                type="number"
                step="any"
                min="0"
                value={formData[field]}
                onChange={handleChange}
                required
                className="p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="col-span-full text-center mt-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              🚀 Predict Credit Score
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-zinc-100">Prediction Result</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
              Score: {result.score}
            </p>
            <p className="text-md mb-4">
              <span className="font-medium text-zinc-700 dark:text-zinc-200">Risk Band:</span>{" "}
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                result.risk_band === "Low"
                  ? "bg-green-100 text-green-800"
                  : result.risk_band === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {result.risk_band}
              </span>
            </p>
            <div>
              <p className="font-medium text-zinc-700 dark:text-zinc-200 mb-2">Top Factors:</p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-300">
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
