"use client";

import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import LoginContext from "../LoginState/logincontext";
import { useRouter } from "next/navigation";

const MyProfilePage = () => {
  const [image, setImage] = useState<File | null>(null);
  const role = localStorage.getItem("role") || "";

  const [resimage, setresImage] = useState<File | null>(null);
  const [owner, setOwner] = useState<{
    _id: string;
    restaurantname: string;
    ownername: string;
    address: string;
    emailid: string;
    password: string;
    confirmpassowrd: string;
    image: string;
    resimage: string;
  }>({});
  console.log(typeof image);
  const StateContext = useContext(LoginContext);
  const { dispatch } = StateContext;
  console.log("stateContext", StateContext);
  const router = useRouter();
  const handleImageChange = (e: { target: { files: any[] } }) => {
    try {
      const file = e.target.files?.[0];
      setImage(file);
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageChange1 = (e: { target: { files: any[] } }) => {
    try {
      const file1 = e.target.files?.[0];
      setresImage(file1);
    } catch (error) {
      console.log(error);
    }
  };
  const updateProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(image, resimage);
    if (image || resimage) {
      const formData = new FormData();
      if (image) {
        const filename = Date.now() + image.name;
        console.log(filename);
        formData.append("name", filename);
        formData.append("files", image);
      }
      if (resimage) {
        const filename1 = Date.now() + resimage.name;
        formData.append("name1", filename1);
        formData.append("files", resimage);
      }
      const response = await fetch("http://localhost:5000/auth/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      owner.image = data.filenames[0];
      owner.resimage = data.filenames[1];
      console.log(data);
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
        Swal.fire({
          title: "Profile Update Successfully",
          icon: "success",
          timer: 1000,
        });
        {
          StateContext.login && role === "User"
            ? router.push("/dashboard")
            : router.push("/admin");
        }
        dispatch({
          type: "UPDATE_IMAGE",
          payload: { ownerimage: owner.image, restrurantimage: owner.resimage },
        });
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
        <div className="flex flex-row border border-gray-300 rounded-md gap-6 justify-center items-center">
          <div className="flex flex-row  w-[250px] justify-center items-center">
            {/* Upload Photo Section */}
            <div className="flex flex-col justify-center items-center gap-16">
              <div className="flex flex-col w-[150px] h-[150px]">
                {/* Image 1 */}
                <input
                  onChange={handleImageChange}
                  id="file-upload"
                  className="hidden"
                  type="file"
                  name=""
                />
                <div className="w-full h-full p-2 items-center">
                  {StateContext.image && !image ? (
                    <img
                      className="rounded-full"
                      src={`http://localhost:5000/uploads/${StateContext.image}`}
                      alt=""
                    />
                  ) : (
                    <>
                      {image && (
                        <img
                          className="rounded-full"
                          src={URL.createObjectURL(image)}
                          alt="Profile"
                        />
                      )}
                    </>
                  )}
                </div>
                <label
                  htmlFor="file-upload"
                  className="bg-blue-500 font-[Poppins] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Upload Photo
                </label>
              </div>
              {role === "User" && (
                <div className="flex flex-col w-[250px] h-[220px]">
                  {/* Image 2 */}
                  <input
                    onChange={handleImageChange1}
                    id="file-upload-1"
                    className="hidden"
                    type="file"
                    name=""
                  />
                  <div className="w-full h-full p-2 items-center">
                    {StateContext.resimage && !resimage ? (
                      <img
                        className="rounded-md"
                        src={`http://localhost:5000/uploads/${StateContext.resimage}`}
                        alt=""
                      />
                    ) : (
                      <>
                        {resimage && (
                          <img
                            className="rounded-md"
                            src={URL.createObjectURL(resimage)}
                            alt="Profile"
                          />
                        )}
                      </>
                    )}
                  </div>
                  <label
                    htmlFor="file-upload-1"
                    className="bg-blue-500 font-[Poppins] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    Upload Restaurant Image
                  </label>
                </div>
              )}
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
