import React, { useState } from 'react';
import './UserDashbord.css';
import { FaFileAlt, FaTruck } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from 'react-icons/io';

function UserDashboard() {
    const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
  
  const [showEpermit, setShowEpermit] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const handleEpermitClick = (e) => {
    e.preventDefault();
    setShowEpermit(!showEpermit);
    setShowUserList(false);
    navigate('/userdispatch', { 
        state: { 
          userData
        } 
    });
  };

  const handleDispatchClick = (e) => {
    e.preventDefault();
    setShowUserList(!showUserList);
    setShowEpermit(false);
    navigate('/userlist', { 
      state: { 
        userId: userData.id, 
        lesseeId: userData.lesseeId 
      } 
    });
  };
  const handleDispatchEditClick = (e) => {
    e.preventDefault();
    setShowUserList(!showUserList);
    setShowEpermit(false);
    navigate('/useredit', { 
      state: { 
         userData,
        lesseeId: userData.lesseeId 
      } 
    });
  };


  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>User Dashboard</h2>
        <h5>Navigation</h5>
        <ul>
          <li onClick={handleEpermitClick}>
            <FaFileAlt className="icon-blue" />
            <span>e-Permit</span>
          </li>
          <li onClick={handleDispatchClick}>
            <FaTruck className="icon-green" />
            <span>Dispatch List</span>
          </li>

          <li onClick={handleDispatchEditClick}>
            <IoIosAddCircleOutline className="icon-green" />
            <span>Add</span>
          </li>

        </ul>
      </aside>

      {/* Main content can be dynamically rendered using <Outlet /> if needed */}
    </div>
  );
}

export default UserDashboard;
