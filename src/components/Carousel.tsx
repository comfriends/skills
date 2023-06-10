import { useEffect, useRef } from "react";
import Slider from "react-slick";

import classNames from "classnames/bind";
import styled from "styled-components";

import styles from "assets/css/default.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import book_1 from "assets/images/book_1.jpeg";
import book_2 from "assets/images/book_2.jpeg";
import book_3 from "assets/images/book_3.jpeg";
import next_sm from "assets/images/next_lg.svg";
import prev_sm from "assets/images/prev_lg.svg";
import { TypeProps } from "stores/type";

const cx = classNames.bind(styles);

const Carousel = () => {
  interface CustomArrowProps {
    className?: string;
    onClick?: () => void;
  }

  // 커스텀 화살표 컴포넌트
  const CustomNextArrow = ({ className, onClick }: CustomArrowProps) => {
    return (
      <div className={className} onClick={onClick}>
        <img className={cx("arrow_btn")} src={next_sm} alt="next_sm" />
      </div>
    );
  };

  const CustomPrevArrow = ({ className, onClick }: CustomArrowProps) => {
    return (
      <div className={className} onClick={onClick}>
        <img className={cx("arrow_btn")} src={prev_sm} alt="prev_sm" />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <div className={cx("sliders", "inner")}>
      <h1>Slider: react-slick</h1>

      <Slider {...settings}>
        <div className={cx("slider")}>
          <img src={book_1} alt="book_1" />
        </div>
        <div className={cx("slider")}>
          <img src={book_2} alt="book_2" />
        </div>
        <div className={cx("slider")}>
          <img src={book_3} alt="book_3" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
