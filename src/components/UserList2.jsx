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
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { getCurrentUser } from "../services/authService";

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

  return (
    <Card sx={{ width: '90%', boxShadow: 3 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h6">User Management</Typography>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
            
            {currentUser?.role === "super_admin" && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                  disabled={selectedUsers.length === 0}
                >
                  {/* Delete Selected */}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SupervisorAccountIcon />}
                  onClick={() => setIsUpdateDialogOpen(true)}
                  disabled={selectedUsers.length === 0}
                >
                  {/* Update Role */}
                </Button>
              </>
            )}
          </div>
        </div>

        <div style={{ height: 500, width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
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
            />
          )}
        </div>
      </CardContent>

      {/* Single User Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => selectedUser && handleSingleRoleUpdate(selectedUser)}
          disabled={selectedUser?.role === "super_admin"}
        >
          Change Role
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleSingleDelete(selectedUser)}
          disabled={selectedUser?.role === "super_admin" || selectedUser?.role === "admin"}
          sx={{ color: 'error.main' }}
        >
          Delete User
        </MenuItem>
      </Menu>

      {/* Bulk Role Update Dialog */}
      <Dialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      >
        <DialogTitle>Update User Roles</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update roles for {selectedUsers.length} selected users?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This will toggle their roles between user and admin.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserTable;