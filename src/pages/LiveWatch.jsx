import React, { useState, useEffect, useCallback } from 'react'; // 'i' small rakhein
import axios from 'axios';

const LiveWatch = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Stable fetchLive function
  const fetchLive = useCallback(async () => {
    try {
      const res = await axios.get('cricket-project-tau.vercel.app/api/matches/live-now');
      // Agar backend se match mil jaye
      if (res.data && Object.keys(res.data).length !== 0) {
        setMatch(res.data);
      } else {
        setMatch(null); // No live match
      }
    } catch (err) {
      console.error('Error fetching live match:', err);
      setMatch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const timer = setInterval(fetchLive, 20000); 
    return () => clearInterval(timer);
  }, [fetchLive]);

  // ✅ Safe YouTube URL Converter
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = '(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})';
    const matchId = url.match(regExp);
    return matchId && matchId[1] ? `https://www.youtube.com/embed/${matchId[1]}` : url;
  };

  if (loading) {
    return <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center text-white"><h3>Loading Live Stream...</h3></div>;
  }

  if (!match) {
    return (
      <div className="bg-dark min-vh-100 d-flex flex-column align-items-center justify-content-center text-white pt-5">
        <span style={{ fontSize: '50px' }}>🏏</span>
        <h2 className="fw-bold mt-3">Abhi koi match LIVE nahi hai</h2>
        <p className="text-muted">Admin jab match ko "Live" karega toh wo yahan dikhayi dega.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-dark min-vh-100 text-white pt-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <span className="text-danger animate-pulse" style={{ marginRight: '10px' }}>●</span> 
          LIVE: {match.teamA} vs {match.teamB}
        </h3>
        <span className="badge bg-danger px-3 py-2 shadow-sm">LIVE STREAMING</span>
      </div>

      <div className="row g-4">
        {/* Video Section */}
        <div className="col-lg-8">
          <div className="ratio ratio-16x9 shadow-lg rounded-4 overflow-hidden border border-secondary">
            {match.videoUrl ? (
              <iframe
                src={getEmbedUrl(match.videoUrl)}
                title="Cricket Live Stream"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-black text-muted">
                Video streaming link missing...
              </div>
            )}
          </div>
          <div className="mt-3 p-3 bg-secondary bg-opacity-10 rounded-3 border-start border-success border-4">
            <h5 className="fw-bold text-success mb-1">{match.venue || "International Stadium"}</h5>
            <p className="small text-muted mb-0">NJ Cricket Official Live Feed</p>
          </div>
        </div>

        {/* Commentary Section */}
        <div className="col-lg-4">
          <div className="card bg-dark border-secondary h-100 shadow-sm">
            <div className="card-header border-secondary fw-bold text-success d-flex align-items-center">
              <i className="bi bi-mic-fill me-2"></i> Live Commentary
            </div>
            <div className="card-body overflow-auto small" style={{ maxHeight: '450px', scrollbarWidth: 'thin' }}>
              {match.commentary && match.commentary.length > 0 ? (
                match.commentary.map((c, i) => (
                  <div key={i} className="mb-3 border-bottom border-secondary pb-2 animate__animated animate__fadeIn">
                    <strong className="text-warning">{c.over}:</strong> 
                    <span className="ms-2">{c.text}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted mt-5">
                  <p>Wait for ball-by-ball updates...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LiveWatch;