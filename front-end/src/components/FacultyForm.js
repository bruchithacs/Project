import React, { useState, useEffect } from 'react';
import api from '../axios';
import './FacultyForm.css';

function FacultyForm({ initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    dateOfJoining: '',
    areaOfSpecialization: '',
    designation: '',
    photo: null,
  });
  const [error, setError] = useState('');

  // Populate form with initial data for editing
  useEffect(() => {
    if (initialData && initialData.type === 'faculty') {
      setFormData({
        name: initialData.name || '',
        qualification: initialData.qualification || '',
        dateOfJoining: initialData.dateOfJoining || '',
        areaOfSpecialization: initialData.areaOfSpecialization || '',
        designation: initialData.designation || '',
        photo: null, // Reset photo; user uploads a new one if needed
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('qualification', formData.qualification);
    data.append('dateOfJoining', formData.dateOfJoining);
    data.append('areaOfSpecialization', formData.areaOfSpecialization);
    data.append('designation', formData.designation);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      if (initialData && initialData.type === 'faculty') {
        await api.put(`/update-faculty/${initialData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Faculty updated successfully!');
      } else {
        await api.post('/add-faculty', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Faculty added successfully!');
      }
      setFormData({
        name: '',
        qualification: '',
        dateOfJoining: '',
        areaOfSpecialization: '',
        designation: '',
        photo: null,
      });
      setError('');
      onSuccess();
    } catch (err) {
      console.error('Failed to save faculty:', err.response?.data || err.message);
      setError('Failed to save faculty');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      qualification: '',
      dateOfJoining: '',
      areaOfSpecialization: '',
      designation: '',
      photo: null,
    });
    setError('');
    onSuccess();
  };

  return (
    <div className="faculty-form">
      <h3>{initialData && initialData.type === 'faculty' ? 'Update Faculty' : 'Add Faculty'}</h3>
      <form onSubmit={handleSubmit}>
        {/* Row 1: Name, Qualification, Date of Joining */}
        <div className="input-row">
          <div className="input-box">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter faculty name"
              required
            />
          </div>
          <div className="input-box">
            <label>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              placeholder="Enter qualification"
              required
            />
          </div>
          <div className="input-box">
            <label>Date of Joining:</label>
            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Row 2: Area of Specialization, Designation, Photo */}
        <div className="input-row">
          <div className="input-box">
            <label>Area of Specialization:</label>
            <input
              type="text"
              name="areaOfSpecialization"
              value={formData.areaOfSpecialization}
              onChange={handleInputChange}
              placeholder="Enter area of specialization"
              required
            />
          </div>
          <div className="input-box">
            <label>Designation:</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Designation</option>
               <option value="Hod & Professor">Hod & Professor</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Research Fellow">Research Fellow</option>
            </select>
          </div>
          <div className="file-input-box">
            <label>Photo:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              style={{ alignItems: 'center', display: 'flex' }} // Temporary inline style for alignment
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn pulse-btn">
            {initialData && initialData.type === 'faculty' ? 'Update' : 'Add'}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default FacultyForm;