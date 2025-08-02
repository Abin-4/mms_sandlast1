import React, { useEffect, useState, useRef } from 'react';
import { querySingleGetAPI, updateAdminData } from '../../Server/allAPI';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './UserLast.css';

function UserLast() {
  const { id } = useParams();
    const location = useLocation();
  
    const { userId } = location.state || {};

  const navigate = useNavigate();
  const [lastEmployee, setLastEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setEditedData] = useState({
    registrationHolderName: "",
    registrationHolderAddress: "",
    SerialNo: "",
    bulkPermitNo: "",
    districtName: "",
    Taluk: "",
    village: "",
    sfNoExtent: "",
    mineralName: "",
    quantity: "",
    locationStockyard: "",
    validityStockyard: "",
    transitSerialNo: "", 
    purchaserName: "",
    purchaserAddress: "",
    fullname: "",
    destinationState: "",
    driverName: "",
    requiredTime: "",
    totalDistance: "",
    travellingDate: "",
    vehicleNo: "",
    lesseeId: "",
    classification: "",
    leasePeriod: "",
  });
  const printRef = useRef();

  useEffect(() => {
    const fetchLastEmployee = async () => {
      try {
        setLoading(true);
        const response = await querySingleGetAPI(id);
        
        if (!response.data) {
          setError('No employee data found');
          return;
        }
        setLastEmployee(response.data);
        setEditedData({
          registrationHolderName: response.data.registrationHolderName || "",
          registrationHolderAddress: response.data.registrationHolderAddress || "",
          SerialNo: response.data.SerialNo || "",
          bulkPermitNo: response.data.bulkPermitNo || "",
          districtName: response.data.districtName || "",
          Taluk: response.data.Taluk || "",
          village: response.data.village || "",
          sfNoExtent: response.data.sfNoExtent || "",
          mineralName: response.data.mineralName || "",
          quantity: response.data.quantity || "",
          locationStockyard: response.data.locationStockyard || "",
          validityStockyard: response.data.validityStockyard || "",
          transitSerialNo: response.data.transitSerialNo || "", 
          purchaserName: response.data.purchaserName || "",
          purchaserAddress: response.data.purchaserAddress || "",
          fullname: response.data.fullname || "",
          destinationState: response.data.destinationState || "",
          driverName: response.data.driverName || "",
          requiredTime: response.data.requiredTime || "",
          totalDistance: response.data.totalDistance || "",
          travellingDate: response.data.travellingDate || "",
          vehicleNo: response.data.vehicleNo || "",
          lesseeId: response.data.lesseeId || "",
          classification: response.data.classification || "",
          leasePeriod: response.data.leasePeriod || "",
          signature: response.data.signature || "",
          time: response.data.time || "",
          formattedTravellingDate: response.data.formattedTravellingDate || "",
          userId:response.data._id

        });
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchLastEmployee();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({
      ...lastEmployee
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSaveClick = async () => {
  try {
    // You might want to save the data first before navigating
    // await updateAdminData(id, editedData);
    
    // Navigate to userview page with state
    navigate('/userview2', { state: { userData,adminId:userId} });
  } catch (err) {
    console.error('Error saving data:', err);
    setError('Failed to save changes');
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading employee data...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Retry
      </button>
    </div>
  );

  if (!lastEmployee) return (
    <div className="no-data-container">
      <p>No employee data found</p>
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="user-last-container">
      <div className="header-section">
        <h1>Employee Dispatch Details</h1>
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSaveClick} className="btn btn-save">
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button onClick={handleCancelClick} className="btn btn-cancel">
                <i className="fas fa-times"></i> Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEditClick} className="btn btn-edit">
              <i className="fas fa-edit"></i> Edit Details
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div ref={printRef} className="content-container">
        {/* Serial Information Section */}
        <div className="card serial-section">
          <div className="card-header">
            <h2>Serial Information</h2>
          </div>
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Start Serial No:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="SerialNo"
                    value={userData.SerialNo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.SerialNo || 'N/A'}</span>
                )}
              </div>
           
              <div className="detail-row">
                <span className="detail-label">Transit Serial No:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="transitSerialNo"
                    value={userData.transitSerialNo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.transitSerialNo || 'N/A'}</span>
                )}
              </div>
           
              {!isEditing && lastEmployee.SerialNo && (
                <div className="qr-container">
                  <QRCodeSVG 
                    value={lastEmployee.SerialNo} 
                    size={120}
                    level="H"
                    fgColor="#2c3e50"
                  />
                  <p className="qr-label">Scan this QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User/Lessee Details Section */}
        <div className="card">
          <div className="card-header">
            <h2>User / Lessee Details</h2>
          </div>
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Lessee Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="registrationHolderName"
                    value={userData.registrationHolderName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.registrationHolderName || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Lessee ID:</span>
                <span className="detail-value">{lastEmployee.lesseeId || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lessee Address:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="registrationHolderAddress"
                    value={userData.registrationHolderAddress}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.registrationHolderAddress || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={userData.fullname}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.fullname || 'N/A'}</span>
                )}
              </div>
             
            </div>
          </div>
        </div>

        {/* Permit & Mineral Details Section */}
        <div className="card">
          <div className="card-header">
            <h2>Permit & Mineral Details</h2>
          </div>
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Bulk Permit No:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="bulkPermitNo"
                    value={userData.bulkPermitNo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.bulkPermitNo || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Mineral Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="mineralName"
                    value={userData.mineralName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.mineralName || 'N/A'}</span>
                )}
              </div>
            
             
              <div className="detail-row">
                <span className="detail-label">Location Stockyard:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="locationStockyard"
                    value={userData.locationStockyard}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.locationStockyard || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Validity Stockyard:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="validityStockyard"
                    value={userData.validityStockyard}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.validityStockyard || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="card">
          <div className="card-header">
            <h2>Location Details</h2>
          </div>
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">District:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="districtName"
                    value={userData.districtName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.districtName || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Taluk:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="Taluk"
                    value={userData.Taluk}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.Taluk || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Village:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="village"
                    value={userData.village}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.village || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">SF No & Extent:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="sfNoExtent"
                    value={userData.sfNoExtent}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.sfNoExtent || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Purchaser Details Section */}
        <div className="card">
          <div className="card-header">
            <h2>Purchaser Details</h2>
          </div>
          <div className="card-body">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Purchaser Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="purchaserName"
                    value={userData.purchaserName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.purchaserName || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Purchaser Address:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="purchaserAddress"
                    value={userData.purchaserAddress}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.purchaserAddress || 'N/A'}</span>
                )}
              </div>
              <div className="detail-row">
                <span className="detail-label">Destination State:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="destinationState"
                    value={userData.destinationState}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <span className="detail-value">{lastEmployee.destinationState || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch & Vehicle Details Section */}
        <div className="card">
          <div className="card-header">
            <h2>Dispatch & Vehicle Details</h2>
          </div>
          <div className="card-body">
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
<tbody>
  {/* Vehicle Details */}
  <tr>
    <td>Vehicle No</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="vehicleNo"
          value={userData.vehicleNo}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.vehicleNo || 'N/A'
      )}
    </td>
  </tr>

  {/* Quantity and Distance */}
  <tr>
    <td>Quantity (MT)</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="quantity"
          value={userData.quantity}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.quantity || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Total Distance</td>
    <td>{lastEmployee.totalDistance || 'N/A'}</td>
  </tr>

  {/* Driver Information */}
  <tr>
    <td>Driver Name</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="driverName"
          value={userData.driverName}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.driverName || 'N/A'
      )}
    </td>
  </tr>

  {/* Time Information */}
  <tr>
    <td>Start Time</td>
    <td>
      {isEditing ? (
        <input
          type="datetime-local"
          name="travellingDate"
          value={userData.travellingDate}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        formatDate(lastEmployee.travellingDate)
      )}
    </td>
  </tr>
  <tr>
    <td>End Time</td>
    <td>
      {isEditing ? (
        <input
          type="datetime-local"
          name="requiredTime"
          value={userData.requiredTime}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        formatDate(lastEmployee.requiredTime)
      )}
    </td>
  </tr>

  {/* Lessee Information */}

  <tr>
    <td>Lessee Address</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="registrationHolderAddress"
          value={userData.registrationHolderAddress}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.registrationHolderAddress || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Lessee ID</td>
    <td>{lastEmployee.lesseeId || 'N/A'}</td>
  </tr>

  {/* Permit Information */}
  <tr>
    <td>Bulk Permit No</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="bulkPermitNo"
          value={userData.bulkPermitNo}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.bulkPermitNo || 'N/A'
      )}
    </td>
  </tr>

  {/* Location Information */}
  <tr>
    <td>District</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="districtName"
          value={userData.districtName}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.districtName || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Taluk</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="Taluk"
          value={userData.Taluk}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.Taluk || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Village</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="village"
          value={userData.village}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.village || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>SF No & Extent</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="sfNoExtent"
          value={userData.sfNoExtent}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.sfNoExtent || 'N/A'
      )}
    </td>
  </tr>

  {/* Mineral Information */}
  <tr>
    <td>Mineral Name</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="mineralName"
          value={userData.mineralName}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.mineralName || 'N/A'
      )}
    </td>
  </tr>


  {/* Stockyard Information */}
  <tr>
    <td>Location Stockyard</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="locationStockyard"
          value={userData.locationStockyard}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.locationStockyard || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Validity Stockyard</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="validityStockyard"
          value={userData.validityStockyard}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.validityStockyard || 'N/A'
      )}
    </td>
  </tr>

  {/* Purchaser Information */}
  <tr>
    <td>Purchaser Name</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="purchaserName"
          value={userData.purchaserName}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.purchaserName || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Purchaser Address</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="purchaserAddress"
          value={userData.purchaserAddress}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.purchaserAddress || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Full Name</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="fullname"
          value={userData.fullname}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.fullname || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Destination State</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="destinationState"
          value={userData.destinationState}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.destinationState || 'N/A'
      )}
    </td>
  </tr>
  <tr>
    <td>Transit Serial No</td>
    <td>
      {isEditing ? (
        <input
          type="text"
          name="transitSerialNo"
          value={userData.transitSerialNo}
          onChange={handleInputChange}
          className="form-control"
        />
      ) : (
        lastEmployee.transitSerialNo || 'N/A'
      )}
    </td>
  </tr>
</tbody>  
</table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLast;