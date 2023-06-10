import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router";

// import Header from "./header/HeaderContainer";
import classNames from "classnames/bind";

import Nav from "./Nav";

import Carousel from "components/Carousel";
import Charts from "components/Charts";
import DualListbox from "components/DualListBox";
import GridTable from "components/GridTable";

import styles from "assets/css/default.module.scss";
import { mock } from "stores/mock";
import { TypeProps } from "stores/type";
const cx = classNames.bind(styles);
interface LayoutDefaultProps {
  children?: React.ReactElement;
}

const Layout = () => {
  const [selectedType, setSelectedType] = useState("Charts");

  //component
  const Children = ({ type }: TypeProps) => {
    if (type === "Slider") {
      return <Carousel />;
    } else if (type === "Charts") {
      return <Charts />;
    } else if (type === "Dual Listbox") {
      return (
        <DualListbox
          primaryData={mock.DualListBoxData.primary}
          secondaryData={mock.DualListBoxData.secondary}
        />
      );
    } else if (type === "Grid Table") {
      return (
        <GridTable
          data={mock.GridTableData}
          dropDownData={{ army: ["군필", "미필"] }}
        />
      );
    } else {
      return null;
    }
  };
  return (
    <div>
      {/* <Header /> */}
      <Nav onClicked={(type) => setSelectedType(type)} />
      <main>
        <Children type={selectedType} />
      </main>
    </div>
  );
};

export default Layout;
