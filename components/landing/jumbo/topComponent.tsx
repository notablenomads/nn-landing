import React from "react";
import Header from "../../header";
import TechStackTower from "./tech";

const TopComponent: React.FC = () => {

  return (
    <>
      <Header />
      <TechStackTower withEffects={false} />
      {/*<Image src={'./shape-1.svg'} alt='shape' width='400' height='400'/>*/}
      <div className="title-container">
        <h1 className="title">Notable Nomads</h1>
        <h1 className="description">Turning Visions Into Reality</h1>
      </div>
    </>
  );
};

export default TopComponent;
