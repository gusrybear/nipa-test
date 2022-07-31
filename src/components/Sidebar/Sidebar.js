import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ children }) {
  const menuItems = [
    {
      path: "/restful",
      name: "Http REST Example",
    },
    {
      path: "/websocket",
      name: "Http WebSocket Example",
    },
  ];

  return (
    <>
      <div className="container">
        <div className={styles.sidebar}>
          <div className={styles.topSection}>
            <h1>NipaCloud Nvision</h1>
            <p>Javascript SDK Example</p>
          </div>
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={styles.link}
              activeclassname="active"
            >
              <div className={styles.linkText}>{item.name}</div>
            </NavLink>
          ))}
        </div>
        <main>
          <h1>Nvision SDK: Object Detection Example</h1>
          {children}
        </main>
      </div>
    </>
  );
}

export default Sidebar;
