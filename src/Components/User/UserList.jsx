import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserList.css';
import { deleteQueryAPI, queryGetAPI } from '../../Server/allAPI';

function UserList() {
  const location = useLocation();
  const { lesseeId,userId } = location.state || {};
  console.log(userId);
  
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllQueries();
  }, []);

  useEffect(() => {
    let results = [...queries];
    
    if (lesseeId) {
      results = results.filter(query => query.lesseeId === lesseeId);
    }
    
    if (searchTerm) {
      results = results.filter(query => 
        (query.SerialNo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (query.dispatchNo?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredQueries(results);
  }, [searchTerm, queries, lesseeId]);

  const fetchAllQueries = async () => {
    try {
      setLoading(true);
      const response = await queryGetAPI();
      
      if (response.data && Array.isArray(response.data)) {
        // Safe sorting with fallback for missing dates
        const sortedData = response.data.sort((a, b) => {
          // Get valid dates or fallback to current date
          const getValidDate = (obj) => {
            if (obj?.createdAt) return new Date(obj.createdAt);
            if (obj?.updatedAt) return new Date(obj.updatedAt);
            return new Date(); // Fallback to current date
          };
          
          const dateA = getValidDate(a);
          const dateB = getValidDate(b);
          return dateB - dateA; // Newest first
        });
        
        setQueries(sortedData);
      } else {
        throw new Error("No data received or data is not in expected format");
      }
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (query) => {
    navigate(`/lastuser/${query._id}`,{
      state:{
        userId
      }
    });
  };


const handleDelete = async (id) => {
  try {
    if (window.confirm("Are you sure you want to delete this record?")) {
      // Optimistic update - remove from UI immediately
      setQueries(prev => prev.filter(query => query._id !== id));
      setFilteredQueries(prev => prev.filter(query => query._id !== id));
      
      await deleteQueryAPI(id);
      // No need to refresh all data, we already updated UI
    }
  } catch (err) {
    console.error("Failed to delete query:", err);
    setError("Failed to delete record. Please try again.");
    // Revert UI if API call fails
    fetchAllQueries();
  }
};

const handleRefresh = async () => {
  try {
    setLoading(true);
    await fetchAllQueries();
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dispatch records...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>All Dispatch Entries {`lesseeId ? for Lessee ID: ${lesseeId} : ''`}</h2>

      <div className="controls-section">
        <div className="search-control">
          <input
            type="text"
            placeholder="Search by Serial No or Dispatch No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="action-buttons">
          
          <button style={{width:'100px'}} onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
        <div className="no-results">
          <p>No dispatch records found{lesseeId ? ` for Lessee ID: ${lesseeId}` : ''}.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="dispatch-table">
            <thead>
              <tr>
                <th>Created At</th>
                <th>Permit No</th>
                <th>Security Paper No</th>
                <th>vehicle no</th>
                                <th>Mineral</th>

                <th>name</th>
                <th>address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map(query => (
                <tr key={query._id}>
                  <td>
                    {query.createdAt ? new Date(query.createdAt).toLocaleString() : 'N/A'}
                  </td>
                  <td>{query.bulkPermitNo || 'N/A'}</td>
                  <td>{query.SerialNo ? `TN00${query.SerialNo}` : 'N/A'}</td>
                  <td>{query.vehicleNo || 'N/A'}</td>
                  <td>{query.mineralName || 'N/A'}</td>
                                    <td>{query.purchaserName || 'N/A'}</td>
                  <td>{query.purchaserAddress || 'N/A'}</td>
                  <td></td>
                  <td className="action-buttons-cell">
                    <button 
                      onClick={() => handleView(query)} 
                      className="btn btn-view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;