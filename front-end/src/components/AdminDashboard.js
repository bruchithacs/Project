import React, { useState, useEffect } from 'react';
import api from '../axios';
import AnnouncementForm from './AnnouncementForm';
import MaterialForm from './MaterialForm';
import PhotoVideoForm from './PhotoVideoForm';
import FacultyForm from './FacultyForm';
import SyllabusForm from './SyllabusForm';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const [activeForm, setActiveForm] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [photosVideos, setPhotosVideos] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [matRes, annRes, sylRes, pvRes, facRes] = await Promise.all([
          api.get('/materials'),
          api.get('/announcements'),
          api.get('/syllabus'),
          api.get('/user/photos-videos'),
          api.get('/faculty'),
        ]);

        setMaterials(Array.isArray(matRes.data) ? matRes.data : []);
        setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
        setSyllabi(Array.isArray(sylRes.data) ? sylRes.data : []);
        setPhotosVideos(Array.isArray(pvRes.data) ? pvRes.data : []);
        setFaculty(Array.isArray(facRes.data) ? facRes.data : []);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err.response?.data || err.message);
        setMaterials([]);
        setAnnouncements([]);
        setSyllabi([]);
        setPhotosVideos([]);
        setFaculty([]);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await api.delete(`/delete-${type}/${id}`);
      if (type === 'material') setMaterials(materials.filter((item) => item.id !== id));
      if (type === 'announcement') setAnnouncements(announcements.filter((item) => item.id !== id));
      if (type === 'syllabus') setSyllabi(syllabi.filter((item) => item.id !== id));
      if (type === 'photo-video') setPhotosVideos(photosVideos.filter((item) => item.id !== id));
      if (type === 'faculty') setFaculty(faculty.filter((item) => item.id !== id));
      alert(`${type} deleted successfully!`);
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err.response?.data || err.message);
      alert(`Failed to delete ${type}`);
    }
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, ...item });
    setActiveForm(type);
  };

  const refreshData = async () => {
    try {
      const [matRes, annRes, sylRes, pvRes, facRes] = await Promise.all([
        api.get('/materials'),
        api.get('/announcements'),
        api.get('/syllabus'),
        api.get('/user/photos-videos'),
        api.get('/faculty'),
      ]);

      setMaterials(Array.isArray(matRes.data) ? matRes.data : []);
      setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
      setSyllabi(Array.isArray(sylRes.data) ? sylRes.data : []);
      setPhotosVideos(Array.isArray(pvRes.data) ? pvRes.data : []);
      setFaculty(Array.isArray(facRes.data) ? facRes.data : []);
      setEditingItem(null);
      setActiveForm(null);
    } catch (err) {
      console.error('Failed to refresh data:', err.response?.data || err.message);
      setMaterials([]);
      setAnnouncements([]);
      setSyllabi([]);
      setPhotosVideos([]);
      setFaculty([]);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return (
    <div className="error-message">
      Error: {error} <button onClick={refreshData} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Welcome Message (Full-Screen Background Image) */}
      {!activeForm && (
        <div className="welcome-section">
          <div className="welcome-content">
            <h3>Welcome, Admin!</h3>
            <p>Manage the CSE Web Portal with ease. Select an option from the sidebar to get started.</p>
            <div className="welcome-animation">
              <span className="dot dot1"></span>
              <span className="dot dot2"></span>
              <span className="dot dot3"></span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* College Logo and Name */}
      <div className="college-header">
        <img src="/Assests/image.png" alt="College Logo" className="college-logo" />
        <h1 className="college-name">BMS College <br/>Of Engineering</h1>
      </div>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button className="home-btn" onClick={() => { setActiveForm(null); setSidebarOpen(false); }}>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => { setActiveForm('material'); setSidebarOpen(false); }}>
              Manage Materials
            </button>
          </li>
          <li>
            <button onClick={() => { setActiveForm('announcement'); setSidebarOpen(false); }}>
              Manage Announcements
            </button>
          </li>
          <li>
            <button onClick={() => { setActiveForm('photoVideo'); setSidebarOpen(false); }}>
              Manage Photos/Videos
            </button>
          </li>
          <li>
            <button onClick={() => { setActiveForm('faculty'); setSidebarOpen(false); }}>
              Manage Faculty
            </button>
          </li>
          <li>
            <button onClick={() => { setActiveForm('syllabus'); setSidebarOpen(false); }}>
              Manage Syllabus
            </button>
          </li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="dashboard-header">
          <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
        </div>

        {activeForm === 'material' && (
          <div className="section materials-section">
            <video autoPlay loop muted playsInline className="section-video">
              <source src="/Assests/star.mp4" type="video/mp4" />
              <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
              Your browser does not support the video tag.
            </video>
            <div className="section-header">
              <h3 className="animated-heading">Manage Materials</h3>
            </div>

            <div className="table-container">
              {materials.length > 0 ? (
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Semester</th>
                      <th>File</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((item, index) => (
                      <tr
                        key={item.id}
                        className="table-row"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{item.title}</td>
                        <td>{item.semester}</td>
                        <td>
                          <a
                            href={`http://localhost:8080/api/files${item.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-link"
                          >
                            View
                          </a>
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit('material', item)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('material', item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No materials available.</p>
              )}
            </div>

            <div className="form-container animated-form">
              <MaterialForm
                initialData={editingItem?.type === 'material' ? editingItem : null}
                onSuccess={refreshData}
              />
            </div>
          </div>
        )}

        {activeForm === 'announcement' && (
          <div className="section announcements-section">
            <video autoPlay loop muted playsInline className="section-video">
              <source src="/Assests/star.mp4" type="video/mp4" />
              <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
              Your browser does not support the video tag.
            </video>
            <div className="section-header">
              <h3 className="animated-heading">Manage Announcements</h3>
            </div>

            <div className="table-container">
              {announcements.length > 0 ? (
                <table className="announcements-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((item, index) => (
                      <tr
                        key={item.id}
                        className="table-row"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{item.title}</td>
                        <td>{item.content}</td>
                        <td>
                          <button
                            onClick={() => handleEdit('announcement', item)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('announcement', item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No announcements available.</p>
              )}
            </div>

            <div className="form-container animated-form">
              <AnnouncementForm
                initialData={editingItem?.type === 'announcement' ? editingItem : null}
                onSuccess={refreshData}
              />
            </div>
          </div>
        )}

        {activeForm === 'photoVideo' && (
          <div className="section photo-video-section">
            <video autoPlay loop muted playsInline className="section-video">
              <source src="/Assests/star.mp4" type="video/mp4" />
              <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
              Your browser does not support the video tag.
            </video>
            <div className="section-header">
              <h3 className="animated-heading">Manage Photos/Videos</h3>
            </div>

            <div className="table-container">
              {photosVideos.length > 0 ? (
                <table className="photo-video-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>File</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photosVideos.map((item, index) => (
                      <tr
                        key={item.id}
                        className="table-row"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{item.type}</td>
                        <td>
                          <a
                            href={`http://localhost:8080/api/files${item.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-link"
                          >
                            View
                          </a>
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit('photoVideo', item)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('photo-video', item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No photos/videos available.</p>
              )}
            </div>

            <div className="form-container animated-form">
              <PhotoVideoForm
                initialData={editingItem?.type === 'photoVideo' ? editingItem : null}
                onSuccess={refreshData}
              />
            </div>
          </div>
        )}

        {activeForm === 'faculty' && (
          <div className="section faculty-section">
            <video autoPlay loop muted playsInline className="section-video">
              <source src="/Assests/star.mp4" type="video/mp4" />
              <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
              Your browser does not support the video tag.
            </video>
            <div className="section-header">
              <h3 className="animated-heading">Manage Faculty</h3>
            </div>

            <div className="table-container">
              {faculty.length > 0 ? (
                <table className="faculty-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Qualification</th>
                      <th>Specialization</th>
                      <th>Join Date</th>
                      <th>Photo</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map((item, index) => (
                      <tr
                        key={item.id}
                        className="table-row"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{item.name}</td>
                        <td>{item.designation}</td>
                        <td>{item.qualification}</td>
                        <td>{item.areaOfSpecialization}</td>
                        <td>{item.dateOfJoining}</td>
                        <td>
                          {item.photo && (
                            <img
                              src={`http://localhost:8080/api/files${item.photo}`}
                              alt={item.name}
                              style={{ maxWidth: '50px', height: 'auto' }}
                              onError={(e) => console.error(`Failed to load faculty photo: ${item.photo}`)}
                            />
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit('faculty', item)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('faculty', item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No faculty available.</p>
              )}
            </div>

            <div className="form-container animated-form">
              <FacultyForm
                initialData={editingItem?.type === 'faculty' ? editingItem : null}
                onSuccess={refreshData}
              />
            </div>
          </div>
        )}

        {activeForm === 'syllabus' && (
          <div className="section syllabus-section">
            <video autoPlay loop muted playsInline className="section-video">
              <source src="/Assests/star.mp4" type="video/mp4" />
              <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
              Your browser does not support the video tag.
            </video>
            <div className="section-header">
              <h3 className="animated-heading">Manage Syllabus</h3>
            </div>

            <div className="table-container">
              {syllabi.length > 0 ? (
                <table className="syllabus-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Semester</th>
                      <th>Subject</th>
                      <th>File</th>
                      <th>Upload Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syllabi.map((item, index) => (
                      <tr
                        key={item.id}
                        className="table-row"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{item.courseName || 'N/A'}</td>
                        <td>{item.semester}</td>
                        <td>{item.subject || 'N/A'}</td>
                        <td>
                          {item.filePath ? (
                            <a
                              href={`http://localhost:8080/api/files${item.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            'No File'
                          )}
                        </td>
                        <td>{item.uploadDate || 'N/A'}</td>
                        <td>
                          <button
                            onClick={() => handleEdit('syllabus', item)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('syllabus', item.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No syllabi available.</p>
              )}
            </div>

            <div className="form-container animated-form">
              <SyllabusForm
                initialData={editingItem?.type === 'syllabus' ? editingItem : null}
                onSuccess={refreshData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;