import React, { useState } from "react";

const features = [
  "anxiety_level", "self_esteem", "mental_health_history", "depression",
  "headache", "blood_pressure", "sleep_quality", "breathing_problem",
  "noise_level", "living_conditions", "safety", "basic_needs",
  "academic_performance", "study_load", "teacher_student_relationship", "future_career_concerns",
  "social_support", "peer_pressure", "extracurricular_activities", "bullying"
];

const colors = {
  background: "#e3f2fd",
  container: "#ffffff",
  button: "#1976d2",
  buttonHover: "#1565c0",
  label: "#0d47a1",
  inputBorder: "#90caf9",
  resultBg: "#c8e6c9",
  resultText: "#2e7d32"
};

export default function App() {
  const [formData, setFormData] = useState(
    features.reduce((acc, curr) => ({ ...acc, [curr]: "" }), {})
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://student-stress-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        const labels = {
          "0": "Low Stress",
          "1": "Moderate Stress",
          "2": "High Stress"
        };
        setResult(labels[data.stress_level] || data.stress_level);
      } else {
        setResult(data.error || "Error occurred");
      }
    } catch {
      setResult("Backend server not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={{ background: colors.background, minHeight: "100vh", padding: 20 }}>
      <div style={{
        maxWidth: 600,
        margin: "auto",
        background: colors.container,
        borderRadius: 10,
        padding: 30,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ color: colors.label, textAlign: "center" }}>Student Stress Diagnosis</h1>
        <form onSubmit={handleSubmit}>
          {features.map((feat) => (
            <div key={feat} style={{ marginBottom: 15 }}>
              <label htmlFor={feat} style={{
                display: "block",
                marginBottom: 6,
                color: colors.label,
                fontWeight: "bold",
                textTransform: "capitalize"
              }}>
                {feat.replace(/_/g, " ")}
              </label>
              <input
                id={feat}
                name={feat}
                type="number"
                value={formData[feat]}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 5,
                  border: `2px solid ${colors.inputBorder}`,
                  fontSize: 16,
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              backgroundColor: colors.button,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={e => e.target.style.backgroundColor = colors.buttonHover}
            onMouseLeave={e => e.target.style.backgroundColor = colors.button}
          >
            {loading ? "Diagnosing..." : "Diagnose"}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: 30,
            backgroundColor: colors.resultBg,
            color: colors.resultText,
            padding: 15,
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center"
          }}>
            Result: {result}
          </div>
        )}
      </div>
    </div>
  );
}
