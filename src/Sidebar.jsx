// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import VehicleManagement from './Components/VehicleManagement';
import VehicleList from './Components/VehicleList';

const Sidebar = () => {
  const navigate = useNavigate()
  const [showVehicleManagement, setShowVehicleManagement] = useState(false);
  const [showDispatchList, setShowDispatchList] = useState(false); // <-- Step 2: State

  const handleVehicleManagementClick = (e) => {
    e.preventDefault();
    setShowVehicleManagement(!showVehicleManagement);
    setShowDispatchList(false); // Hide Dispatch List if Vehicle Management is shown
  };

  // const handleDispatchListClick = (e) => {
  //   e.preventDefault();
  //   setShowDispatchList(!showDispatchList);
  //   setShowVehicleManagement(false); // Hide Vehicle Management if Dispatch List is shown
  // };


  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>MIMAS-MM</h2>
        <ul>
          <h5>SAND</h5>
          
          <Link to={'/queryentry'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          <li>Apply New</li>
          </Link>

                    <Link to={'/adminlist'}   style={{  color: '#333',  textDecoration: 'none',}}>
            <li>Uer List</li>

          </Link>


          <Link to={'/adminlast'}   style={{  color: '#333',  textDecoration: 'none',}}>
            <li>Admin Last Data</li>

          </Link>


          
          
         
             <Link to={'/alluser'}
           style={{  color: '#333',  textDecoration: 'none',}}>
          <li> All User Datas</li>
          </Link>
      
        
       
        
                   

          {/* <li>
            <a href="#" onClick={handleDispatchListClick}>
              Dispatch List
            </a>
          </li> */}
         
         
          

        </ul>
      </div>
      {/* <div className={main-content ${(showVehicleManagement || showDispatchList) ? 'show' : ''}}>
        {showVehicleManagement && <VehicleManagement />}
        {showDispatchList && <VehicleList />}
      </div> */}
    </div>
  );
};

export default Sidebar;