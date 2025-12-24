import React, { useState, useEffect } from 'react';
import api from '../axios';
import './MaterialForm.css';

function MaterialForm({ initialData, onSuccess }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState(initialData?.semester || '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSemester(initialData.semester || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('title', title);
    if (file) formData.append('file', file);
    formData.append('semester', semester);

    try {
      if (initialData) {
        await api.put(`/update-material/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Material updated successfully!');
      } else {
        await api.post('/add-material', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Material added successfully!');
      }
      setTitle('');
      setFile(null);
      setSemester('');
      onSuccess();
    } catch (err) {
      console.error('Failed to save material:', err.response?.data || err.message);
      setError('Failed to save material. Please try again.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setFile(null);
    setSemester('');
    setError(null);
    setSuccess(null);
    onSuccess(); // Reset editing state
  };

  return (
    <form onSubmit={handleSubmit} className="material-form">
      <h3 className="form-heading">{initialData ? 'Update Material' : 'Add Material'}</h3>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="input-box">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter material title"
          required
        />
      </div>

      <div className="input-box">
        <label htmlFor="semester">Semester:</label>
        <select
          id="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        >
          <option value="">Select a semester</option>
          {[1, 2, 3, 4, 5, 6].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box file-input-box">
        <label htmlFor="file">File:</label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
          required={!initialData} // File optional for updates
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn">
          {initialData ? 'Update' : 'Add'}
        </button>
        {initialData && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MaterialForm;