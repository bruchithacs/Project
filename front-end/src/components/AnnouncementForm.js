import React, { useState, useEffect } from 'react';
import api from '../axios';
import './AnnouncementForm.css';

function AnnouncementForm({ initialData, onSuccess }) {
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({ title: initialData.title || '', content: initialData.content || '' });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.title || !form.content) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (initialData) {
        await api.put(`/update-announcement/${initialData.id}`, form);
        setSuccess('Announcement updated successfully!');
      } else {
        await api.post('/add-announcement', form);
        setSuccess('Announcement added successfully!');
      }
      setForm({ title: '', content: '' });
      onSuccess();
    } catch (err) {
      console.error('Failed to save announcement:', err.response?.data || err.message);
      setError('Failed to save announcement. Please try again.');
    }
  };

  const handleCancel = () => {
    setForm({ title: '', content: '' });
    setError(null);
    setSuccess(null);
    onSuccess(); // Reset editing state
  };

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <h3 className="form-heading">{initialData ? 'Update Announcement' : 'Add Announcement'}</h3>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="input-box">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div className="input-box">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Enter announcement content"
          required
          rows="5"
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

export default AnnouncementForm;