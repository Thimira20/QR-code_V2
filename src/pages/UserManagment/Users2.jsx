import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import axios from 'axios';
import UserTable from '../../components/UserList2';
import './users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Trigger animations when component mounts
  useEffect(() => {
    // Add a slight delay before setting animation complete
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);
    
    // Apply animation class to body
    document.body.classList.add('user-management-active');
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('user-management-active');
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-data/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const formattedUsers = response.data.data.map(user => ({
          ...user,
          id: user._id,
        }));
        
        // Stagger the animations for a more polished feel
        setTimeout(() => {
          setUsers(formattedUsers);
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }, 600);
      } catch (err) {
        setError("Failed to fetch users");
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    fetchUsers();
  }, []);

  // Calculate user statistics based on the user model
  const calculateStats = () => {
    const currentDate = new Date();
    const thirtyMinutesAgo = new Date(currentDate - 30 * 60 * 1000); // 30 minutes ago
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const totalUsers = users.length;
    
    // Count active users (users active in the last 30 minutes)
    const activeUsers = users.filter(user => {
      if (!user.lastActiveAt) return false;
      const lastActive = new Date(user.lastActiveAt);
      return lastActive >= thirtyMinutesAgo;
    }).length;

    // Count new users created this month
    const newUsers = users.filter(user => {
      if (!user._id) return false;
      // Extract creation date from MongoDB ObjectId
      const creationDate = new Date(parseInt(user._id.substring(0, 8), 16) * 1000);
      return creationDate >= firstDayOfMonth;
    }).length;

    return {
      totalUsers,
      activeUsers,
      newUsers
    };
  };

  const stats = calculateStats();

  return (
    <div className={`user ${animationComplete ? 'animation-complete' : ''}`}>
      {/* Header Section */}
      <div className="userTop">
        <h1 className="userTopic">User Management</h1>
      </div>

      <div className="userBottom">
        {/* Stats Cards */}
        <div className="stats-container">
          <Fade in={true} timeout={800} style={{ transitionDelay: '100ms' }}>
            <div className="stat-card stat-card-1">
              <div className="stat-content">
                <div className="stat-text">
                  <h4>Total Users</h4>
                  {loading ? (
                    <CircularProgress size={20} className="pulse-animation" />
                  ) : (
                    <p className="animate-number">{stats.totalUsers}</p>
                  )}
                </div>
                <div className="stat-icon">
                  <GroupIcon />
                </div>
              </div>
            </div>
          </Fade>

          <Fade in={true} timeout={800} style={{ transitionDelay: '300ms' }}>
            <div className="stat-card stat-card-2">
              <div className="stat-content">
                <div className="stat-text">
                  <h4>Active Users (Last 30m)</h4>
                  {loading ? (
                    <CircularProgress size={20} className="pulse-animation" />
                  ) : (
                    <p className="animate-number">{stats.activeUsers}</p>
                  )}
                </div>
                <div className="stat-icon">
                  <PeopleIcon />
                </div>
              </div>
            </div>
          </Fade>

          <Fade in={true} timeout={800} style={{ transitionDelay: '500ms' }}>
            <div className="stat-card stat-card-3">
              <div className="stat-content">
                <div className="stat-text">
                  <h4>New Users (This Month)</h4>
                  {loading ? (
                    <CircularProgress size={20} className="pulse-animation" />
                  ) : (
                    <p className="animate-number">{stats.newUsers}</p>
                  )}
                </div>
                <div className="stat-icon">
                  <PersonAddIcon />
                </div>
              </div>
            </div>
          </Fade>
        </div>

        {/* Main Content */}
        <Fade in={true} timeout={1000} style={{ transitionDelay: '700ms' }}>
          <div className="table-container">
            <h2 className="table-title">User List</h2>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : loading ? (
              <div className="loading-container">
                <CircularProgress className="pulse-animation" />
              </div>
            ) : (
              <UserTable />
            )}
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Users;