import { Avatar } from '@material-ui/core';
import React from 'react'
import './SidebarChats.css';

function SidebarChats() {
    return (
        <div className="sidebarChats">
            <Avatar/>
            <div className="sidebarChats__info">
                <h2>*Contact name*</h2>
                <p>*Last message*</p>
            </div>
        </div>
    )
}

export default SidebarChats
