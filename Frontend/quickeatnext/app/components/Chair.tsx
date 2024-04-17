import React from "react";

const ChairIcon = ({ onSelectItem }) => {
  return (
    <>
      <div
        onClick={() => onSelectItem("chair")}
        className="w-12 h-10 rounded-tl-lg rounded-tr-lg border border-black "
      >
        <p className="text-center text-sm">chair</p>
      </div>
    </>
  );
};

export default ChairIcon;
