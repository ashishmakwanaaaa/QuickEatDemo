"use client";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import "aos/dist/aos.css";
import AOS from "aos";
import { useRouter } from "next/navigation";
import { DataGrid, GridRowSelectionApi } from "@mui/x-data-grid";

export interface Customer {
  _id?: string;
  firstname: string;
  lastname: string;
  emailid: string;
  phoneno: number;
  address: string;
  state: string;
  city: string;
  pincode: string;
}

const CustomerList = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] = useState<Customer>({});
  const router = useRouter();

  const getRandomColor = (): string => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const handleClickOpen = async (id: string) => {
    console.log(id);
    try {
      const response = await fetch(
        `http://localhost:5000/customer/getCustomer/${id}`
      );
      const data = await response.json();
      console.log(data);
      setEditCustomer(data.customer);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(editCustomer);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOrder = (id: string | undefined): void => {
    router.push(`/customerlist/${id}`);
  };

  const handleEditCustomer = async (editCustomer: Customer) => {
    try {
      setOpen(false);
      const confirm = await Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      });

      if (confirm.isConfirmed) {
        console.log(editCustomer);
        const id = editCustomer._id;
        const response = await fetch(
          `http://localhost:5000/customer/editCustomer/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editCustomer),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setOpen(false);
          Swal.fire({
            title: "Customer Update Successfully",
            icon: "success",
            timer: 2000,
          });
        } else {
          Swal.fire({
            text: "Error:    " + data.message,
            icon: "error",
            timer: 1000,
          });
        }
        FetchData();
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const handelDeleteCustomer = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are You Sure You Want to Delete This Customer?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/customer/deleteCustomer/${id}`,
          {
            method: "DELETE",
          }
        );

        console.log("Response status:", response);

        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
          Swal.fire({
            title: "Delete Successful",
            icon: "success",
            timer: 1000,
          });
          FetchData();
        } else {
          Swal.fire({
            title: "Delete Failed",
            text:
              data.message ||
              "Failed to delete customer. Please try again later.",
            icon: "error",
            timer: 1000,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert(
          "An error occurred while deleting the customer. Please try again later."
        );
      }
    }
  };

  async function FetchData() {
    const response = await fetch(
      "http://localhost:5000/customer/getAllCustomer"
    );
    const data = await response.json();
    console.log(data);
    setCustomerData(data.customers);
  }
  useEffect(() => {
    FetchData();
  }, []);
  const columns = [
    {
      field: "id",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "ID",
      width: 90,
    },
    {
      field: "Profile",
      cellClassName: () =>
        `text-black w-10 h-10 text-sm font-bold m-auto cursor-pointer p-2`,
      headerName: "Profile",
      width: 100,
      renderCell: (params) => {
        const initials = params.row.Profile;
        const randomColor = getRandomColor();
        const profileStyle = {
          backgroundColor: randomColor,
        };

        return (
          <div className="flex items-start justify-start">
            <div
              className="rounded-full w-10 h-10 mt-1 flex items-center justify-center"
              style={profileStyle}
            >
              <span
                onClick={() => {
                  router.push(`customerprofile/${params.row._id}`);
                }}
                className="text-white font-bold text-sm"
              >
                {initials}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: "firstname",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "FirstName",
      width: 150,
    },
    {
      field: "lastname",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "LastName",
      width: 120,
    },
    {
      field: "contact",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Contact No.",
      width: 120,
    },
    {
      field: "takeorder",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Take Order",
      cellClassName:
        "text-orange-600 text-md font-bold m-auto cursor-pointer p-2",
      width: 90,
      renderCell: (params: { row: object }) => (
        <button
          onClick={() => handleOrder(params.row._id)}
          className="text-orange-600 font-bold text-md"
        >
          Order &rarr;
        </button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      cellClassName: "text-green-800 font-bold text-center capitalize",
      width: 100,
      renderCell: (params: GridRowSelectionApi) => (
        <Button
          onClick={() => handleClickOpen(params.row._id)}
          style={{ color: "green", padding: "2px", fontSize: "20px" }}
        >
          <MdEdit />
        </Button>
      ),
    },
    {
      field: "delete",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Delete",
      width: 60,
      renderCell: (params: GridRowSelectionApi) => (
        <Button
          onClick={() => handelDeleteCustomer(params.row._id)}
          style={{ color: "red", padding: "2px", fontSize: "20px" }}
        >
          <MdDelete />
        </Button>
      ),
    },
  ];
  const rows = customerData
    .filter((customer) => customer.firstname.toLowerCase().includes(query))
    .map((customer, index) => ({
      _id: customer._id,
      id: index + 1,
      Profile:
        customer.firstname[0].toUpperCase() +
        "" +
        customer.lastname[0].toUpperCase(),
      firstname: customer.firstname,
      lastname: customer.lastname,
      contact: customer.phoneno,
      takeorder: "Order",
      edit: "Edit",
      delete: "Delete",
    }));
  console.log(customerData);

  return (
    <div className="font-[Poppins] flex flex-col mt-4 gap-3 justify-center items-center">
      <div className="flex justify-between items-center gap-[400px]">
        <h1 className="font-bold text-start">Customer Details</h1>
        <input
          type="text"
          name=""
          id=""
          value={query}
          data-aos="fade-right"
          onChange={(e) => setQuery(e.target.value)}
          className="border text-sm border-orange-500 rounded-lg p-2"
          placeholder="Search Customer Here"
        />
      </div>
      <div className="w-[900px] h-[600px]" data-aos="fade-right">
        <DataGrid
          style={{ fontFamily: "Poppins" }}
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[
            10,
            20,
            30,
            40,
            100,
            { value: 1000, label: "1,000" },
          ]}
        />
      </div>
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
          EDIT CUSTOMER
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
            name="email"
            label="First Name"
            value={editCustomer.firstname}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, firstname: e.target.value })
            }
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
            name="email"
            label="Last Name"
            type="text"
            value={editCustomer.lastname}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, lastname: e.target.value })
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
            name="email"
            label="Email Address"
            type="email"
            value={editCustomer.emailid}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, emailid: e.target.value })
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
            name="email"
            label="Contact No"
            type="number"
            value={editCustomer.phoneno}
            onChange={(e) =>
              setEditCustomer({
                ...editCustomer,
                phoneno: parseInt(e.target.value),
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
            name="email"
            label="Address"
            type="text"
            value={editCustomer.address}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, address: e.target.value })
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
            name="email"
            label="State"
            type="text"
            value={editCustomer.state}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, state: e.target.value })
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
            name="email"
            label="City"
            type="text"
            value={editCustomer.city}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, city: e.target.value })
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
            name="email"
            label="Pincode"
            type="text"
            value={editCustomer.pincode}
            onChange={(e) =>
              setEditCustomer({ ...editCustomer, pincode: e.target.value })
            }
            fullWidth
            variant="standard"
          />
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
            onClick={() => handleEditCustomer(editCustomer)}
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerList;
