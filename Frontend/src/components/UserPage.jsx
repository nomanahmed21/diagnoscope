import React, { useState, useEffect } from "react";
import {
  ActivitySquare,
  BarChart3,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import "./UserPage.css";
import Diagnose from "./Diagnose";
import Analytics from "./Analytics";
import SettingsPage from "./SettingsPage";
import Reports from "./Reports";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";

const UserPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveringLogo, setHoveringLogo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);

  const menuItems = [
    { label: "Diagnose", icon: <ActivitySquare size={20} /> },
    { label: "Analytics", icon: <BarChart3 size={20} /> },
    { label: "Reports", icon: <FileText size={20} /> },
    { label: "Settings", icon: <Settings size={20} /> },
    { label: "Logout", icon: <LogOut size={20} /> }
  ];

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <Diagnose />;
      case 1:
        return <Analytics />;
      case 2:
        return <Reports />;
      case 3:
        return <SettingsPage />;
      case 4:
        dispatch(clearUser());
        return <h2>Logging out...</h2>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/UserPage", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setUser(data))
          console.log(data); // Store globally
        } else {
          console.log("res not ok");
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    // Fetch only if user is not already stored
    if (!userData) {
      fetchUser();
    }
  }, [dispatch, userData]);
  return (
    <div className="layout">
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div
          className={`logo-container ${hoveringLogo ? "hovered" : ""}`}
          onMouseEnter={() => setHoveringLogo(true)}
          onMouseLeave={() => setHoveringLogo(false)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="logo-text gradient-text">Diagnoscope</span>
          ) : (
            <span className="logo-icon">🩺</span>
          )}
        </div>

        <ul className="menu">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className={`menu-item ${activeIndex === idx ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
              title={!isOpen ? item.label : ""}
            >
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </li>
          ))}
        </ul>

        <div className="profile-bottom">
          <div className="avatar">{userData ? `${userData.firstName[0]}` : "?"}</div>
          {isOpen && (
            <div className="name gradient-text">
              {userData ? `${userData.firstName}` : "loading..."}
            </div>
          )}
        </div>
      </aside>

      <main className="content">{renderContent()}</main>
    </div>
  );
};

export default UserPage;
