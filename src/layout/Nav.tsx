import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import classNames from "classnames/bind";

import styles from "assets/css/default.module.scss";
import { NavProps, TypeProps } from "stores/type";
const cx = classNames.bind(styles);
const Nav = ({ onClicked }: NavProps) => {
  // const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("Charts");

  const handleSelect = (type: string) => {
    setSelectedType(type);
    onClicked(type);
  };

  const Title = ({ type }: TypeProps) => {
    return (
      <h2
        className={cx(type === selectedType ? "selected" : "")}
        onClick={() => handleSelect(type)}
      >
        {type}
      </h2>
    );
  };
  const titles = ["Charts", "Dual Listbox", "Grid Table", "Slider"];
  return (
    <nav>
      <div className={cx("title_box")}>
        {titles.map((title) => (
          <Title type={title} />
        ))}
      </div>
    </nav>
  );
};

export default Nav;
