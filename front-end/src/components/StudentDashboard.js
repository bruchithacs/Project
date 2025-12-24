import React, { useState, useEffect } from 'react';
import api from '../axios';
import './dashboard.css';

function StudentDashboard({ onLogout }) {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [photosVideos, setPhotosVideos] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // For full-screen modal
  const [loadingMedia, setLoadingMedia] = useState({}); // Track loading state for each media item

  const messages = [
    "Every expert was once a beginner. Keep going!",
    "Small progress is still progress. Stay consistent!",
    "Your future is created by what you do today, not tomorrow.",
    "Don’t limit your challenges. Challenge your limits!",
    "Learning never stops. Keep exploring, keep growing!",
    "Mistakes are proof that you are trying. Keep pushing!",
    "Believe in yourself! You are capable of more than you know.",
    "Success is the sum of small efforts repeated daily.",
    "Stay positive, work hard, and make it happen!",
    "Dream big, work hard, and stay humble."
  ];

  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchNonMaterialData = async () => {
      setLoading(true);
      try {
        const [annRes, sylRes, pvRes, facRes] = await Promise.all([
          api.get('/announcements'),
          api.get('/syllabus'),
          api.get('/user/photos-videos'),
          api.get('/faculty'),
        ]);

        setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
        setSyllabi(Array.isArray(sylRes.data) ? sylRes.data : []);
        setPhotosVideos(Array.isArray(pvRes.data) ? pvRes.data : []);
        setFaculty(Array.isArray(facRes.data) ? facRes.data : []);

        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err.response?.data || err.message);
        setAnnouncements([]);
        setSyllabi([]);
        setPhotosVideos([]);
        setFaculty([]);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchNonMaterialData();
  }, []);

  const fetchMaterials = async (semester) => {
    setLoading(true);
    try {
      const response = await api.get(`/materials/semester/${semester}`);
      setMaterials(Array.isArray(response.data) ? response.data : []);
      setSelectedSemester(semester);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch materials:', err.response?.data || err.message);
      setMaterials([]);
      setError('Failed to load materials');
      setLoading(false);
    }
  };

  // Scroll to Materials section after materials are fetched
  useEffect(() => {
    if (selectedSemester) {
      const materialSection = document.getElementById("material");
      if (materialSection) {
        materialSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [materials, selectedSemester]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isImage = (filePath) => /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  const isVideo = (filePath) => /\.(mp4|webm|ogg)$/i.test(filePath);

  const forceDownload = (url, filename) => {
    fetch(url, { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Download failed:', err));
  };

  useEffect(() => {
    const toggler = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    const toggleMenu = () => {
      menu.classList.toggle('active');
      toggler.classList.toggle('active');
    };

    toggler?.addEventListener('click', toggleMenu);

    return () => {
      toggler?.removeEventListener('click', toggleMenu);
    };
  }, []);

  // Photos/Videos Section Updates
  const baseUrl = "http://localhost:8080/api/files"; // Base URL for media files

  const openFullScreen = (media) => {
    setSelectedMedia(media);
  };

  const closeFullScreen = () => {
    setSelectedMedia(null);
  };

  const goToPrevious = () => {
    const currentIndex = photosVideos.findIndex((pv) => pv.id === selectedMedia.id);
    const previousIndex = (currentIndex - 1 + photosVideos.length) % photosVideos.length;
    setSelectedMedia(photosVideos[previousIndex]);
  };

  const goToNext = () => {
    const currentIndex = photosVideos.findIndex((pv) => pv.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % photosVideos.length;
    setSelectedMedia(photosVideos[nextIndex]);
  };

  const handleMediaLoad = (id) => {
    setLoadingMedia((prev) => ({ ...prev, [id]: false }));
  };

  const handleMediaError = (id) => {
    setLoadingMedia((prev) => ({ ...prev, [id]: false }));
    console.error(`Failed to load media with ID ${id}`);
  };

  useEffect(() => {
    photosVideos.forEach((pv) => {
      setLoadingMedia((prev) => ({ ...prev, [pv.id]: true }));
    });
  }, [photosVideos]);

  // Keyboard navigation for full-screen modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeFullScreen();
      if (selectedMedia) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMedia]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="./Assests/image.png" alt="College Logo" className="navbar-logo" />
          <span className="college-name">BMS College Of Engineering</span>
        </div>
        <ul className="navbar-menu">
          <li className="nav-item">
            <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              About
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#material"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                fetchMaterials(selectedSemester || 1);
                scrollToSection('material');
              }}
            >
              Materials
            </a>
          </li>
          <li className="nav-item">
            <a href="#announcements" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('announcements'); }}>
              Announcements
            </a>
          </li>
          <li className="nav-item">
            <a href="#faculty" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faculty'); }}>
              Faculty
            </a>
          </li>
          <li className="nav-item">
            <a href="#photos-videos" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('photos-videos'); }}>
              Photos/Videos
            </a>
          </li>
        </ul>
        <a href="#" className="logout-btn" onClick={onLogout}>Logout</a>
        <button className="navbar-toggle">
          <span className="toggle-icon"></span>
        </button>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard">
        {/* Home Section */}
        <div id="home" className="section">
          <div className='welcome-box'>
            <h2>Welcome to the Student Dashboard</h2>
            <p>{randomMessage}</p>
          </div>
        </div>

        {/* About Us Section */}
        <div id="about" className="about-container">
          <div className="about-image">
            <img src="/Assests/collegebms.png" alt="College Campus" />
          </div>
          <div className="about-content">
            <h2>About Us</h2>
            <div className="about-box">
              <h3>🎯 Institution Vision</h3>
              <p>Promoting Prosperity of mankind by augmenting human resource capital through quality Technical Education & Training. </p>
            </div>
            <div className="about-box">
              <h3>🏆 Institution Mission</h3>
              <p>Accomplish Excellence in the field of Technical Education through Education, Research and Service needs of Society.</p>
            </div>
            <div className="about-box">
              <h3>💻 CSE Department Vision</h3>
              <p>To be a model centre for education and training in the frontier areas of Computer Science and Engineering.</p>
            </div>
            <div className="about-box">
              <h3>🚀 CSE Department Mission</h3>
              <ul>
                <li>M1:To Educate and Empower the students in the area of Computer Science by providing best practices of Teaching Learning Process for successful professional career.</li>
                <li>M2: To enhance skills of the students to pursue higher studies and research.</li>
                <li>M3: To foster the students to innovate and nurture them towards Entrepreneurship.</li>
              </ul>
            </div>
            <div className="syllabus-section">
              <h3>📂 Syllabus Copy</h3>
              {syllabi.length > 0 ? (
                <ul>
                  {syllabi.map((s) => (
                    <li key={s.id}>
                      {s.semester} -{' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          forceDownload(
                            `http://localhost:8080/api/files${s.filePath}`,
                            `Syllabus_Semester_${s.semester}.pdf`
                          );
                        }}
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No syllabi available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div id="material" className="section">
          <h3>📚 Study Materials</h3>
          <div className="semester-buttons">
            {[1, 2, 3, 4, 5, 6,7,8].map((sem) => (
              <button
                key={sem}
                onClick={(e) => {
                  e.preventDefault();
                  fetchMaterials(sem);
                }}
                className={selectedSemester === sem ? 'active' : ''}
              >
                Semester {sem}
              </button>
            ))}
          </div>
          {materials.length > 0 ? (
            <ul className="materials-list">
              {materials.map((mat) => (
                <li key={mat.id} className="material-item">
                  <span>{mat.title} (Semester {mat.semester})</span>
                  <a
                    href="#material"
                    onClick={(e) => {
                      e.preventDefault();
                      forceDownload(`http://localhost:8080/api/files${mat.filePath}`, `${mat.title}.pdf`);
                    }}
                  >
                    📥 Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-materials">No materials available for Semester {selectedSemester || 'N/A'}.</p>
          )}
        </div>

        {/* Announcements Section */}
        <div className="section" id="announcements">
          <h3>Announcements</h3>
          {announcements.length > 0 ? (
            <ul className="announcements-list">
              {announcements.map((a) => (
                <li key={a.id} className="announcement-item">
                  <h4 className="announcement-title">{a.title}</h4>
                  <p className="announcement-content">{a.content}</p>
                  {a.createdAt && <span className="announcement-date">Posted on: {new Date(a.createdAt).toLocaleString()}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-announcements">No announcements available.</p>
          )}
        </div>

        {/* Photos/Videos Section */}
        <div className="section" id="photos-videos">
          <h3>Photos & Videos</h3>
          {photosVideos.length > 0 ? (
            <div className="gallery-grid">
              {photosVideos.map((pv) => {
                const mediaUrl = `${baseUrl}${pv.filePath}`;

                return (
                  <div
                    key={pv.id}
                    className="gallery-item"
                    onClick={() => openFullScreen(pv)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openFullScreen(pv)}
                    aria-label={`View ${pv.type === "PHOTO" ? "photo" : "video"} from ${new Date(pv.createdAt).toLocaleString()}`}
                  >
                    {loadingMedia[pv.id] && <div className="media-loading">Loading...</div>}
                    {pv.type === "PHOTO" ? (
                      <img
                        src={mediaUrl}
                        alt={`Media ${pv.id}`}
                        className="media-image"
                        onLoad={() => handleMediaLoad(pv.id)}
                        onError={() => handleMediaError(pv.id)}
                      />
                    ) : (
                      <div className="media-container">
                        <video
                          src={mediaUrl}
                          className="media-video"
                          muted
                          onLoadedData={() => handleMediaLoad(pv.id)}
                          onError={() => handleMediaError(pv.id)}
                        />
                        <span className="play-icon">▶</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-media">No photos or videos available.</p>
          )}
        </div>

        {/* Full-Screen Modal for Photos/Videos */}
        {selectedMedia && (
          <div className="fullscreen-modal" onClick={closeFullScreen}>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeFullScreen}>×</button>
              <button className="nav-arrow nav-arrow-left" onClick={goToPrevious}>❮</button>
              <button className="nav-arrow nav-arrow-right" onClick={goToNext}>❯</button>
              {selectedMedia.type === "PHOTO" ? (
                <img
                  src={`${baseUrl}${selectedMedia.filePath}`}
                  alt={`Media ${selectedMedia.id}`}
                  className="fullscreen-image"
                />
              ) : (
                <video
                  src={`${baseUrl}${selectedMedia.filePath}`}
                  className="fullscreen-video"
                  controls
                  autoPlay
                />
              )}
              <span className="fullscreen-date">
                Posted on: {new Date(selectedMedia.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        )}

                  {/* Faculty Section */}
          <div className="section" id="faculty">
            <h3>Faculty</h3>
            {faculty.length > 0 ? (
              <div className="faculty-grid">
                {faculty.map((f) => (
                  <div key={f.id} className="faculty-card">
                    {f.photo ? (
                      <img
                        src={`http://localhost:8080/api/files${f.photo}`}
                        alt={f.name}
                        className="faculty-photo"
                        onError={(e) => console.error(`Failed to load faculty photo: ${f.photo}`)}
                      />
                    ) : (
                      <div className="faculty-photo-placeholder">No Photo</div>
                    )}
                    <div className="faculty-info">
                      <h4 className="faculty-name">{f.name}</h4>
                      <p className="faculty-designation">{f.designation}</p>
                      <p className="faculty-details">
                        {f.qualification} <br/> {f.areaOfSpecialization}
                      </p>
                      <p className="faculty-joined">Joined: {f.dateOfJoining}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-faculty">No faculty information available.</p>
            )}
          </div>
      </div>
    </>
  );
}

export default StudentDashboard;