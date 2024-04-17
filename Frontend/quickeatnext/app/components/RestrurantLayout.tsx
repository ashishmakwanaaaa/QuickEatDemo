import React, { useState, useRef } from "react";

const RestaurantLayout = ({ selectedItem, layout = [], onLayoutChange }) => {
  const [draggingItem, setDraggingItem] = useState(null);

  const handleMouseDown = (e) => {
    if (selectedItem) {
      const x = e.clientX;
      const y = e.clientY;
      const newItem = { type: selectedItem, x, y };
      const updatedLayout = [...layout, newItem];
      onLayoutChange(updatedLayout);
      setDraggingItem(newItem);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingItem) {
      const x = e.clientX;
      const y = e.clientY;
      const updatedItem = { ...draggingItem, x, y };
      const updatedLayout = layout.map((item) =>
        item === draggingItem ? updatedItem : item
      );
      onLayoutChange(updatedLayout);
    }
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {layout.map((item, index) => (
        <div
          key={index}
          style={{ position: "absolute", left: item.x, top: item.y }}
        >
          {item.type === "table" ? (
            <img src="/table-icon.png" alt="table" />
          ) : (
            <img src="/chair-icon.png" alt="chair" />
          )}
        </div>
      ))}
    </div>
  );
};


export default RestaurantLayout;
