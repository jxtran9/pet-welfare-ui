import { useEffect, useState, useMemo } from "react";

function App() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speciesFilter, setSpeciesFilter] = useState("All");

  useEffect(() => {
    const API_URL =
      "https://pet-welfare-backend-production.up.railway.app/animals-simple";

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Simple front-end filter by Species column
  const filteredAnimals = useMemo(() => {
    if (speciesFilter === "All") return animals;
    return animals.filter(
      (a) => a.Species && a.Species.toLowerCase() === speciesFilter.toLowerCase()
    );
  }, [animals, speciesFilter]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#020617",
          borderRadius: "1rem",
          padding: "1.75rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          border: "1px solid #1e293b",
        }}
      >
        <header style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>
            Pet Health & Welfare – Animals View
          </h1>
          <p style={{ color: "#cbd5f5", fontSize: "0.95rem" }}>
            This page pulls live data from our Railway MySQL database via the FastAPI
            backend. Each row represents an animal currently tracked in the system.
          </p>
        </header>

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
              Showing{" "}
              <strong>{filteredAnimals.length}</strong>{" "}
              {filteredAnimals.length === 1 ? "animal" : "animals"}
            </span>
          </div>

          <div>
            <label
              htmlFor="speciesFilter"
              style={{
                fontSize: "0.85rem",
                marginRight: "0.5rem",
                color: "#e5e7eb",
              }}
            >
              Filter by species:
            </label>
            <select
              id="speciesFilter"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                color: "white",
                fontSize: "0.9rem",
              }}
            >
              <option value="All">All</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
        </section>

        {loading && <p>Loading animals from the database…</p>}

        {error && (
          <p style={{ color: "#f97373" }}>
            Error loading animals: {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid #1f2937",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead style={{ backgroundColor: "#111827" }}>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Species</th>
                  <th style={thStyle}>Sex</th>
                  <th style={thStyle}>Age (months)</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "0.75rem 1rem",
                        textAlign: "center",
                        color: "#9ca3af",
                      }}
                    >
                      No animals match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredAnimals.map((a, idx) => (
                    <tr
                      key={a.AnimalID ?? idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#020617" : "#030712",
                      }}
                    >
                      <td style={tdStyle}>{a.AnimalID}</td>
                      <td style={tdStyle}>{a.Species}</td>
                      <td style={tdStyle}>{a.Sex}</td>
                      <td style={tdStyle}>{a.AgeMonths}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <footer style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "#6b7280" }}>
          <p>
            Data source: Pet Health & Welfare MySQL database on Railway. UI built
            with React + Vite.
          </p>
        </footer>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.6rem 0.9rem",
  borderBottom: "1px solid #1f2937",
  fontWeight: 600,
  color: "#e5e7eb",
};

const tdStyle = {
  padding: "0.55rem 0.9rem",
  borderBottom: "1px solid #111827",
  color: "#e5e7eb",
};

export default App;