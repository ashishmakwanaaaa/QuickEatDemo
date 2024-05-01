"use client";

import React, { useContext, useEffect, useState } from "react";
import { AiFillHome, AiFillInfoCircle } from "react-icons/ai";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Drawer from "@mui/material/Drawer";
import SendIcon from "@mui/icons-material/Send";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MdMiscellaneousServices, MdContactPage } from "react-icons/md";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import "aos/dist/aos.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LoginContext from "../LoginState/logincontext";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../lib/reducers/userSlice/UserReducers";
import { user } from "../../lib/reducers";
import { Badge } from "@mui/material";
import Pusher from "pusher-js";
import DrawerComponent from "./Drawer";

interface MessageDataType {
  username: string;
  message: string;
  userId: string;
  mode: boolean;
  timeStamp: string;
  sender?: string;
  Date?: Date | any;
}

const Navbar = () => {
  const user = useSelector((state: user) => state.user.user);
  console.log(user);
  const StateContext = useContext(LoginContext);
  const [openmenu, setOpenMenu] = useState<boolean>(false);
  const [dropdown, setDropDown] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageDataType[]>([]);
  const [online, setOnline] = useState<boolean>(false);
  const [Time, setTime] = useState<string>("");
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const userId = user._id;

  useEffect(() => {
    async function fetchMessage() {
      const response = await fetch("http://localhost:5000/message/allmessage");
      const data = await response.json();
      setMessages(data.allmessage);
    }
    fetchMessage();

    async function subscribePusher() {
      updateTime();
      Pusher.logToConsole = false;

      const pusherid: string | undefined | any =
        process.env.NEXT_PUBLIC_PusherID;
      const pushercluster: string | undefined | any =
        process.env.NEXT_PUBLIC_ClusterPusher;

      const pusher = new Pusher(pusherid, {
        cluster: pushercluster,
      });

      const channel = pusher.subscribe("chat");
      channel.bind("message", function(data: MessageDataType) {
        const { username, message, userId, mode, timeStamp } = data;
        console.log(messages, typeof messages);
        setMessages((prevMessages) => [
          ...prevMessages,
          { username, message, userId, mode, timeStamp },
        ]);
        if (!user.isAdmin && data.userId === user._id) {
          setOnline(data.mode);
        }
        if (!drawer) {
          setBadgeCount((prevCount) => prevCount + 1);
        }
      });
      console.log(messages);
      return () => {
        channel.unbind();
        pusher.unsubscribe("chat");
      };
    }
    subscribePusher();
  }, [drawer]);

  const groupMessageByDate = () => {
    const groupmessage: any = {};

    messages.forEach((msg) => {
      const date = new Date(msg.Date).toLocaleDateString();
      if (!groupmessage[date]) {
        groupmessage[date] = [];
      }
      groupmessage[date].push(msg);
    });
    return groupmessage;
  };

  const GroupMessageByDate = groupMessageByDate();

  const handleDrawerOpen = () => {
    setDrawer(true);
  };

  const sendmessage = async () => {
    updateTime();
    const bodyData = {
      username: user.image,
      message: message,
      userId: user._id,
      mode: user.isActive,
      timeStamp: Time,
    };
    const response = await fetch("http://localhost:5000/message/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });
    const data = await response.json();
    setMessage("");
  };

  const updateTime = () => {
    const currentTime = new Date().toLocaleTimeString();
    setTime(currentTime);
  };
  const router = useRouter();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user);
  const pathname = usePathname();
  console.log(messages);
  // const { login, restaurantname, ownername } = useContext(LoginContext);
  const [PasswordData, setPasswordData] = useState<{
    oldpassword: string;
    newpassword: string;
    newchangepassword: string;
  }>({
    oldpassword: "",
    newpassword: "",
    newchangepassword: "",
  });

  const handleDropDown: () => void = () => {
    setDropDown(!dropdown);
  };
  const handleClickOpen: () => void = () => {
    setOpen(true);
  };
  const handleClose: () => void = () => {
    setOpen(false);
  };

  console.log("Before Logout", user);
  const handleLogout = async (id: string) => {
    StateContext.login = false;
    dispatch(logoutUser());

    try {
      const response = await fetch(`http://localhost:5000/auth/logout/${id}`, {
        credentials: "include",
      });
      if (response.ok) {
        console.log(response);
        Swal.fire({
          title: "Logout Successfully",
          icon: "success",
          timer: 1000,
        });
        router.push("/login");
      }
    } catch (error) {
      console.log("error");
    }
  };
  console.log("After Logout", user);
  const handleChangePassword = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    if (PasswordData.newchangepassword !== PasswordData.newpassword) {
      Swal.fire({
        title: "Password Does Not Match",
        icon: "error",
        timer: 1000,
      });
    }
    setOpen(false);
    try {
      e.preventDefault();
      const response = await fetch(
        `http://localhost:5000/auth/updatepassword/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(PasswordData),
        }
      );
      const data = response.json();
      if (response.ok) {
        Swal.fire({
          title: "Password Change Succssfully",
          icon: "success",
          timer: 1000,
        });
      } else {
        Swal.fire({
          text: "Something Went Wrong" + data,
          icon: "error",
          timer: 1000,
        });
      }
    } catch (error) {
      window.alert(error);
    }
  };

  //   const LoginContext = useContext(LoginContext);
  return (
    <nav className="dark:bg-gray-900 bg-transparent sticky font-[Poppins] z-20 p-4  flex items-center justify-between  shadow-2xl rounded-lg">
      {/* Left side */}
      {!user.isActive ? (
        <>
          <div className="flex items-center cursor-pointer ">
            <span className="text-black  font-bold text-3xl">
              Quick
              <span className="text-orange-500 shadow-orange text-3xl">
                Eat
              </span>
            </span>
            <span>
              {" "}
              <img
                src="https://cdn.vectorstock.com/i/1000x1000/26/10/food-fork-spoon-fruit-orange-logo-vector-24042610.webp"
                alt="QuickEat Logo"
                className="h-6 w-12 rounded-full object-cover"
              />
            </span>
          </div>
          <button
            className="text-3xl text-orange-500 md:hidden"
            onClick={() => {
              console.log("Ashish");
              setOpenMenu(!openmenu);
            }}
          >
            {openmenu ? "✖" : "☰"}
          </button>
        </>
      ) : (
        <div className="flex items-center">
          <span className="text-black dark:text-gray-300  font-bold text-3xl">
            Welcome ,
            <span className="text-orange-500 shadow-orange text-3xl">
              {!user.isAdmin ? user.restaurantname : user.ownername}
            </span>
          </span>
        </div>
      )}

      {/* Center links */}
      {!user.isActive && (
        <div
          className={`md:flex items-center space-x-4 ${
            openmenu ? "flex" : "hidden"
          } flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-white gap-5 md:bg-transparent p-4 md:p-0 rounded-lg shadow-lg md:shadow-none`}
        >
          <Link
            href="/"
            className="text-black  gap-2 text-xl relative group flex items-center"
          >
            <span className="font-normal hover:text-orange-500 transform duration-300">
              Home
            </span>
            <AiFillHome color="#FF8C00" />
            <span
              className={`absolute inset-x-0 bottom-0 h-1 top-8 bg-orange-500 transform origin-left scale-x-0 ${
                pathname[1] === undefined
                  ? "scale-x-100"
                  : "group-hover:scale-x-100"
              } group-hover:scale-x-100 transition-transform duration-300`}
            ></span>
          </Link>

          <Link
            href="/AboutUs"
            className="text-black gap-2 text-xl relative group flex items-center"
          >
            <span className="font-normal hover:text-orange-500 transform duration-300">
              About Us
            </span>
            <AiFillInfoCircle color="#FF8C00" />
            <span
              className={`absolute inset-x-0 bottom-0 h-1 top-8 bg-orange-500 transform origin-left scale-x-0 ${
                pathname[1] === "A" ? "scale-x-100" : "group-hover:scale-x-100"
              } group-hover:scale-x-100 transition-transform duration-300`}
            ></span>
          </Link>

          <Link
            href="/Service"
            className="text-black gap-2 text-xl relative group flex items-center"
          >
            <span className="font-normal hover:text-orange-500 transform duration-300">
              Services
            </span>
            <MdMiscellaneousServices color="#FF8C00" />
            <span
              className={`absolute inset-x-0 bottom-0 h-1 top-8 bg-orange-500 transform origin-left scale-x-0 ${
                pathname[1] === "S" ? "scale-x-100" : "group-hover:scale-x-100"
              } group-hover:scale-x-100 transition-transform duration-300`}
            ></span>
          </Link>

          <Link
            href="/ContactUs"
            className="text-black gap-2 text-xl relative group flex items-center"
          >
            <span className="font-normal hover:text-orange-500 transform duration-300">
              Contact Us
            </span>
            <MdContactPage color="#FF8C00" />
            <span
              className={`absolute inset-x-0 bottom-0 h-1 top-8 bg-orange-500 transform origin-left scale-x-0 ${
                pathname[1] === "C" ? "scale-x-100" : "group-hover:scale-x-100"
              } group-hover:scale-x-100 transition-transform duration-300`}
            ></span>
          </Link>
        </div>
      )}

      {/* Right side */}
      {!user.isActive ? (
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="bg-orange-500 border-2 border-orange-500 w-24  text-white py-2 px-4 rounded-xl hover:bg-transparent hover:text-orange-500 hover:border-orange-500 transition duration-500">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-orange-500 border-2 border-orange-500 text-white py-2 px-4 rounded-xl hover:bg-transparent hover:text-orange-500 hover:border-orange-500 transition duration-500">
              Sign Up
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-row items-center space-x-4 ml-[-70px]">
          {!user.isAdmin ? (
            <>
              <Link href="/addcustomer">
                <button className="bg-orange-500 border-2 border-orange-500 w-44  text-white py-2 px-4 rounded-xl hover:bg-transparent hover:text-orange-500 hover:border-orange-500 transition duration-500">
                  Add Customer +
                </button>
              </Link>
              <Link href="/additem">
                <button className="bg-orange-500 border-2 border-orange-500 text-white py-2 px-4 rounded-xl hover:bg-transparent hover:text-orange-500 hover:border-orange-500 transition duration-500">
                  Add Food +
                </button>
              </Link>
              <div
                className="text-orange-500 cursor-pointer"
                onClick={handleDrawerOpen}
              >
                <ChatIcon />
              </div>
            </>
          ) : (
            <>
              <div
                className="text-orange-500 cursor-pointer"
                onClick={() => {
                  setDrawer(true);

                  setBadgeCount(0);
                }}
              >
                <Badge
                  badgeContent={badgeCount}
                  classes={{ badge: "bg-orange-500 text-white" }}
                >
                  <div className="bg-tranparent border border-orange-400 p-1 rounded-xl drop-shadow-2xl">
                    <NotificationsIcon />
                  </div>
                </Badge>
              </div>
            </>
          )}
          {user.image ? (
            <div
              className="w-12 h-12 rounded-full ml-[36] cursor-pointer "
              onClick={handleDropDown}
            >
              <img
                className="rounded-full"
                src={`http://localhost:5000/uploads/` + user.image}
                alt=""
              />
            </div>
          ) : (
            <div className="w-12 h-12 cursor-pointer rounded-full ml-[36] bg-black text-white">
              <p
                onClick={handleDropDown}
                className="text-center text-2xl  mt-2 cursor-pointer"
              >
                {user.ownername[0]}
              </p>
            </div>
          )}
          {dropdown && user.image && (
            <div
              className={`absolute top-full bg-white border border-gray-300 left-[1250px] rounded-md shadow-lg mt-2 z-10  transform -translate-x-1/2`}
            >
              <div className="w-72 h-full flex flex-col p-1 ">
                <div className=" w-full h-12 ">
                  <img
                    className="w-full h-16 rounded-t-md "
                    src="https://s3-alpha.figma.com/hub/file/3985988130/c4546d67-7453-4705-8641-64be00123f64-cover.png"
                    alt=""
                  />
                </div>
                <div className="w-16 h-16 rounded-full ml-[36] mt-[-20px] m-auto text-white">
                  <p
                    onClick={handleDropDown}
                    className=" text-center text-2xl mt-1 cursor-pointer"
                  >
                    <img
                      className="rounded-full"
                      src={`http://localhost:5000/uploads/` + user.image}
                      alt=""
                    />
                  </p>
                </div>

                <ul className="p-4">
                  <li
                    onClick={() => {
                      StateContext.login && router.push("/myprofile");
                    }}
                    className="px-4 py-2 flex items-center hover:rounded-md hover:ml-2 transform duration-300 cursor-pointer text-md hover:bg-black hover:text-white"
                  >
                    <PermIdentityIcon /> My Profile
                  </li>
                </ul>

                <hr className="border" />

                <ul className="p-4">
                  <li
                    onClick={handleClickOpen}
                    className="px-4 py-2 flex items-center hover:rounded-md hover:ml-2 transform duration-300 cursor-pointer text-md hover:bg-black hover:text-white"
                  >
                    <LockOpenIcon /> Change Password
                  </li>
                </ul>

                <hr className="border" />
                <ul className="p-4">
                  <li
                    onClick={() => handleLogout(user._id)}
                    className="px-4 py-2 flex items-center hover:rounded-md hover:ml-2 transform duration-300 cursor-pointer text-md hover:bg-black hover:text-white"
                  >
                    <LogoutIcon /> Logout
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
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
            color: "white",
            fontWeight: "bold",
            backgroundColor: "orange",
          }}
        >
          CHANGE PASSWORD HERE
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-row gap-8 justify-center items-center">
            <img
              src="https://calendar.thehoneybunfoundation.com/lottie/anime1.gif"
              className="w-1/2 h-1/2 p-2 drop-shadow-2xl rounded-2xl"
              alt=""
            />
            <div className="flex flex-col gap-8 justify-center">
              <DialogContentText
                style={{
                  fontStyle: "Poppins",
                  fontSize: "15px",
                  color: "black",
                  textAlign: "center",
                }}
              >
                Update your password for enhanced security.
              </DialogContentText>
              <TextField
                autoFocus
                value={PasswordData.oldpassword}
                onChange={(e) =>
                  setPasswordData({
                    ...PasswordData,
                    oldpassword: e.target.value,
                  })
                }
                required
                margin="dense"
                id="name"
                name="email"
                label="Enter Old Password"
                type="password"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                value={PasswordData.newpassword}
                onChange={(e) =>
                  setPasswordData({
                    ...PasswordData,
                    newpassword: e.target.value,
                  })
                }
                required
                margin="dense"
                id="name"
                name="email"
                label="Enter New Password"
                type="password"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                value={PasswordData.newchangepassword}
                onChange={(e) =>
                  setPasswordData({
                    ...PasswordData,
                    newchangepassword: e.target.value,
                  })
                }
                required
                margin="dense"
                id="name"
                name="email"
                label="Confirm New Password"
                type="password"
                fullWidth
                variant="standard"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              border: "1px solid #FFA500",
              color: "#FFA500",
              marginRight: "10px",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            type="submit"
            onClick={handleChangePassword}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <DrawerComponent open={drawer} onClose={() => setDrawer(false)} />
    </nav>
  );
};

export default Navbar;
