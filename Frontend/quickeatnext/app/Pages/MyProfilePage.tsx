"use client";

import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import LoginContext from "../LoginState/logincontext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { updateUser } from "../../lib/reducers/userSlice/UserReducers";
import { user } from "../../lib/reducers";
import { useAppDispatch } from "lib/store";

const MyProfilePage = () => {
  const [image, setImage] = useState<File | null>(null);
  const user = useSelector((state: user) => state.user.user);
  const [reviewData, setReviewData] = useState<{
    userid: string;
    message: string;
    star: number;
  }>({
    userid: user._id,
    message: "",
    star: 0,
  });
  const [resimage, setresImage] = useState<File | null>(null);
  const [owner, setOwner] = useState({
    _id: "",
    restaurantname: "",
    ownername: "",
    address: "",
    emailid: "",
    password: "",
    confirmpassowrd: "",
    image: "",
    resimage: "",
  });

  console.log(typeof image);
  const StateContext = useContext(LoginContext);
  // const { dispatch } = StateContext;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const GiveReview = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/reviews/createReview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Review Submit Successfully",
          icon: "success",
          timer: 1000,
        });
        setReviewData({ userid: "", message: "", star: 0 });
      } else {
        Swal.fire({
          title: "Error:" + data.message,
          icon: "warning",
          timer: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      const file = e.target.files?.[0];
      setImage(file ?? null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageChange1: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    try {
      const file1 = e.target.files?.[0];
      setresImage(file1 ?? null);
    } catch (error) {
      console.log(error);
    }
  };
  const updateProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const updatedUser = { ...user };
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
      console.log(data);
      updatedUser.image = data.filenames[0];
      updatedUser.resimage = data.filenames[1];
    }

    try {
      const response = await fetch(
        `http://localhost:5000/auth/updateProfile/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      const data = await response.json();
      console.log("data");

      if (dispatch && response.ok) {
        Swal.fire({
          title: "Profile Update Successfully",
          icon: "success",
          timer: 1000,
        });
        console.log(updatedUser);
        // dispatch({
        //   type: "UPDATE_IMAGE",
        //   payload: { ownerimage: user.image, restrurantimage: user.resimage },
        // });
        dispatch(updateUser(updatedUser) as any);
      } else {
        alert("error");
        console.log(data.message);
      }
      {
        !user.isAdmin ? router.push("/dashboard") : router.push("/adminside");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function fetchOwner() {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/getUser/${user.restaurantname}`
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
      <div className="flex flex-col h-full font-[Poppins] p-2 justify-center ">
        <div className="flex justify-between shadow-2xl ">
          <div
            onClick={() => router.push("/dashboard")}
            className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer"
          >
            <KeyboardBackspaceIcon />
          </div>
          <h1 className="text-2xl font-bold  text-center">My Profile</h1>
        </div>
        <hr className="border mt-3" />
        <div className="flex flex-row rounded-md gap-6 justify-center items-center h-[550px] bg-[url('https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg')] bg-no-repeat bg-cover">
          <div className="flex flex-row  w-[250px] justify-center items-center">
            {/* Upload Photo Section */}
            <div className="flex flex-col justify-center items-center gap-5">
              <div className="flex flex-col gap-2 items-center">
                {/* Image 1 */}
                <input
                  onChange={handleImageChange}
                  id="file-upload"
                  className="hidden"
                  type="file"
                  name=""
                />
                <div className="relative w-32 h-32 overflow-hidden rounded-full">
                  {user.image && !image ? (
                    <img
                      className="absolute inset-0 w-full h-full object-cover"
                      src={`http://localhost:5000/uploads/${user.image}`}
                      alt=""
                    />
                  ) : (
                    <>
                      {image && (
                        <img
                          className="absolute inset-0 w-full h-full object-cover"
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
              {!user.isAdmin && (
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
                    {user.resimage && !resimage ? (
                      <img
                        className="rounded-md"
                        src={`http://localhost:5000/uploads/${user.resimage}`}
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
          <div className="flex flex-col gap-10 border-r-4 rounded-md mt-5 border-white p-6">
            <div
              style={{ boxShadow: "0 0  1em gray" }}
              className="text-black font-[Poppins] text-sm flex font-normal gap-2  border border-gray-400 rounded-lg p-2 drop-shadow-2xl  w-full"
            >
              Personal Information
            </div>
            <div
              style={{ boxShadow: "0 0 1em gray " }}
              className="rounded-md p-2"
            >
              <div className="flex flex-row gap-2">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "300px" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <p className="text-black font-bold font-[Poppins]">
                    Owner Name
                  </p>
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
                    "& > :not(style)": { m: 1, width: "300px" },
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
              </div>
              <div className="flex flex-row gap-2">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "300px" },
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
                    "& > :not(style)": { m: 1, width: "300px" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <p className="text-black font-bold font-[Poppins]">
                    Email ID
                  </p>
                  <TextField
                    id="outlined-basic"
                    value={owner.emailid}
                    onChange={(e) =>
                      setOwner({ ...owner, emailid: e.target.value })
                    }
                    variant="outlined"
                  />
                </Box>
              </div>
            </div>
            <button
              onClick={updateProfile}
              className="bg-blue-500 text-white font-[Poppins] font-bold hover:bg-blue-800 p-2 w-full rounded-lg transfomr duration-300"
            >
              Save Profile
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={GiveReview}
              className="bg-blue-500 w-1/2 drop-shadow-2xl text-white rounded-md hover:bg-blue-800 transform duration-300 p-2 "
            >
              Add Review
            </button>
            <textarea
              placeholder="Give Feedback Here............."
              className="rounded-xl p-2 text-gray-500 drop-shadow-2xl"
              name=""
              value={reviewData.message}
              onChange={(e) =>
                setReviewData({ ...reviewData, message: e.target.value })
              }
              id=""
              cols={20}
              rows={7}
            ></textarea>
            <Rating
              name="simple-controlled"
              value={reviewData.star}
              onChange={(e: any) => {
                setReviewData({ ...reviewData, star: e.target.value });
              }}
              // onChange={(event, newValue) => {
              //   setValue(newValue);
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;
