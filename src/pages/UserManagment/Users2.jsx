import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import axios from 'axios';
import UserTable from '../../components/UserList2';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/user-data/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const formattedUsers = response.data.data.map(user => ({
          ...user,
          id: user._id,
        }));
        setUsers(formattedUsers);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
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
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <PeopleIcon sx={{ color: '#1976d2' }} />
          </Paper>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              User Management
            </Typography>
            <Typography variant="body3" color="text.secondary">
              Manage and monitor user accounts
            </Typography>
          </Box>
        </Box>

        {/* <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 300,
              borderRadius: 2
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search users..."
            />
            <IconButton type="button" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          <IconButton sx={{ bgcolor: '#f5f5f5' }}>
            <SettingsIcon />
          </IconButton>
        </Box> */}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Users
                  </Typography>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {stats.totalUsers}
                    </Typography>
                  )}
                </Box>
                <GroupIcon sx={{ color: '#1976d2', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Users (Last 30m)
                  </Typography>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {stats.activeUsers}
                    </Typography>
                  )}
                </Box>
                <PeopleIcon sx={{ color: '#2e7d32', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    New Users (This Month)
                  </Typography>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {stats.newUsers}
                    </Typography>
                  )}
                </Box>
                <PersonAddIcon sx={{ color: '#ed6c02', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <UserTable />
        )}
      </Paper>
    </Box>
  );
};

export default Users;