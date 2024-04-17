import React from "react";

const TableIcon = ({ onSelectItem }) => {
  return (
    <div
      className="w-20 h-10 rounded-md  border border-black "
      onClick={() => onSelectItem("table")}
    >
      <p className="text-sm text-center ">table</p>
    </div>
  );
};

export default TableIcon;
