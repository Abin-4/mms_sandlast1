import React, { useState, useEffect } from 'react';
import './UserDispatch.css';
import { adminAddQuaeyByIdAPI, updateAdminData } from '../../Server/allAPI';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDispatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
console.log(userData);

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Define initial form state
  const initialFormState = {
    // deliveredTo: '',
    vehicleNo: '',
    // vehicleType: '',
    totalDistance: '', // approximate distance 
    travellingDate: getCurrentDateTime(),
    requiredTime: '',
    quantity: '',
    driverName: '', // name of  vehicle driver
     destinationState:'', // destination and state
       purchaserName: '',

 purchaserAddress: '', // address of the purchaser

  };

  const [autoDate, setAutoDate] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);

const vehicleNo = formData.vehicleNo
const totalDistance = formData.totalDistance
  const travellingDate = formData.travellingDate
  const quantity = formData.quantity
  const driverName = formData.driverName
const requiredTime = formData.requiredTime
const destinationState= formData.destinationState
const purchaserName = formData.purchaserName
const purchaserAddress = formData.purchaserAddress
  // Fetch user-specific data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!userData?.id) {
          alert('User data not available. Please login again.');
          navigate('/');
          return;
        }

        // Fetch user-specific data using their id
        const response = await adminAddQuaeyByIdAPI(userData.id);
        console.log(response.data);
        
        if (response.data) {
          setUserDetails(response.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData, navigate]);

  // Auto-update date time
  useEffect(() => {
    if (autoDate) {
      const interval = setInterval(() => {
        setFormData(prev => ({
          ...prev,
          travellingDate: getCurrentDateTime()
        }));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [autoDate]);

  // Calculate required time based on distance
  useEffect(() => {
    if (formData.totalDistance) {
      const distance = parseFloat(formData.totalDistance);
      if (!isNaN(distance)) {
        const now = new Date(formData.travellingDate);
        const travelTimeInHours = distance / 50;
        const travelTimeInMs = travelTimeInHours * 60 * 60 * 1000;
        const requiredDateTime = new Date(now.getTime() + travelTimeInMs);
        const offset = requiredDateTime.getTimezoneOffset();
        const local = new Date(requiredDateTime.getTime() - offset * 60000);
        const formattedTime = local.toISOString().slice(0, 16);
        setFormData(prev => ({
          ...prev,
          requiredTime: formattedTime
        }));
      }
    }
  }, [formData.totalDistance, formData.travellingDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails) {
      alert('User data is not loaded yet. Please wait...');
      return;
    }

    try {
      setLoading(true);

      // Get current numbers with leading zeros
      const currentSerialStr = userDetails.SerialNo || '000001';
      const currentDispatchStr = userDetails.dispatchNo || '000001';
      const serialEndStr = userDetails.SerialEndNo || '999999';

      // Parse as numbers for comparison
      const currentSerial = parseInt(currentSerialStr, 10);
      const currentDispatch = parseInt(currentDispatchStr, 10);
      const serialEnd = parseInt(serialEndStr, 10);

      if (serialEnd > 0 && currentSerial >= serialEnd) {
        alert('Serial number range exhausted. Contact admin.');
        return;
      }

      // Calculate next numbers with leading zeros
      const nextSerial = String(currentSerial + 1).padStart(currentSerialStr.length, '0');
      const nextDispatch = String(currentDispatch + 1).padStart(currentDispatchStr.length, '0');
console.log(nextSerial,"seral in userdispatch page");

      // Prepare data for preview (not saving to DB yet)
      const previewData = {
        ...formData,
        ...userDetails,
        userId: userData.id,
        lesseeId: userData.lesseeId,
        SerialNo: nextSerial,
        dispatchNo: nextDispatch,
        createdAt: new Date().toISOString(),
        status: 'pending' // Mark as pending until printed
      };
console.log(previewData,"preview data in userdispatch page");

      // Navigate to view page with preview data
// In handleSubmit function, modify the navigate call:
navigate('/userview', {
  state: {
    previewData: previewData,
    vehicleNo:vehicleNo,
    totalDistance:totalDistance,
    quantity:quantity,
    driverName:driverName,
    destinationState:destinationState,
    purchaserName:purchaserName,
    purchaserAddress:purchaserAddress,
    travellingDate :travellingDate,
    requiredTime:requiredTime,
    userData: {  // Ensure consistent structure
      data: {
        _id: userData.id,  // Map to expected structure
        ...userData
      }
    }
  }
});
    } catch (error) {
      console.error('Error preparing dispatch:', error);
      alert('Failed to prepare dispatch');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <div className="dispatch-container">Loading data...</div>;
  }
    if (loading) {
    return <div className="dispatch-container">Loading data...</div>;
  }

  return (
    <div className="dispatch-container">
      <h2>Dispatch For</h2>

     
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Dispatch form fields */}

          <div style={{marginLeft:'-0px',marginTop:'-0px'}} >
            <label >Quantity (in MT):</label>
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="input" />
          </div>


          <div>
            <label>Vehicle No:</label>
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="input" />
          </div>


          <div>
            <label>Approximate Distance :</label>
            <input
              type="text"
              name="totalDistance"
              value={formData.totalDistance}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div  style={{marginLeft:'90px'}}>
            <label>Time Start:</label>
            <div className="flex items-center gap-2 mb-1">
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={autoDate}
                  onChange={() => setAutoDate(true)}
                /> Auto
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={!autoDate}
                  onChange={() => setAutoDate(false)}
                /> Manual
              </label>
            </div>
            <input
              type="datetime-local"
              name="travellingDate"
              value={formData.travellingDate}
              onChange={handleChange}
              readOnly={autoDate}
              className="input"
            />
          </div>

          <div style={{marginTop:'130px',marginLeft:'50px'}}>
            <label >Time End:</label>
            <input
              type="datetime-local"
              name="requiredTime"
              value={formData.requiredTime}
              readOnly
              className="input"
            />
          </div>


          <div style={{marginTop:'10px',marginLeft:'30px'}}>
            <label>Name of Vehicle Driver:</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} className="input" />
          </div>

          <div style={{marginTop:'10px'}}>
            <label>Destination and State:</label>
            <input type="text" name="destinationState" value={formData.destinationState} onChange={handleChange} className="input" />
          </div>

          <div>
            <label style={{marginTop:'10px'}}>Name of the Purchaser:</label>
            <input type="text" name="purchaserName" value={formData.purchaserName} onChange={handleChange} className="input" />
          </div>

          <div  style={{marginLeft:'30px'}}>
            <label>Address of the Purchaser :</label>
            <input type="text" name="purchaserAddress" value={formData.purchaserAddress} onChange={handleChange} className="input" />
          </div>


        </div>

  <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>      </form>
    </div>
  );
}

export default UserDispatch;