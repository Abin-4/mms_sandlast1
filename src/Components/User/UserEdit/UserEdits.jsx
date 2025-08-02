import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateAdminData } from '../../../Server/allAPI';
import './UserEdits.css';

function UserEdits() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure with proper checks
  const { 
    userData = null, 
    lesseeId = '',
    fromPage = '/userdispatch'
  } = location.state || {};

  const [formData, setFormData] = useState({
    bulkPermitNo: '',
    transitSerialNo: '',
    SerialNo: '',
    SerialEndNo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userData) {
      setError("User data not available. Please select a record to edit.");
      return;
    }

    setFormData({
      bulkPermitNo: userData.bulkPermitNo || '',
      transitSerialNo: userData.transitSerialNo || '',
      SerialNo: userData.SerialNo || '',
      SerialEndNo: userData.SerialEndNo || ''
    });
  }, [userData]);

 const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert all input values to uppercase
    const upperValue = typeof value === 'string' ? value.toUpperCase() : value;
    setFormData(prev => ({
      ...prev,
      [name]: upperValue
    }));
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);
  setSuccess(false);

  try {
    // Validation
    if (!formData.bulkPermitNo || !formData.transitSerialNo || 
        !formData.SerialNo || !formData.SerialEndNo) {
      throw new Error("All fields are required");
    }

    // Convert SerialNo to number, decrement by 1, then convert back to string
    const currentSerialNo = formData.SerialNo;
    const serialNoAsNumber = parseInt(currentSerialNo, 10);
    
    if (isNaN(serialNoAsNumber)) {
      throw new Error("Invalid serial number format");
    }

    const updatedSerialNo = String(serialNoAsNumber - 1).padStart(currentSerialNo.length, '0');

    const updateData = {
      ...userData,
      ...formData,
      SerialNo: updatedSerialNo, // Use the decremented value
      lesseeId: userData.lesseeId || lesseeId
    };

    const response = await updateAdminData(updateData);

    if (response.status === 200) {
      setSuccess(true);
      setTimeout(() => {
        // Navigate back with the updated data (including decremented SerialNo)
        navigate(fromPage, { 
          state: { 
            userData: {
              ...(response.data.updatedUser || updateData),
              SerialNo: updatedSerialNo // Ensure the decremented value is passed back
            },
            success: "Data updated successfully!" 
          } 
        });
      }, 1500);
    } else {
      throw new Error(response.data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Update error:', error);
    setError(error.message || 'An error occurred during update');
  } finally {
    setIsSubmitting(false);
  }
};
  if (!userData) {
    return (
      <div className="edit-container">
        <h2>Edit Transit Details</h2>
        <div className="alert alert-danger">
          {error || "User data not available. Please go back and select a record to edit."}
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(fromPage)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <h2>Edit Transit Details</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Data updated successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bulkPermitNo">Bulk Transit Pass No</label>
          <input
            type="text"
            id="bulkPermitNo"
            name="bulkPermitNo"
            value={formData.bulkPermitNo}
            onChange={handleChange}
            required
            disabled={isSubmitting}
             style={{ textTransform: 'uppercase' }} // Visual feedback
          />
        </div>

        <div className="form-group">
          <label htmlFor="transitSerialNo">Transit Pass Serial No</label>
          <input
            type="text"
            id="transitSerialNo"
            name="transitSerialNo"
            value={formData.transitSerialNo}
            onChange={handleChange}
            required
            disabled={isSubmitting}
                         style={{ textTransform: 'uppercase' }} // Visual feedback

          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="SerialNo">Security Paper Serial Start</label>
            <input
              type="text"
              id="SerialNo"
              name="SerialNo"
              value={formData.SerialNo}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="SerialEndNo">Security Paper Serial End</label>
            <input
              type="text"
              id="SerialEndNo"
              name="SerialEndNo"
              value={formData.SerialEndNo}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(fromPage, { state: { userData } })}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserEdits;