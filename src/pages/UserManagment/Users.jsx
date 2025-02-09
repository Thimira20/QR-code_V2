import React, { useState } from 'react';
import { getCurrentUser } from '../../services/authService';
import UserTable from '../../components/UserList2';
import './users.css';

function Users(props) {
  
    return (
        <div className='user'>
            <div className="userTop">
                <div className="userTopic">
                    User Managment 
                </div>

            </div>
            <div className="userBottom">
                <UserTable/>
            </div>
            
        </div>
    );
}

export default Users;