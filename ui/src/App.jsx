import React, { useState } from "react";
import LoginButton from "./components/LoginButton.jsx";
import UserProfile from "./components/UserProfile.jsx";
import LogoutButton from "./components/LogoutButton.jsx";

function App() {
    return (
        <div>
            <LoginButton />
            <LogoutButton />
            <UserProfile />
        </div>
    )
}

export default App;
