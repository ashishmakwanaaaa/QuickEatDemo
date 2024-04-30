import { MouseEvent, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaChair, FaTable } from "react-icons/fa";
import { LuTable } from "react-icons/lu";
import Button from "@mui/material/Button";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import { user } from "../../lib/reducers";
import { Dayjs } from "dayjs";
import { FaTableColumns } from "react-icons/fa6";

interface ItemTypeTableBooking {
  type: string;
  id: number;
  x: number;
  y: number;
}
interface bookingdetailstype {
  userId: string;
  TableId: string;
  Customername: string;
  Customerphoneno: string;
  Howmanypeople: number;
  Time: Dayjs | null | any;
  Date: Dayjs | null | any;
}

const BookTable = () => {
  const [items, setItems] = useState<ItemTypeTableBooking[]>([]);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [bookedtable, setbookedtable] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector((state: user) => state.user.user);
  console.log(user._id);
  const [bookingdetails, setbookingdetails] = useState<bookingdetailstype>({
    userId: user._id,
    TableId: "TABLE" + Math.floor(Math.random() * 1000),
    Customername: "",
    Customerphoneno: "",
    Howmanypeople: bookedtable.length,
    Time: null,
    Date: null,
  });
  const handleDragStart = (
    e: MouseEvent<HTMLDivElement, MouseEvent> | any,
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
    if (!editMode) {
      return;
    }
    e.preventDefault();
    const type = e.dataTransfer.getData("type");

    // Calculate the offset of the drop position relative to the container
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.pageX - containerRect.left;
    const offsetY = e.pageY - containerRect.top;

    // If the dropped item is a chair, calculate its position relative to the table
    let newItem;
    if (type === "chair" && items.length > 0 && items[0].type === "table2") {
      const tableX = items[0].x;
      const tableY = items[0].y;
      const chairX = offsetX - 10; // Adjust for chair size
      const chairY = offsetY - 10; // Adjust for chair size
      newItem = { type, id: Math.random(), x: chairX, y: chairY };
    } else {
      newItem = { type, id: Math.random(), x: offsetX, y: offsetY };
    }

    setItems([...items, newItem]);
  };

  const handleRemove = (id: any) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    localStorage.setItem("layout", JSON.stringify(updatedItems));
  };

  const handleClickOpen = () => {
    setOpen(true);
    console.log(bookingdetails);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    setEditMode(false);
    localStorage.setItem(
      `layout_${bookingdetails.userId}`,
      JSON.stringify(items)
    );
    await Swal.fire({
      title: "Layout Saved Successfully",
      icon: "success",
      timer: 1000,
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleTableBook = (id: number) => {
    if (!editMode) {
      const index = bookedtable.indexOf(id);
      if (index === -1) {
        setbookedtable([...bookedtable, id]);
        localStorage.setItem(
          `bookedChairs_${bookingdetails.userId}`,
          JSON.stringify([...bookedtable, id])
        );
        setbookingdetails({
          ...bookingdetails,
          Howmanypeople: bookingdetails.Howmanypeople + 1,
        });
      } else {
        const updatebooktables = [...bookedtable];
        updatebooktables.splice(index, 1);
        setbookedtable(updatebooktables);
        localStorage.setItem(
          `bookedChairs_${bookingdetails.userId}`,
          JSON.stringify(updatebooktables)
        );
        setbookingdetails({
          ...bookingdetails,
          Howmanypeople: bookingdetails.Howmanypeople - 1,
        });
      }
    }
  };
  console.log(bookedtable.length);

  useEffect(() => {
    // Retrieve user information from Redux state
    // const loggedInUser = useSelector((state) => state.user.user);

    // Check if the user is available
    if (user) {
      // Set userId in bookingdetails state
      setLoading(true);
      setbookingdetails((prevDetails) => ({
        ...prevDetails,
        userId: user._id,
      }));
      setTimeout(() => setLoading(false), 2000);
    }

    // Retrieve layout and booked chairs data from local storage
    const savedlayout = localStorage.getItem(`layout_${bookingdetails.userId}`);
    const bookedChairsFromStorage = localStorage.getItem(
      `bookedChairs_${bookingdetails.userId}`
    );

    // Update state with layout and booked chairs data
    if (savedlayout) {
      setItems(JSON.parse(savedlayout));
    }
    if (bookedChairsFromStorage) {
      setbookedtable(JSON.parse(bookedChairsFromStorage));
    }
  }, []);
  console.log(items);

  const storetablebookingdata = async () => {
    setOpen(false);
    if (!bookingdetails.Date || !bookingdetails.Time) {
      // Handle error if date or time is missing
      console.error("Date or time is missing.");
      return;
    }
    const time = new Date(bookingdetails.Time);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Construct time string in HH:MM:SS format
    const timeString = `${hours}:${minutes}:${seconds}`;
    const payload = {
      ...bookingdetails,
      Time: timeString,
    };
    console.log(bookingdetails);
    try {
      const response = await fetch(
        "http://localhost:5000/tablebooking/createtablebook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Swal.fire({
          text: "Table Book Successfully",
          icon: "success",
          timer: 1000,
        });
      } else {
        Swal.fire({
          text: "Error:" + data.message,
          icon: "error",
          timer: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="animate-pulse bg-gray-300 w-[150vh] h-full "></div>
      ) : (
        <div className="w-[150vh] bg-gray-700 text-white p-2 h-full rounded-xl">
          <div className="flex justify-between">
            <div className="flex flex-row gap-2">
              {/* <h2 className="text-white font-[Poppins] text-sm">
              Choose Your Own Layout For Restrurant
            </h2> */}
              <button
                onClick={handleClickOpen}
                className="bg-orange-700 text-white p-2 rounded-md text-sm"
              >
                Book &rarr;
              </button>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center justify-center flex-row gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <p className="text-xs text-orange-400 font-[Poppins] text-start">
                  Booked
                </p>
              </div>
              <div className="flex items-center justify-center flex-row gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p className="text-xs text-white font-[Poppins] text-start">
                  Available
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {/* <div> */}
              <button
                onClick={handleSave}
                disabled={!editMode}
                className={`bg-green-700 ${
                  !editMode ? "cursor-not-allowed" : "cursor-pointer"
                }  text-white p-2 text-center text-sm rounded-md font-[Poppins]`}
              >
                Save
              </button>
              <button
                onClick={handleEdit}
                disabled={editMode}
                className={`bg-blue-500 ${
                  editMode ? "cursor-not-allowed" : "cursor-pointer"
                } text-white p-2 text-center text-sm rounded-md font-[Poppins]`}
              >
                Edit
              </button>
              <div
                className="flex items-center text-sm   border-2 border-white p-2 rounded-lg"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, "table2")}
              >
                <FaTableColumns />
                (2)
              </div>
              <div
                className="flex items-center text-sm   border-2 border-white p-2 rounded-lg"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, "table4")}
              >
                <FaTable />
                (4)
              </div>
              <div
                className="flex items-center text-sm   border-2 border-white p-2 rounded-lg"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, "table6")}
              >
                <LuTable />
                (6)
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
                  const onClickHandler = editMode
                    ? () => handleRemove(item.id)
                    : () => handleTableBook(item.id);

                  const isBooked = bookedtable.includes(item.id);

                  if (item.type === "table2") {
                    return (
                      <>
                        <div
                          key={item.id}
                          className={`absolute border border-black p-2 bg-white text-black w-20 h-20  ${
                            editMode ? "cursor-pointer" : "cursor-not-allowed"
                          } rounded-md`}
                          style={{ left: item.x, top: item.y }}
                          onClick={onClickHandler}
                        >
                          <FaTableColumns size={60} />
                        </div>
                      </>
                    );
                  } else if (item.type === "table4") {
                    return (
                      <>
                        <div
                          key={item.id}
                          className={`absolute border border-black p-1 flex items-center justify-center bg-white text-black w-36 h-24 ${
                            editMode ? "cursor-pointer" : "cursor-not-allowed"
                          } rounded-md`}
                          style={{ left: item.x, top: item.y }}
                          onClick={onClickHandler}
                        >
                          <FaTable size={90} />
                        </div>
                      </>
                    );
                  } else if (item.type === "table6") {
                    return (
                      <>
                        <div
                          key={item.id}
                          className={`absolute border flex items-center justify-center  border-black p-1 bg-white text-black w-36 h-32  ${
                            editMode ? "cursor-pointer" : "cursor-not-allowed"
                          } rounded-full`}
                          style={{ left: item.x, top: item.y }}
                          onClick={onClickHandler}
                        >
                          <LuTable size={90} />
                        </div>
                      </>
                    );
                  } else if (item.type === "chair") {
                    return (
                      <div
                        key={item.id}
                        className={`absolute border border-black p-2 ${
                          isBooked ? "bg-orange-700" : "bg-white"
                        } text-black w-8 h-8 ${
                          editMode ? "cursor-pointer" : "cursor-pointer"
                        } rounded-full`}
                        style={{ left: item.x, top: item.y }}
                        onClick={onClickHandler}
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
      )}

      <Dialog
        style={{ borderRadius: "20px" }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: {
            preventDefault: () => void;
            currentTarget: HTMLFormElement | undefined;
          }) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "orange",
          }}
        >
          Table Booking Details
        </DialogTitle>
        <DialogContent
          className="mt-4"
          style={{ height: "600px", width: "600px", overflowY: "auto" }}
        >
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="tableid"
            label="Table ID"
            value={bookingdetails.TableId}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="customername"
            label="Customer Name"
            type="text"
            value={bookingdetails.Customername}
            onChange={(e) =>
              setbookingdetails({
                ...bookingdetails,
                Customername: e.target.value,
              })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="phoneno"
            label="Customer Contact Info"
            type="text"
            value={bookingdetails.Customerphoneno}
            onChange={(e) =>
              setbookingdetails({
                ...bookingdetails,
                Customerphoneno: e.target.value,
              })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="people"
            label="How many people"
            type="text"
            value={bookingdetails.Howmanypeople}
            fullWidth
            variant="standard"
          />
          <div className="flex flex-col gap-6 mt-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={bookingdetails.Date}
                onChange={(newValue) =>
                  setbookingdetails({ ...bookingdetails, Date: newValue })
                }
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Time"
                value={bookingdetails.Time}
                onChange={(newValue) =>
                  setbookingdetails({ ...bookingdetails, Time: newValue })
                }
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              border: "1px solid #FFA500",
              color: "#FFA500",
              marginRight: "10px",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="border border-orange-500 text-orange-500 hover:bg-orange-100 hover:text-orange-600"
          >
            Cancel
          </Button>
          <Button
            onClick={storetablebookingdata}
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookTable;
