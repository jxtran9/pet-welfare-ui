import { useEffect, useState, useMemo } from "react";

const API_BASE = "https://pet-welfare-backend-production.up.railway.app";

function App() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speciesFilter, setSpeciesFilter] = useState("All");

  // Form state for CREATE (add-animal)
  const [animalId, setAnimalId] = useState("");
  const [orgId, setOrgId] = useState("");
  const [speciesInput, setSpeciesInput] = useState("");
  const [sex, setSex] = useState("U"); // default to U
  const [ageMonths, setAgeMonths] = useState("");
  const [formStatus, setFormStatus] = useState("");

  // Stats from /animal-stats
  const [stats, setStats] = useState([]);

  // Reusable fetch function so we can reload after insert/delete
  const fetchAnimals = () => {
    setLoading(true);
    const API_URL = `${API_BASE}/animals-simple`;

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
  };

  // Fetch aggregated stats
  const fetchStats = () => {
    const STATS_URL = `${API_BASE}/animal-stats`;

    fetch(STATS_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Stats request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        // optional: could track a stats error separately
      });
  };

  useEffect(() => {
    fetchAnimals();
    fetchStats();
  }, []);

  // Simple front-end filter by Species column
  const filteredAnimals = useMemo(() => {
    if (speciesFilter === "All") return animals;
    return animals.filter(
      (a) =>
        a.Species &&
        a.Species.toLowerCase() === speciesFilter.toLowerCase()
    );
  }, [animals, speciesFilter]);

  // Handle submit for Add Animal form
  const handleAddAnimal = (e) => {
    e.preventDefault();
    setFormStatus("");

    if (!animalId || !orgId || !speciesInput || !sex || !ageMonths) {
      setFormStatus("Please fill in all fields.");
      return;
    }

    const payload = {
      AnimalID: Number(animalId),
      OrgID: Number(orgId),
      Species: speciesInput,
      Sex: sex.toUpperCase(),
      AgeMonths: Number(ageMonths),
      Microchip: null,
      Notes: null,
    };

    fetch(`${API_BASE}/add-animal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Add failed: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setFormStatus("Animal added successfully.");
        setAnimalId("");
        setOrgId("");
        setSpeciesInput("");
        setSex("U");
        setAgeMonths("");
        fetchAnimals();
        fetchStats(); // refresh stats too
      })
      .catch((err) => {
        console.error(err);
        setFormStatus(`Error: ${err.message}`);
      });
  };

  // DELETE animal
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      `Delete animal with ID ${id}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    fetch(`${API_BASE}/delete-animal/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Delete failed: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        fetchAnimals();
        fetchStats(); // refresh stats after delete
      })
      .catch((err) => {
        console.error(err);
        alert(`Error deleting animal: ${err.message}`);
      });
  };

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
            This page pulls live data from our Railway MySQL database via the FastAPI backend.
          </p>
        </header>

        {/* Top controls: row count + filter */}
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
              Showing <strong>{filteredAnimals.length}</strong>{" "}
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

        {/* Species stats summary */}
        {stats.length > 0 && (
          <section
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #1f2937",
              backgroundColor: "#020617",
              fontSize: "0.9rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                marginBottom: "0.4rem",
              }}
            >
              Animals by species
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              {stats.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid #374151",
                    backgroundColor: "#030712",
                  }}
                >
                  <strong>{row.Species ?? "Unknown"}</strong>: {row.Count}
                </div>
              ))}
            </div>
          </section>
        )}

        {loading && <p>Loading animals from the database…</p>}

        {error && <p style={{ color: "#f97373" }}>Error loading animals: {error}</p>}

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
                  <th style={thStyle}>OrgID</th>
                  <th style={thStyle}>Species</th>
                  <th style={thStyle}>Sex</th>
                  <th style={thStyle}>Age (months)</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      <td style={tdStyle}>{a.OrgID}</td>
                      <td style={tdStyle}>{a.Species}</td>
                      <td style={tdStyle}>{a.Sex}</td>
                      <td style={tdStyle}>{a.AgeMonths}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(a.AnimalID)}
                          style={{
                            padding: "0.25rem 0.6rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #4b5563",
                            backgroundColor: "#7f1d1d",
                            color: "white",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Animal */}
        <section
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            Add New Animal (Create)
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
            }}
          >
            * AnimalID must be unique and OrgID must exist.
          </p>

          <form
            onSubmit={handleAddAnimal}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <input
              type="number"
              placeholder="AnimalID"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="OrgID"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Species"
              value={speciesInput}
              onChange={(e) => setSpeciesInput(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Sex (M/F/U)"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Age (months)"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "#2563eb",
                border: "none",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Add Animal
            </button>
          </form>

          {formStatus && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.85rem",
                color: formStatus.startsWith("Error") ? "#f97373" : "#a7f3d0",
              }}
            >
              {formStatus}
            </p>
          )}
        </section>

        <footer style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "#6b7280" }}>
          <p>Data source: Pet Health & Welfare MySQL database on Railway.</p>
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

const inputStyle = {
  padding: "0.4rem 0.6rem",
  borderRadius: "0.5rem",
  border: "1px solid #4b5563",
  backgroundColor: "#020617",
  color: "white",
  fontSize: "0.9rem",
};

export default App;
