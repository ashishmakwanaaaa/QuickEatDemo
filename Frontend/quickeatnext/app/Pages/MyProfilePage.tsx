"use client";

import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import LoginContext from "../LoginState/logincontext";


const MyProfilePage = () => {
  const [image, setImage] = useState<File | null>(
    null
  );
  const [owner, setOwner] = useState<{
    _id: string;
    restaurantname: string;
    ownername: string;
    address: string;
    emailid: string;
    password: string;
    confirmpassowrd: string;
    image: string;
  }>({});
  console.log(typeof image);
  const StateContext = useContext(LoginContext);
  const { dispatch } = StateContext;
  console.log("stateContext", StateContext);
  const handleImageChange = (e: { target: { files: any[] } }) => {
    try {
      const file = e.target.files?.[0];
      setImage(file);
    } catch (error) {
      console.log(error);
    }
  };
  const updateProfile = async (e) => {
    e.preventDefault()
    console.log(image)
    if (image) {
      const formData = new FormData();
      const filename = Date.now() + image.name;
      formData.append("name", filename);
      formData.append("file", image);
      const response = await fetch('http://localhost:5000/auth/upload', {
        method: 'POST',
        body: formData
      })
      owner.image = filename;
      const data = await response.json();
    }

    try {
      const response = await fetch(
        `http://localhost:5000/auth/updateProfile/${owner._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(owner),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("success");
        // StateContext.image = owner.image;
        dispatch({ type: "UPDATE_IMAGE", payload: owner.image })
      } else {
        alert("error");
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    async function fetchOwner() {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/getUser/${StateContext.restaurantname}`
        );
        const data = await response.json();
        console.log(data);
        setOwner(data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOwner();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center p-2">
        <h1 className="text-2xl font-bold font-[Poppins] text-center">
          My Profile
        </h1>
        <hr className="border mt-3" />
        <div className="flex flex-row gap-16 mx-auto justify-start items-start">
          <div className="flex flex-row gap-6 w-2/3 mt-10 justify-start">
            {/* Upload Photo Section */}
            <div className="flex flex-col gap-6">
              <input
                onChange={handleImageChange}
                id="file-upload"
                className="hidden"
                type="file"
                name=""
              />
              <div className="w-72 h-72 p-2 items-center">
                {
                  StateContext.image && !image
                    ?

                    <img className="rounded-full" src={`http://localhost:5000/uploads/` + StateContext.image} alt="" />

                    : <>

                      <img
                        className="rounded-full w-72 h-72"
                        src={URL.createObjectURL(image)}
                        alt="Profile"
                      />
                    </>
                }
              </div>
              <label
                htmlFor="file-upload"
                className="bg-blue-500 font-[Poppins] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Upload Photo
              </label>
            </div>
          </div>
          {/* Profile Details Section */}
          <div className="flex flex-col gap-4 mt-10">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "500px" },
              }}
              noValidate
              autoComplete="off"
            >
              <p className="text-black font-bold font-[Poppins]">Owner Name</p>
              <TextField
                id="outlined-basic"
                value={owner.ownername}
                onChange={(e) =>
                  setOwner({ ...owner, ownername: e.target.value })
                }
                variant="outlined"
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "500px" },
              }}
              noValidate
              autoComplete="off"
            >
              <p className="text-black font-bold font-[Poppins]">
                Restaurant Name
              </p>
              <TextField
                id="outlined-basic"
                value={owner.restaurantname}
                onChange={(e) =>
                  setOwner({ ...owner, restaurantname: e.target.value })
                }
                variant="outlined"
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "500px" },
              }}
              noValidate
              autoComplete="off"
            >
              <p className="text-black font-bold font-[Poppins]">
                Restaurant Address:
              </p>
              <TextField
                id="outlined-basic"
                value={owner.address}
                onChange={(e) =>
                  setOwner({ ...owner, address: e.target.value })
                }
                variant="outlined"
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "500px" },
              }}
              noValidate
              autoComplete="off"
            >
              <p className="text-black font-bold font-[Poppins]">Email ID</p>
              <TextField
                id="outlined-basic"
                value={owner.emailid}
                onChange={(e) =>
                  setOwner({ ...owner, emailid: e.target.value })
                }
                variant="outlined"
              />
            </Box>
            <button
              onClick={updateProfile}
              className="bg-blue-500 text-white font-[Poppins] font-bold hover:bg-blue-800 p-2 w-full rounded-lg transfomr duration-300"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;

