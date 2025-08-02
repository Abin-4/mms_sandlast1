import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './UserView.css';
import {
  adminQuaeyIdupdateAPI,
  adminAddQuaeyByIdAPI,
  queryDataAPI,
} from '../../Server/allAPI';
import { useLocation, useNavigate } from 'react-router-dom';

function UserView2() {
  const navigate = useNavigate();
  const location = useLocation();
const { userData,adminId} = location.state || {};  

console.log(adminId);

  const userId = userData?.userId
  const serialNumber = userData?.SerialNo || '';
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCount, setCurrentCount] = useState(0); // Track current count
  const printRef = useRef();

  // Initialize data from location state or fetch if needed
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (userData) {
          // Use data passed from previous screen
          setQueryData(userData);
          // Initialize currentCount with countStart if available
          if (userData.countStart) {
            setCurrentCount(parseInt(userData.countStart));
          }
        } else if (adminId) {
          // Fetch data if not passed via location state
          const response = await adminAddQuaeyByIdAPI(adminId);
          console.log(response.data,"fetch data");
          
          if (response.data) {
            setQueryData(response.data);
            // Initialize currentCount with countStart if available
            if (response.data.countStart) {
              setCurrentCount(parseInt(response.data.countStart));
            }
          } else {
            throw new Error("No data received from server");
          }
        } else {
          throw new Error("No user ID or preview data available");
        }
      } catch (err) {
        console.error('Data initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [adminId, userData]);

  const refreshPage = () => {
    navigate(0); // Reload current page
  };

  const handleAfterPrint = async () => {
    try {
      if (!queryData) {
        throw new Error("No query data available");
      }

      const lastAdminResponse = await adminAddQuaeyByIdAPI(adminId);
      if (!lastAdminResponse?.data) {
        throw new Error("Failed to fetch last admin data");
      }

      const lastAdmin = lastAdminResponse.data;
      if (!lastAdmin?._id) {
        throw new Error("No valid admin ID found");
      }

      // Increment currentCount after each print
      const newCount = currentCount + 1;
      setCurrentCount(newCount);

  const updatedData ={
    currentCount:currentCount
  }

      const response = await adminQuaeyIdupdateAPI(adminId, updatedData);
      
      if (response.status >= 200 && response.status < 300) {
        setQueryData(updatedData);
        // Check if we've reached countEnd
        if (queryData.countEnd && newCount >= parseInt(queryData.countEnd)) {
          alert("Printing completed. Reached the maximum count.");
          return;
        }
        refreshPage();
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (err) {
      console.error('Failed to update serial number:', err);
      setError(`Update failed: ${err.message}`);
    }
  };


  const handlePrint = async () => {
   try {
      if (!printRef.current || !queryData) {
        throw new Error('No data available to print');
      }

      // Check if we've reached countEnd
      if (queryData.countEnd && currentCount >= parseInt(queryData.countEnd)) {
        alert("Printing completed. Reached the maximum count.");
        return;
      }

   
      try {
        const response = await queryDataAPI(userData);
        console.log(response.data,"se");
        
        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Failed to save query data');
        }
        console.log('Data saved to query API:', response.data);
      } catch (apiError) {
        console.error('Error saving to query API:', apiError);
      }

         const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups for printing');
      }
    printWindow.document.write(`
<html>
        <head>
          <title>Print Document</title>
          <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

          <style>
            @page { 
              size: A4; 
              margin: 2mm; /* Reduced margin for more space */
              margin-left:71px
               
            }
              body{
               font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
  font-variation-settings:

    "wdth" 100;
      
   }
             
              body, h5, p {
              font-weight:bold;
             font-sty
              margin-Top:20px;
             padding:3;
             
            
}
              
            }

            .print-table-container {
              height: auto !important;
              page-break-inside: avoid;
            
            }
              .generate-number{
               color: rgb(87, 84, 84);
               gap:20px;
               font-size:18px;
               
            }
              .generate-number {
               color: rgb(87, 84, 84);
  font-weight: 350;
  font-style: normal;
  font-size:18px;
              }
  .serial{
   font-family: "DotGothic16";
  font-weight: 650;
  font-style: italic;
  transform: skewX(-5deg);
  font-size:4px
  letter-spacing:50px;
  gap:12px;
  color: #b8b3b3;
}
            .query-table {
              width: 628px;
              border-collapse: collapse;
              font-size: 8px;
              border:1.3pt solid black;
              margin:right:20px
               box-shadow: 0 0 0 0.7pt black !important;
               
               justtify-content:center;
            }
              
               
            .query-table td {
              border: 1.3pt solid black;
              padding: 4.9px; /* Reduced padding */
              line-height: 1.2;
              font-weight:570;
              box-shadow: 0 0 0 0.5pt black !important;
              font-size:9px;
             color: rgb(0, 0, 0);
            }
              .query-table input[type="text"] {
              
    font-size: 9px;
    color: green;
    font-weight: bolder;
    line-height: 1.2;
    padding: 4px; /* Optional: to match your td padding */
    border: 0.5px solid black; /* Optional: to match the table cell border */
}
            .header-info p {
              margin: 2px 0;
              font-size: 10px;
              font-weight:normal;
               font-weight:500;
            }
            .qr-container{
          color: 1px solid black;
            filter: brightness(1.8);
          }
        
  
          </style>
        </head>
        <body>
          <div class="print-table-container">
            ${printRef.current.innerHTML}
          </div>
         <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // Only after printing is done, notify parent window
                window.opener.postMessage('printCompleted', '*');
                window.close();
              }, 500);
            };
          </script>

        </body>
      </html>    `);
    printWindow.document.close();

    // Listen for print completion message
    window.addEventListener('message', (e) => {
      if (e.data === 'printCompleted') {
        // Only now increment the serial number
        handleAfterPrint();
      }
    });

  } catch (err) {
    console.error('Print error:', err);
    setError('Failed to print document');
  }
};



  const renderTable = (data, isDuplicate = false) => (
    <div className="fontc table-wrapper" style={isDuplicate ? { marginTop: '100px' ,} : {}}>

      <div className='img' style={{display:'flex', marginTop:'80px',marginLeft:'452px'}} >
        <div className='generatediv' style={{ width: '100px'}}>
<h4 style={{marginLeft:'-15px',marginTop:'15px',fontSize:'14px', fontWeight:'600',letterSpacing:'0px'}} className="generate-number" >{`TSPS${userData.SerialNo}`}</h4>
        </div>
{serialNumber && (
  <div style={{marginLeft:'19px',fontWeight:'1000', }}>
    <QRCodeSVG 
value={`${data.bulkPermitNo},${data.mineralName}(${userData.quantity}MT),${userData.travellingDate
      ? new Date(userData.travellingDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',  
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        .replace(/\//g, '-')
        .replace(',', '')    
      : '-'},${data.transitSerialNo},${userData.vehicleNo},${userData.purchaserAddress}`} size={49}
      level="H"
      fgColor='#000000'
      className="qr-container"
      
    />
  </div>
)}      </div>
      <div style={{display:'flex'}} className="header-info">
<p
  style={{
    marginLeft: isDuplicate ? '272px' : '280px', // different margins
    color: isDuplicate ? 'black' : 'black',
  
   
  }}
>
  {isDuplicate ? "Duplicate" : "Original"}
</p>

  <p style={{ marginLeft: '107px', }}>
  Date & Time of Dispatch: {userData.travellingDate
      ? new Date(userData.travellingDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',  
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .replace(/\//g, '-')
        .replace(',', '')    
      : '-'}
</p>


      </div>
      <div className='text'>
      <table style={{marginTop:'-3px'}} className="query-table">
        <tbody className="table-body">
          <tr>
            <td style={{width:'107px'}}>Register Number : </td>
            <td style={{width:'95px'}}> {userData.lesseeId}</td>
            <td style={{width:'95px'}}>Location of Stockyard : </td>
            <td style={{width:'95px'}}>{userData.locationStockyard}</td>
          </tr>
            <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top',maxWidth:'35px'}} colSpan="2" rowSpan="3">Name and Address of the Register Holder :
              <br />
              {userData.registrationHolderName}
              <br />
              {userData.registrationHolderAddress}
              </td>
            <td>SF.No / Extent :</td>
            <td>{userData.sfNoExtent}</td>
          </tr>
          {/* <tr>
            <td>District Name :</td>
            <td>{data.districtName}</td>
          </tr> */}
        
          <tr>
            <td>Village</td>
            <td>{userData.village}</td>
          </tr>
          <tr>
            <td>Taluk Name :</td>
            <td>{userData.Taluk}</td>
          </tr>
          <tr>
            <td>Name of Mineral / Mineral Products : </td>
            <td>{userData.mineralName}</td>
            <td>District :</td>
            <td>{userData.districtName}</td>
          </tr>
          <tr>
            <td >Quantity(in MT) : </td>
            <td>{userData.quantity}</td>
            <td>Validity of Stockyard :</td>
            <td>{userData.validityStockyard}</td>
          </tr>
          <tr>
            <td>Bulk Transist Pass No:</td>
            <td>{userData.bulkPermitNo}</td>
            <td>Security Papper Serial No</td>
            <td>{`TSPS${userData.SerialNo}`}</td>
          </tr>
          <tr>
            <td>Vehicle No :</td>
            <td>{userData.vehicleNo}</td>
            <td >Transist Pass Serial No :</td>
            <td>{userData.transitSerialNo}</td>
          </tr>
          <tr>
            <td>Approximate Distance :</td>
            <td>{userData.totalDistance}</td>
            <td  >Name of Purchaser{userData.destinationAddress}</td>
            <td>{userData.purchaserName}</td>
          </tr>
          {/* <tr>
            <td>Total Distance (in Kms) :</td>
            <td>{data.totalDistance}</td>
            Address of the Purchaser :{}
          </tr> */}
         <tr>
  <td>Time Start :</td>
  <td>
    {userData.travellingDate
      ? new Date(userData.travellingDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        .replace(/\//g, '-')
        .replace(',', '')    
      : '-'}
  </td>
          <td  style={{ textAlign: 'left', verticalAlign: 'top',maxWidth:'35px'}} colSpan={"3"} rowSpan={"3"}> Address of the Purchaser : 
            <br />
            {userData.purchaserAddress}</td>   

</tr>
<tr>
  <td>Time End :</td>
  <td>
    {userData.travellingDate && userData.requiredTime ? (() => {
      const start = new Date(userData.travellingDate);
      const end = new Date(userData.requiredTime);
      const diffMs = end - start;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60)); // rounded hours

      const formatted = end
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        .replace(/\//g, '-')
        .replace(',', '');

      return`  ${formatted}`;
    })() : '-'}
  </td>
</tr>

          <tr>
            <td>Name of Vehicle Driver:</td>
            <td>{userData.driverName}</td>
          </tr>
          <tr>
                        <td>Destination and State</td>
            <td>{userData.destinationState}</td>
    <td style={{ textAlign: 'left', verticalAlign: 'top'}}>Signature of AD / DD :</td>
            <td>
              {userData.signature ? 
                <img src={userData.signature} alt="AD Signature" style={{ maxHeight: '26px' }} /> : 
                'N/A'}
            </td>          </tr>
          <tr style={{height:'40px'}}>
            <td style={{ textAlign: 'left', verticalAlign: 'top'}} >Driver Signature :</td>
            <td>
             
            </td>
            <td style={{ textAlign: 'left', verticalAlign: 'top'}}>Registree signature:</td>
            <td>
            
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );

  if (loading) return <div className="container"><p className="loading">Loading data...</p></div>;
  if (error || !queryData) return <div className="container"><p className="error-message">{error || 'No data available'}</p></div>;

  return (
    <div className="container">
      {/* Printable content (hidden) - contains both tables */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={printRef}>
          {renderTable(queryData)}
          {renderTable(queryData, true)}
        </div>
      </div>

      {/* Visible content */}
      <div className="section">
        {renderTable(queryData)}
        {renderTable(queryData, true)}
      </div>

      {/* Action buttons */}
      <div className="print-button-container no-print">
 <button 
        onClick={handlePrint} 
        disabled={queryData?.countEnd && currentCount >= parseInt(queryData.countEnd)}
      >
        {queryData?.countEnd && currentCount >= parseInt(queryData.countEnd) 
          ? 'Printing Completed' 
          : 'Print'}
      </button>        
         
      
      
      </div>

      {/* Image preview */}
     
    </div>
  );
}

export default UserView2
