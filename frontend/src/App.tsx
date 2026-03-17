import React, { useState } from 'react';

// Using the same interface as our backend for type safety
interface DepartmentalDensity {
  companyName: string;
  domain: string;
  totalEmployees: number;
  itEmployeeCount: number;
  densityScore: number;
  isHighValueLead: boolean;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

function App() {
  const [headcountRange, setHeadcountRange] = useState('30,100');
  const [location, setLocation] = useState('Ohio');
  const [results, setResults] = useState<DepartmentalDensity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          // Auto-fill format: "City, State"
          setLocation(`${data.city || data.locality}, ${data.principalSubdivision}`);
        } catch (err) {
          setError('Failed to reverse geocode location.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || 'Failed to get location from browser.');
        setLoading(false);
      }
    );
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headcountRange,
          locations: [location],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to execute scan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>Density Scout</h1>
        <p className="subtitle">Find High-Value MSP Prospects with 0 IT Staff</p>
      </header>

      <div className="glass-panel">
        <form className="config-form" onSubmit={handleScan}>
          <div className="input-group">
            <label htmlFor="headcount">Headcount Range</label>
            <input
              id="headcount"
              type="text"
              value={headcountRange}
              onChange={(e) => setHeadcountRange(e.target.value)}
              placeholder="e.g. 30,100"
              required
            />
          </div>
          
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="location" style={{ marginBottom: 0 }}>Primary Location</label>
              <button 
                type="button" 
                onClick={handleUseMyLocation}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}
              >
                📍 Use My Location
              </button>
            </div>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ohio"
              list="states"
              required
            />
            <datalist id="states">
              {US_STATES.map(state => <option key={state} value={state} />)}
            </datalist>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Scanning...' : 'Run Scanner'}
          </button>
        </form>

        {error && (
          <div style={{ color: 'var(--accent-red)', textAlign: 'center', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="results-container">
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p style={{ color: 'var(--text-muted)' }}>Analyzing LinkedIn APIs... This may take a minute.</p>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="empty-state">
              <p>No results yet. Run a scan to find leads.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="results-grid">
              {results.map((lead, idx) => (
                <div key={idx} className="glass-panel company-card">
                  <div className="card-header">
                    <div>
                      <h3 className="company-name">{lead.companyName}</h3>
                      <a 
                        href={`https://${lead.domain}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="company-domain"
                      >
                        {lead.domain}
                      </a>
                    </div>
                    {lead.isHighValueLead && (
                      <span className="status-badge">High Value 🎯</span>
                    )}
                  </div>

                  <div className="card-stats">
                    <div className="stat-group">
                      <span className="stat-label">Total Staff</span>
                      <span className="stat-value">{lead.totalEmployees}</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">IT Staff</span>
                      <span className="stat-value" style={{ color: lead.itEmployeeCount === 0 ? 'var(--accent-green)' : 'inherit' }}>
                        {lead.itEmployeeCount}
                      </span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">Density Score</span>
                      <span className="stat-value">{lead.densityScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
