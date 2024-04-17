import { MouseEvent, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaChair, FaTable } from "react-icons/fa";

const BookTable = () => {
  const [items, setItems] = useState([]);

  const handleDragStart = (
    e: MouseEvent<HTMLDivElement, MouseEvent>,
    item: string
  ) => {
    console.log(e);
    e.dataTransfer.setData("type", item); // Set the type of the dragged item
  };

  const handleDrop = (e: {
    preventDefault: () => void;
    dataTransfer: { getData: (arg0: string) => any };
    currentTarget: { getBoundingClientRect: () => any };
    pageX: number;
    pageY: number;
  }) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");

    // Calculate the offset of the drop position relative to the container
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.pageX - containerRect.left;
    const offsetY = e.pageY - containerRect.top;

    // If the dropped item is a chair, calculate its position relative to the table
    let newItem;
    if (type === "chair" && items.length > 0 && items[0].type === "table") {
      const tableX = items[0].x;
      const tableY = items[0].y;
      const chairX = offsetX - 10; // Adjust for chair size
      const chairY = offsetY - 10; // Adjust for chair size
      newItem = { type, id: items.length, x: chairX, y: chairY };
    } else {
      newItem = { type, id: items.length, x: offsetX, y: offsetY };
    }

    setItems([...items, newItem]);
  };

  const handleRemove = (id: any) => {
    console.log(id);
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="w-[150vh] bg-gray-700 text-white p-2 h-full rounded-xl">
        <div className="flex justify-between">
          <h2 className="text-white font-[Poppins] text-md">
            Restaurant Layout (Booking Table)
          </h2>
          <div className="flex fle-row gap-2">
            {/* <div> */}
            <div
              className="inline-block text-sm   border-2 border-white p-2 rounded-lg"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, "table")}
            >
              <FaTable />
            </div>
            <div
              className="inline-block text-sm   border-2 border-white p-2 rounded-lg"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, "chair")}
            >
              <FaChair />
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="min-h-[500px] relative">
          <DndProvider backend={HTML5Backend}>
            <div
              className="absolute left-0 top-0 w-full h-full mt-14"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {items.map((item) => {
                if (item.type === "table") {
                  return (
                    <>
                      <div
                        key={item.id}
                        className="absolute border border-black p-2 bg-white text-black w-20 h-20 cursor-pointer rounded-md"
                        style={{ left: item.x, top: item.y }}
                        onClick={() => handleRemove(item.id)}
                      >
                        <FaTable size={60} />
                      </div>
                    </>
                  );
                } else if (item.type === "chair") {
                  return (
                    <div
                      key={item.id}
                      className="absolute border border-black p-2 bg-white text-black w-8 h-8 cursor-pointer rounded-full"
                      style={{ left: item.x, top: item.y }}
                      onClick={() => handleRemove(item.id)}
                    >
                      <FaChair size={15} />
                    </div>
                  );
                }
              })}
            </div>
          </DndProvider>
        </div>
      </div>
    </>
  );
};

export default BookTable;
