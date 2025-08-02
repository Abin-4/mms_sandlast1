import React, { useEffect, useState } from 'react';
import './QueryEntry.css';
import { adminAddQuaeyAPI, checkLesseeIdExists, getLastSerialNumberAPI, updateAdminData } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function QueryEntry() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    lesseeId: '',
    registrationHolderName: '',
    SerialNo: '',
    SerialEndNo: '',
    locationStockyard: '',
    dispatchNo: '',
    registrationHolderAddress: '',
    districtName: '',
    Taluk: '',
    village: '',
    sfNoExtent: '',
    classification: '',
    leasePeriod: '',
    startingTime: '',
    endTime: '',
    validityStockyard: '',
    transitSerialNo: '',
    purchaserName: '',
    purchaserAddress: '',
    mineralName: '',
    quantity: '',
    bulkPermitNo: '',
    signature: '',
    countStart:'',
    countEnd:''
  });

  // Fetch latest Serial No on component mount
  useEffect(() => {
    const fetchSerialNo = async () => {
      try {
        const response = await getLastSerialNumberAPI();
        if (response.status === 200) {
          const lastSerial = parseInt(response.data.data.SerialNo) || 0;
          const newSerial = lastSerial + 1;
          setFormData(prev => ({
            ...prev,
            SerialNo: newSerial.toString(),
            dispatchNo: newSerial.toString(),
          }));
        }
      } catch (error) {
        console.error("Error fetching serial number:", error);
        setFormData(prev => ({
          ...prev,
          SerialNo: '1',
          dispatchNo: '1',
        }));
      }
    };
    fetchSerialNo();
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;

  // List of fields that should be uppercase
  const uppercaseFields = [
    'bulkPermitNo',
    'transitSerialNo',
    'purchaserName',
    'purchaserAddress'
  ];

  // Convert to uppercase if field is in the uppercaseFields list
  const processedValue = uppercaseFields.includes(name) 
    ? value.toUpperCase() 
    : value;

  setFormData(prev => ({
    ...prev,
    [name]: processedValue,  // Use the processed value (uppercase if applicable)
    ...(name === 'SerialNo' && { dispatchNo: processedValue }) // Keep SerialNo and dispatchNo in sync
  }));
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          signature: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.lesseeId.trim()) {
        throw new Error('Register Number is required');
      }

      // Convert SerialNo to number, decrement by 1, then convert back to string
      const currentSerialNo = formData.SerialNo;
      const serialNoAsNumber = parseInt(currentSerialNo, 10);
      
      if (isNaN(serialNoAsNumber)) {
        throw new Error("Invalid serial number format");
      }

      if (serialNoAsNumber <= 0) {
        throw new Error("Serial number cannot be zero or negative");
      }

      const updatedSerialNo = String(serialNoAsNumber - 1).padStart(currentSerialNo.length, '0');

      // Prepare data for submission with decremented SerialNo
      const submissionData = {
        ...formData,
        SerialNo: updatedSerialNo,
        dispatchNo: updatedSerialNo, // Also update dispatchNo to match
        lesseeId: formData.lesseeId,
      };

      // Check if lessee exists
      const checkResponse = await checkLesseeIdExists(encodeURIComponent(formData.lesseeId));
      
      if (checkResponse.data.exists) {
        const shouldUpdate = window.confirm(
          `User with Lessee ID ${formData.lesseeId} already exists. Do you want to update?`
        );
        
        if (shouldUpdate) {
          const updateResponse = await updateAdminData(submissionData);
          if (updateResponse.status === 200) {
            alert("Data updated successfully");
            // Update the form to show the decremented value
            setFormData(prev => ({
              ...prev,
              SerialNo: updatedSerialNo,
              dispatchNo: updatedSerialNo,
            }));
            navigate('/');
            return;
          }
          throw new Error('Update failed');
        }
        return;
      }

      // For new users
      navigate('/register', {
        state: {
          newUserData: submissionData
        }
      });

    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lease-form-container">
      <h2>Lease Information</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div>
              <label>Register Number:</label>
              <input
                type="text"
                name="lesseeId"
                value={formData.lesseeId}
                onChange={handleChange}
                required
                placeholder=""
              />
            </div>

            <div>
              <label>Register Holder Name:</label>
              <input
                type="text"
                name="registrationHolderName"
                value={formData.registrationHolderName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Name and Address of the Register Holder:</label>
              <textarea
                style={{height: '80px'}}
                name="registrationHolderAddress"
                value={formData.registrationHolderAddress}
                onChange={handleChange}
                required
              />
            </div>

<div>
  <label>Name of Mineral/Mineral Products:</label>
  <select
    name="mineralName"
    value={formData.mineralName || ''} // Ensure controlled component
    onChange={handleChange}
    required
    className="input"
  >
    <option value="" disabled>Select Mineral</option> {/* Default empty option */}
    <option value="SAND">Sand</option>
    <option value="GRAVEL">Gravel</option>
  </select>
</div>
            <div>
              <label>Bulk Transit Pass No:</label>
              <input
                type="text"
                name="bulkPermitNo"
                value={formData.bulkPermitNo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>(Security paper) Serial Number:</label>
              <input
                type="number"
                name="SerialNo"
                value={formData.SerialNo}
                onChange={handleChange}
                min={formData.SerialNo}
                required
              />
            </div>

            <div>
              <label>(Security paper) End Serial Number:</label>
              <input
                type="number"
                name="SerialEndNo"
                value={formData.SerialEndNo}
                onChange={handleChange}
                min={formData.SerialNo}
              />
            </div>

             <div>
              <label>Count Number Start:</label>
              <input
                type="number"
                name="countStart"
                value={formData.countStart}
                onChange={handleChange}
                min={formData.countStart}
                required
              />
            </div>

            <div>
              <label>Count Number End</label>
              <input
                type="number"
                name="countEnd"
                value={formData.countEnd}
                onChange={handleChange}
                min={formData.countStart}
              />
            </div>
          </div>

          

          {/* Right Column */}
          <div className="form-column">
            <div>
              <label>Location of the Stockyard:</label>
              <input
                type="text"
                name="locationStockyard"
                value={formData.locationStockyard}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>SF.NO / Extent:</label>
              <input
                type="text"
                name="sfNoExtent"
                value={formData.sfNoExtent}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Village:</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Taluk Name:</label>
              <input
                type="text"
                name="Taluk"
                value={formData.Taluk}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>District Name:</label>
              <input
                type="text"
                name="districtName"
                value={formData.districtName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Validity of Stockyard:</label>
              <input
                type="text"
                name="validityStockyard"
                value={formData.validityStockyard}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Transit Pass Serial No:</label>
              <input
                type="text"
                name="transitSerialNo"
                value={formData.transitSerialNo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Signature of AD / DD:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.signature && (
                <img
                  src={formData.signature}
                  alt="Signature Preview"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              )}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default QueryEntry;
