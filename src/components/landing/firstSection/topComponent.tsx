import React from "react";
import Header from "../../header";
import TechStackTower from "./tech";

const TopComponent: React.FC = () => {

  return (
    <>
      <Header />
      <TechStackTower withEffects={false} />

      <div className="title-container">
        <h1 className="title">Notable Nomads</h1>
        <h1 className="description">Wander, Discover, Create</h1>
      </div>
    </>
  );
};

export default TopComponent;
