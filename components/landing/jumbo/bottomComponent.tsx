import React from "react";
import "../styles.css";
import Header from "../../header";
import TechStackTower from "./tech";



const BottomComponent = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Header />
      <TechStackTower withEffects={true} />

      <div className="title-container bottom-title-container">
        <h1 className="title-bottom">Notable Nomads</h1>
        <h1 className="description">Turning Visions Into Reality</h1>
      </div>
    </div>
  );
};

export default BottomComponent;
