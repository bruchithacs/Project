import React, { useState, useEffect } from 'react';
import api from '../axios';
import './SyllabusForm.css';

function SyllabusForm({ initialData, onSuccess }) {
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setSemester(initialData.semester || '');
      setFile(null); // Reset file for editing
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('semester', semester);
    if (file) formData.append('file', file);

    try {
      if (initialData) {
        await api.put(`/update-syllabus/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Syllabus updated!');
      } else {
        await api.post('/add-syllabus', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Syllabus added!');
      }
      setSemester('');
      setFile(null);
      setError('');
      onSuccess();
    } catch (err) {
      console.error('Failed to save syllabus:', err.response?.data || err.message);
      setError('Failed to save syllabus');
    }
  };

  const handleCancel = () => {
    setSemester('');
    setFile(null);
    setError('');
    onSuccess();
  };

  return (
    <div className="syllabus-form">
      <h3>{initialData ? 'Update Syllabus' : 'Add Syllabus'}</h3>
      <form onSubmit={handleSubmit}>
        {/* Semester Field */}
        <div className="input-box">
          <label>Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter semester (e.g., 1-8)"
            required
          />
        </div>

        {/* File Field */}
        <div className="file-input-box">
          <label>File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf"
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn pulse-btn">
            {initialData ? 'Update' : 'Add'}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SyllabusForm;