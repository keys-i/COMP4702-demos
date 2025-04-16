import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Define styles as a JavaScript object
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eef2ff, #dbeafe)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "700",
    marginBottom: "2rem",
    color: "#3730a3",
    letterSpacing: "-0.025em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.25rem",
    width: "100%",
    maxWidth: "800px",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  cardHover: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transform: "translateY(-4px)",
  },
  moduleLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "0.25rem",
  },
  weekNumber: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1f2937",
  },
  contentContainer: {
    backgroundColor: "white",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderRadius: "1rem",
    padding: "2.5rem",
    maxWidth: "48rem",
    width: "100%",
  },
  contentTitle: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#3730a3",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
  },
  paragraph: {
    fontSize: "1.125rem",
    color: "#4b5563",
    marginBottom: "1rem",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    marginTop: "2rem",
    transition: "background-color 0.2s ease",
  },
  backButtonHover: {
    backgroundColor: "#4338ca",
  },
};

// Week List Component
const WeekList = () => {
  const weeks = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>COMP4702 Demos</h1>
      <div style={styles.grid}>
        {weeks.map((week) => (
          <Link
            key={week}
            to={`/week${week}`}
            style={styles.card}
            onMouseOver={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover);
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={styles.moduleLabel}>Module</span>
            <span style={styles.weekNumber}>Week {week}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Week Page Component
const WeekPage = ({ week }) => (
  <div style={styles.container}>
    <div style={styles.contentContainer}>
      <h1 style={styles.contentTitle}>Week {week} Content</h1>
      <div>
        <p style={styles.paragraph}>Welcome to week {week} of your course.</p>
        <p style={styles.paragraph}>
          This is where your weekly content, assignments and resources would be
          displayed.
        </p>
      </div>
      <Link
        to="/"
        style={styles.backButton}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor =
            styles.backButtonHover.backgroundColor;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor =
            styles.backButton.backgroundColor;
        }}
      >
        ← Back to All Weeks
      </Link>
    </div>
  </div>
);

// Main App Component
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WeekList />} />
      {[...Array(9)].map((_, i) => {
        const week = i + 1;
        return (
          <Route
            key={week}
            path={`/week${week}`}
            element={<WeekPage week={week} />}
          />
        );
      })}
    </Routes>
  );
};

export default App;
