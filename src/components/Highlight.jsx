import React from 'react';

export const Highlights = () => {
  const videoData = [
    { id: 1, title: "PAK vs IND - Last Over Thriller", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", duration: "10:20" },
    { id: 2, title: "Babar Azam's Brilliant Century", img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400", duration: "05:45" },
    { id: 3, title: "Best Wickets of the Tournament", img: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400", duration: "08:15" },
  ];

  return (
    <div className="mt-5">
      <h5 className="fw-bold mb-3 text-dark">
        <i className="bi bi-play-circle-fill text-danger me-2"></i> Match Highlights
      </h5>
      <div className="row g-3">
        {videoData.map((video) => (
          <div className="col-md-4" key={video.id}>
            <div className="card border-0 shadow-sm position-relative overflow-hidden highlight-card" style={{ borderRadius: '15px', cursor: 'pointer' }}>
              <img src={video.img} className="card-img-top" alt="Thumbnail" style={{ height: '180px', objectFit: 'cover' }} />
              
              {/* Play Icon Overlay */}
              <div className="position-absolute top-50 start-50 translate-middle">
                <i className="bi bi-play-fill text-white fs-1 opacity-75"></i>
              </div>
              
              {/* Duration Badge */}
              <span className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 small rounded opacity-75">
                {video.duration}
              </span>

              <div className="card-body p-2">
                <p className="card-text small fw-bold mb-0 text-truncate">{video.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

