import React, { useState } from 'react';
import api from '../axios';
import './PhotoVideoForm.css'; // Import the new CSS file

function PhotoVideoForm({ initialData, onSuccess }) {
  const [type, setType] = useState(initialData?.type || 'PHOTO');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file || initialData?.file); // Handle editing case
    const url = initialData ? `/update-photo-video/${initialData.id}` : '/add-photo-video';
    const method = initialData ? 'put' : 'post';

    try {
      await api[method](url, formData);
      setType(initialData?.type || 'PHOTO');
      setFile(null);
      onSuccess(); // Refresh the parent component
      alert(initialData ? 'Photo/Video updated!' : 'Photo/Video added!');
    } catch (err) {
      console.error('Failed to submit:', err.response?.data || err.message);
      alert('Failed to submit photo/video');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>{initialData ? 'Edit Photo/Video' : 'Add Photo/Video'}</h3>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="PHOTO">Photo</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>
      <div>
        <label>File:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          defaultValue={initialData?.filePath || ''}
        />
      </div>
      <button type="submit">{initialData ? 'Update' : 'Add'}</button>
    </form>
  );
}

export default PhotoVideoForm;