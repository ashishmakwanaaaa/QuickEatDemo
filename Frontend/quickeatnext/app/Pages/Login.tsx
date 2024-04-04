"use client";

import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoginContext from "../LoginState/logincontext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = (): React.JSX.Element => {
  const router = useRouter();

  const StateContext = useContext(LoginContext);

  const [formData, setFormData] = useState<{
    emailid: string;
    password: string;
  }>({
    emailid: "",
    password: "",
  });

  const [email, setEmail] = useState<string>("");
  const [text, setText] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen: () => void = () => {
    setOpen(true);
  };
  const handleClose: () => void = () => {
    setOpen(false);
    router.push("/signup");
  };

  async function validateUser(): Promise<void> {
    console.log(formData);
    const url = "http://localhost:5000/auth/login";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(res);
    if (res.status === 201) {
      StateContext.login = true;
      Swal.fire({
        icon: "success",
        title: "Successfully Login",
        timer: 3000,
      });
      StateContext.restaurantname = data.user.restaurantname;
      StateContext.ownername = data.user.ownername;
      StateContext.userid = data.user._id;
      console.log(StateContext);
      localStorage.setItem("token", data.token);
      {
        StateContext.login && router.push("/dashboard");
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Error:   " + data.message,
        timer: 3000,
      });
    }
  }
  console.log(StateContext);

  // console.log(StateContext)

  const handleSubmit = (e: { preventDefault: () => void }): void => {
    try {
      e.preventDefault();
      validateUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendLink = async (e: any): Promise<void> => {
    setOpen(false);
    try {
      console.log("try");
      e.preventDefault();
      const reponse = await fetch("http://localhost:5000/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log(reponse);
      if (reponse.ok) {
        setEmail("");
        Swal.fire({
          icon: "success",
          title: "Email Send Successfully",
          timer: 3000,
        });
        setText(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong",
          timer: 3000,
        });
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      {/* Background Videos */}
      <div className="fixed inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-90 "
          autoPlay
          loop
          muted
        >
          <source
            src="https://player.vimeo.com/external/376213205.sd.mp4?s=ee88744690535ad6c6598cfed6f940ef03fa3f49&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        {/* Add more video elements as needed */}
      </div>

      {/* Signup Box */}
      <div className="font-[Poppins] relative z-10 w-full md:w-[90%] lg:w-[70%] xl:w-[50%] 2xl:w-[40%] mx-auto bg-white p-8 rounded-lg text-center mt-20 md:mt-40 opacity-90">
        <span className="text-black font-bold text-lg text-center">
          Join QuickEat,{" "}
          <span className="text-orange-500 shadow-orange text-md text-center">
            Savor the Moment, Bite by Bite!
          </span>
        </span>
        <div className="flex flex-col p-5 gap-5 justify-start items-center mt-5">
          <div
            className="flex flex-col gap-2 items-start w-full"
            data-aos="fade-left"
          >
            <label htmlFor="restaurantName" className="font-bold">
              Enter Email ID:{" "}
            </label>
            <input
              type="text"
              id="restaurantemail"
              name="restaurantemail"
              value={formData.emailid}
              onChange={(e) =>
                setFormData({ ...formData, emailid: e.target.value })
              }
              placeholder="Enter Email ID"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
          <div
            className="flex flex-col gap-2 items-start w-full"
            data-aos="fade-left"
          >
            <label htmlFor="restaurantName" className="font-bold">
              Enter Password:{" "}
            </label>
            <input
              type="password"
              id="restaurantPsw"
              name="restaurantPsw"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter Password"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:text-orange-500 hover:bg-transparent transition-all duration-500 hover:border-orange-500 hover:border font-bold text-lg text-white p-2 rounded-lg"
          >
            Login
          </button>
          <span className="text-black text-sm mb-[-30px]">
            Don't Have An Account ?
            <Link href="/signup">
              {" "}
              <span className="text-orange-500 shadow-orange text-md font-bold cursor-pointer">
                Create a Account Here &larr;
              </span>
            </Link>
          </span>
          <span className="text-black text-sm mt-5">
            Forgot Your Password ?
            <Link href="">
              {" "}
              <span
                onClick={handleOpen}
                className="text-orange-500 shadow-orange text-md font-bold cursor-pointer"
              >
                Click Here &rarr;
              </span>
            </Link>
          </span>
          {text && (
            <p className="text-orange-500  text-center text-xl font-bold">
              Password Link Send Successfully In Email
            </p>
          )}
          <Dialog
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
                fontWeight: "bold",
                padding: "10px",
                marginTop: "20px",
                fontFamily: "'Poppins', sans-serif",
                textAlign: "center",
              }}
            >
              DID YOU FORGOT YOUR PASSWORD?
            </DialogTitle>

            <DialogContent>
              <DialogContentText
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  padding: "3px",
                }}
              >
                Enter Your email address you're using for your account below and
                we will send you a password reset link
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                value={email}
                label="Email Address"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                style={{ marginTop: "50px" }}
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                style={{ backgroundColor: "orange", color: "white" }}
              >
                {" "}
                &larr; Back to Sign up?
              </Button>
              <Button
                type="submit"
                onClick={handleSendLink}
                style={{ color: "orange", fontWeight: "bold" }}
              >
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Login;
