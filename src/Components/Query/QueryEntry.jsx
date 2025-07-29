import React, { useEffect, useState } from 'react';
import './QueryEntry.css';
import { adminAddQuaeyAPI, checkLesseeIdExists, getLastSerialNumberAPI, updateAdminData } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function QueryEntry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lesseeId: '',
    registrationHolderName: '',
    SerialNo: '',
    SerialEndNo:'',
    locationStockyard:'',
    dispatchNo: '',
    registrationHolderAddress: '',
    districtName: '',
    Taluk: '',
    village: '',
    sfNoExtent: '',
    classification: '',
    leasePeriod: '',
startingTime:'',
endTime:'',
    validityStockyard: '',
transitSerialNo:'',
 purchaserName: '',
purchaserAddress:'',
    mineralName: '',
    quantity:'',
    bulkPermitNo: '',
    signature: '',
  });

  // Fetch latest Serial No on page load and set both SerialNo and dispatchNo
  useEffect(() => {
    const fetchSerialNo = async () => {
      try {
        const response = await getLastSerialNumberAPI();
        if (response.status === 200) {
          const lastSerial = parseInt(response.data.data.SerialNo) || 0;
          const newSerial = lastSerial + 1;
          const lastDispatch = parseInt(response.data.data.dispatchNo) || 0;
          const newDispatch = lastDispatch + 1;
          setFormData(prev => ({
            ...prev,
            SerialNo: newSerial.toString(),
            dispatchNo: newDispatch.toString(),
          }));
        } else {
          console.warn("No existing serial number found.");
          setFormData(prev => ({
            ...prev,
            SerialNo: '1',
            dispatchNo: '1',
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

    setFormData(prev => {
      if (name === 'SerialNo') {
        return {
          ...prev,
          SerialNo: value,
          dispatchNo: value,
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
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

  // Define the helper function at the top of handleSubmit
  const decrementWithLeadingZeros = (value) => {
    const num = parseInt(value, 10);
    const length = value.length;
    return String(num - 1).padStart(length, '0');
  };

  try {
    // First check if lesseeId exists - ensure it's treated as a string
    const checkResponse = await checkLesseeIdExists(String(formData.lesseeId));
    
    if (checkResponse.data.exists) {
      // If user exists, ask if they want to update
      const shouldUpdate = window.confirm(
       ` User with Lessee ID ${formData.lesseeId} already exists.\nDo you want to update the existing record?`
      );
      
      if (shouldUpdate) {
        const submissionData = {
          ...formData,
          SerialNo: decrementWithLeadingZeros(formData.SerialNo),
          dispatchNo: decrementWithLeadingZeros(formData.dispatchNo)
        };
        
        // Update existing user
        const updateResponse = await updateAdminData(submissionData);
        if (updateResponse.status === 200) {
          alert("User data updated successfully");
          navigate('/');
        } else {
          alert('Update failed. Please try again.');
        }
      }
      return;
    }

    // If user doesn't exist, navigate to register page with form data
    alert("new user add");
    navigate('/register', { 
      state: { 
        newUserData: {
          ...formData,
          registrationHolderName:formData.registrationHolderName,
          SerialNo: decrementWithLeadingZeros(formData.SerialNo),
          SerialEndNo: formData.SerialEndNo ? decrementWithLeadingZeros(formData.SerialEndNo) : '',
          dispatchNo: decrementWithLeadingZeros(formData.dispatchNo),
          lesseeId: String(formData.lesseeId).padStart(String(formData.lesseeId).length, '0')
        }
      } 
    });
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error occurred while processing your request.');
  }
};// Add this new API function to your allAPI.js
// Add this new API function to your allAPI.js
  return (
    <div className="lease-form-container">
      <h2>Lease Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* LEFT COLUMN */}
          <div className="form-column">
   
            <div>
              <label>Register Number:</label>
              <input type="text" name="lesseeId" value={formData.lesseeId} onChange={handleChange} />
            </div>

            <div>
              <label>Register Holder Name:</label>
              <input type="text" name="registrationHolderName" value={formData.registrationHolderName} onChange={handleChange} />
            </div>

            <div>
              <label>Name and Address of the Register Holder:</label>
   <textarea 
                style={{height:'80px'}} 
                name="registrationHolderAddress" 
                value={formData.registrationHolderAddress} 
                onChange={handleChange} 
              />            </div>

            <div>
              <label>Name of Minaral/Minaral Products :</label>
              <input name="mineralName" value={formData.mineralName} onChange={handleChange} />
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
                  <label> (Security paper)Serial Number:</label>
                  <input
                    type="number"
                    name="SerialNo"
                    value={formData.SerialNo}
                    onChange={handleChange}
                    min={formData.SerialNo}
                  />
                </div>

              <div className="range-group">
                <div>
                  <label>(Security paper)End Serial Number:</label>
                  <input
                    type="number"
                    name="SerialEndNo"
                    value={formData.SerialEndNo}
                    onChange={handleChange}
                    min={formData.SerialNo}
                  />
                </div>
              </div>


           
          </div>

          {/* RIGHT COLUMN */}
          <div className="form-column">
            <div>
              <label>Location of the Stockyard:</label>
              <input type="text" name="locationStockyard" value={formData.locationStockyard} onChange={handleChange} />
            </div>
            <div>
              <label>SF.NO / Extent:</label>
              <input type="text" name="sfNoExtent" value={formData.sfNoExtent} onChange={handleChange} />
            </div>
                        <div>
              <label>Village:</label>
              <input type="text" name="village" value={formData.village} onChange={handleChange} />
            </div>


            <div>
              <label>Taluk Name:</label>
              <input type="text" name="Taluk" value={formData.Taluk} onChange={handleChange} />
            </div>
            <div>
              <label>District Name:</label>
              <input type="text" name="districtName" value={formData.districtName} onChange={handleChange} />
            </div>



            <div>
              <label>Validity of Stockyard:</label>
              <input type="text" name="validityStockyard" value={formData.validityStockyard} onChange={handleChange} />
            </div>

            
            <div>
              <label>Transit Pass Serial No:</label>
              <input type="text" name="transitSerialNo" value={formData.transitSerialNo} onChange={handleChange} />
            </div>
          
          
            <div>
              <label>Signature of AD / DD:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.signature && (
                <img
                  src={formData.signature}
                  alt="Preview"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              )}
            </div>

          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default QueryEntry;