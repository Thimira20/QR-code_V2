import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import axios from "axios";
import { getCurrentUser } from "../services/authService";

const columns = [
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "lastActiveAt", headerName: "Last Active", width: 180 },
  { field: "role", headerName: "Role", width: 130 },
];

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const currentUser = getCurrentUser();

  // Fetch users
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/user-data/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedUsers = res.data.data.map(user => ({
          ...user,
          id: user._id, // Ensure `id` is available for DataGrid
        }));
        setUsers(formattedUsers);
      })
      //.then((res) => setUsers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle delete selected users
//   const handleDeleteSelected = () => {
//     axios
//       .delete("${process.env.REACT_APP_API_URL}/api/user-data/users/delete-selected", {
//         data: { userIds: selectedUsers },
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//       .then(() => {
//         setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
//         setSelectedUsers([]);
//       })
//       .catch((err) => console.error(err));
//   };
const handleDeleteSelected = () => {
    // Filter out admin users
    const nonAdminUsers = users.filter(user => selectedUsers.includes(user.id) && user.role !== "admin");
    const nonAdminUserIds = nonAdminUsers.map(user => user.id);
  
    if (nonAdminUserIds.length === 0) {
      alert("No users deleted. Admins cannot be removed.");
      return;
    }
  
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/user-data/users/delete-selected`, {
        data: { userIds: nonAdminUserIds },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setUsers(users.filter(user => !nonAdminUserIds.includes(user.id)));
        setSelectedUsers([]);
      })
      .catch((err) => console.error(err));
  };
  

  // Handle update user role
//   const handleUpdateRole = () => {
//     const updatedRoles = selectedUsers.map((id) => ({
//       userId: id,
//       role: "admin", // Change role dynamically
//     }));

//     axios
//       .put("${process.env.REACT_APP_API_URL}/api/user-data/users/update-roles", { users: updatedRoles }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//       .then(() => {
//         setUsers(users.map(user => 
//           selectedUsers.includes(user.id) ? { ...user, role: "moderator" } : user
//         ));
//         setSelectedUsers([]);
//       })
//       .catch((err) => console.error(err));
//   };
const handleUpdateRole = () => {
    // Prepare updated roles based on current roles
    const updatedRoles = selectedUsers.map((id) => {
      const currentUser = users.find(user => user.id === id);
      return {
        userId: id,
        role: currentUser.role === "user" ? "admin" : "user", // Toggle role
      };
    });
  
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/user-data/users/update-roles`, 
        { users: updatedRoles }, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        // Update the frontend state to reflect role changes
        setUsers(users.map(user => {
          if (selectedUsers.includes(user.id)) {
            return { ...user, role: user.role === "user" ? "admin" : "user" }; // Toggle role locally
          }
          return user;
        }));
        setSelectedUsers([]);
      })
      .catch((err) => console.error(err));
  };
  
  return (
    <div style={{ height: 500 , width: "90%" }}>
        {currentUser?.role === "super_admin" && 
        (<><Button variant="contained" color="error" onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}>
              Delete Selected  <DeleteIcon />
          </Button><Button variant="contained" color="primary" onClick={handleUpdateRole} disabled={selectedUsers.length === 0} style={{ marginLeft: 10 }}>
                  Update Role <SupervisorAccountIcon />
              </Button></>)}
      <DataGrid
        rows={users}
        columns={columns}
        checkboxSelection
        getRowId={(row) => row._id} // Tell DataGrid to use _id as the row identifier
        onRowSelectionModelChange={(newSelection) => setSelectedUsers(newSelection)}
      />
      
    </div>
  );
};

export default UserTable;
