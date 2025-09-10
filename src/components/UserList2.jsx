import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Tooltip,
  Fade,
  Zoom
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { getCurrentUser } from "../services/authService";
import './userList.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const currentUser = getCurrentUser();

  // Enhanced columns with better formatting and visual elements
  const columns = [
    {
      field: "username",
      headerName: "User",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {params.value.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2">{params.value}</Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.email}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "super_admin" 
              ? "error" 
              : params.value === "admin" 
                ? "primary" 
                : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "lastActiveAt",
      headerName: "Last Active",
      width: 180,
      renderCell: (params) => {
        const date = new Date(params.value);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let color = "success";
        if (diffDays > 30) color = "error";
        else if (diffDays > 7) color = "warning";

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Chip
              size="small"
              label={date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              color={color}
              variant="outlined"
            />
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, params.row)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  // Fetch users with error handling
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
        setUsers(formattedUsers);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle menu opening for single user actions
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  // Handle menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Handle single user deletion
  const handleSingleDelete = async (user) => {
    if (user.role === "admin" || user.role === "super_admin") {
      alert("Admin users cannot be deleted");
      handleMenuClose();
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user-data/users/delete-selected`, {
        data: { userIds: [user.id] },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setUsers(users.filter(u => u.id !== user.id));
      handleMenuClose();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Handle single user role update
  const handleSingleRoleUpdate = async (user) => {
    if (user.role === "super_admin") {
      alert("Super admin roles cannot be modified");
      handleMenuClose();
      return;
    }

    try {
      const newRole = user.role === "user" ? "admin" : "user";
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user-data/users/update-roles`,
        { 
          users: [{
            userId: user.id,
            role: newRole
          }]
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setUsers(users.map(u => {
        if (u.id === user.id) {
          return { ...u, role: newRole };
        }
        return u;
      }));
      handleMenuClose();
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  // Handle bulk delete
  const handleDeleteSelected = async () => {
    const nonAdminUsers = users.filter(user => 
      selectedUsers.includes(user.id) && 
      user.role !== "admin" && 
      user.role !== "super_admin"
    );
    
    if (nonAdminUsers.length === 0) {
      alert("Admin users cannot be deleted");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user-data/users/delete-selected`, {
        data: { userIds: nonAdminUsers.map(user => user.id) },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setUsers(users.filter(user => !nonAdminUsers.map(u => u.id).includes(user.id)));
      setSelectedUsers([]);
    } catch (err) {
      alert("Failed to delete users");
    }
  };

  // Handle bulk role update
  const handleUpdateRole = async () => {
    const updatedRoles = selectedUsers.map((id) => {
      const user = users.find(u => u.id === id);
      return {
        userId: id,
        role: user.role === "user" ? "admin" : "user",
      };
    });

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user-data/users/update-roles`,
        { users: updatedRoles },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setUsers(users.map(user => {
        if (selectedUsers.includes(user.id)) {
          return { ...user, role: user.role === "user" ? "admin" : "user" };
        }
        return user;
      }));
      
      setSelectedUsers([]);
      setIsUpdateDialogOpen(false);
    } catch (err) {
      alert("Failed to update user roles");
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-data/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const formattedUsers = response.data.data.map(user => ({
        ...user,
        id: user._id,
      }));
      setUsers(formattedUsers);
      setSearchQuery("");
      setSelectedUsers([]);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="user-table-card">
      <div className="user-table-header">
        <Typography className="user-table-title">
          <SupervisorAccountIcon fontSize="small" />
          User Directory
        </Typography>
        <div className="user-table-controls">
          <TextField
            className="search-field"
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" fontSize="small" />,
            }}
          />
          
          <Tooltip title="Refresh data">
            <IconButton 
              className="action-button refresh-button"
              onClick={handleRefresh}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {currentUser?.role === "super_admin" && (
            <>
              <Tooltip title="Delete selected users">
                <span>
                  <Button
                    className="action-button delete-button"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={handleDeleteSelected}
                    disabled={selectedUsers.length === 0}
                    variant="text"
                    size="small"
                  >
                    Delete
                  </Button>
                </span>
              </Tooltip>
              
              <Tooltip title="Change roles for selected users">
                <span>
                  <Button
                    className="action-button role-button"
                    startIcon={<SupervisorAccountIcon fontSize="small" />}
                    onClick={() => setIsUpdateDialogOpen(true)}
                    disabled={selectedUsers.length === 0}
                    variant="text"
                    size="small"
                  >
                    Change Role
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <CardContent>
        <div className="data-grid-container" style={{ height: 500, width: '100%' }}>
          {loading ? (
            <div className="loading-skeleton-container" style={{ height: '100%', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div className="skeleton-checkbox" style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                  <div className="skeleton-text" style={{ width: '100px', height: '24px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                </div>
                <div className="skeleton-text" style={{ width: '80px', height: '24px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
              </div>
              
              {[...Array(5)].map((_, index) => (
                <div key={index} className="skeleton-row" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  height: '60px',
                  marginBottom: '8px',
                  background: 'rgba(106, 17, 203, 0.05)',
                  borderRadius: '8px',
                  gap: '12px',
                  animationDelay: `${index * 0.1}s`
                }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(106, 17, 203, 0.15)' }}></div>
                  <div style={{ width: '180px', height: '20px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                  <div style={{ width: '100px', height: '20px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                  <div style={{ width: '120px', height: '20px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                  <div style={{ marginLeft: 'auto', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                </div>
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '16px', alignItems: 'center' }}>
                <div className="skeleton-text" style={{ width: '100px', height: '24px', borderRadius: '4px', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                <div className="skeleton-text" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(106, 17, 203, 0.1)' }}></div>
                <div className="skeleton-text" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(106, 17, 203, 0.1)' }}></div>
              </div>
            </div>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <Fade in={!loading} timeout={800}>
              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  rows={filteredUsers}
                  columns={columns}
                  checkboxSelection
                  disableRowSelectionOnClick
                  getRowId={(row) => row._id}
                  onRowSelectionModelChange={setSelectedUsers}
                  pageSizeOptions={[10, 25, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  className="custom-data-grid"
                />
              </div>
            </Fade>
          )}
        </div>
      </CardContent>

      {/* Single User Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        elevation={3}
        PaperProps={{
          sx: { 
            borderRadius: 2, 
            minWidth: 180,
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              margin: '2px 0',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(106, 17, 203, 0.08)'
              }
            }
          }
        }}
      >
        <MenuItem 
          onClick={() => selectedUser && handleSingleRoleUpdate(selectedUser)}
          disabled={selectedUser?.role === "super_admin"}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            color: '#6a11cb'
          }}
        >
          <SupervisorAccountIcon fontSize="small" />
          Change Role
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleSingleDelete(selectedUser)}
          disabled={selectedUser?.role === "super_admin" || selectedUser?.role === "admin"}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            color: '#ef4444'
          }}
        >
          <DeleteIcon fontSize="small" />
          Delete User
        </MenuItem>
      </Menu>

      {/* Bulk Role Update Dialog */}
      <Dialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: { 
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(90deg, rgba(106, 17, 203, 0.05), rgba(37, 117, 252, 0.08))',
          borderBottom: '1px solid rgba(106, 17, 203, 0.1)',
          color: '#6a11cb',
          fontSize: '1.1rem',
          fontWeight: 600
        }}>
          Update User Roles
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to update roles for <strong>{selectedUsers.length}</strong> selected users?
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            p: 2, 
            bgcolor: 'rgba(106, 17, 203, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(106, 17, 203, 0.1)'
          }}>
            This action will toggle roles between user and admin. Users will become admins, and admins will become regular users.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(106, 17, 203, 0.05)' }}>
          <Button 
            onClick={() => setIsUpdateDialogOpen(false)}
            sx={{ 
              color: 'text.secondary',
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(106, 17, 203, 0.9), rgba(37, 117, 252, 0.9))',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(106, 17, 203, 0.15)',
              '&:hover': {
                background: 'linear-gradient(90deg, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))',
                boxShadow: '0 6px 16px rgba(106, 17, 203, 0.25)',
              }
            }}
          >
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserTable;