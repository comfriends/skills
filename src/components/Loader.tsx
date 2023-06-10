import React from "react";

import BeatLoader from "react-spinners/FadeLoader";

const Loader = () => {
  console.log("loader");
  return (
    <div className="contentWrap">
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100px",
          height: "100px",
          zIndex: "10",
        }}
      >
        <BeatLoader color={"purple"} />
      </div>
    </div>
  );
};

export default Loader;
