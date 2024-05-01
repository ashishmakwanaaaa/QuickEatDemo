"use client";

import { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { user } from "../../lib/reducers";
import Pusher from "pusher-js";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Drawer from "@mui/material/Drawer";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";

interface MessageDataType {
  username: string;
  message: string;
  userId: string;
  mode: boolean;
  timeStamp: string;
  sender?: string;
  Date?: Date | any;
}

const DrawerComponent = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const user = useSelector((state: user) => state.user.user);
  const userId = user._id;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageDataType[]>([]);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [Time, setTime] = useState<string>("");

  const [online, setOnline] = useState<boolean>(false);

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
  }, [open]);

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

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <div className="h-full flex flex-col justify-between bg-[url('https://www.shutterstock.com/image-vector/mobile-apps-pattern-musicchatgalleryspeaking-bubbleemailmagnifying-600nw-249638665.jpg')] bg-cover bg-no-repeat">
          <h1
            style={{ boxShadow: "0 0 4em orange" }}
            className="text-white font-[Poppins] text-center font-bold text-xl mb-4 p-4 rounded-b-3xl bg-orange-600"
          >
            QUICK-CHAT
            {!user.isAdmin && (
              <p className="text-sm text-green-400">
                {online ? "online" : "offline"}
              </p>
            )}
          </h1>
          <div className="overflow-y-auto h-full mb-4 ">
            {Object.keys(GroupMessageByDate).map((date, index) => (
              <div key={index}>
                <div className="text-sm text-white text-center bg-black rounded-md border-black w-1/3 mx-auto">
                  {date}
                </div>
                <ul className="flex flex-col mt-2">
                  {messages &&
                    messages.length > 0 &&
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === userId
                            ? "flex-row-reverse"
                            : "flex-row"
                        } gap-3 text-sm items-center`}
                      >
                        <img
                          className="rounded-full w-12 h-12 p-2 mb-[15px]"
                          src={`http://localhost:5000/uploads/${msg.username}`}
                          alt=""
                        />
                        <div className="flex flex-col">
                          <p
                            className={`${
                              msg.sender === userId
                                ? "bg-orange-500 max-w-[255px] text-white p-2 rounded-xl font[Poppins]"
                                : "bg-transparent max-w-[255px] border-2 border-orange-500 rounded-xl p-2 font-[Poppins]"
                            }`}
                          >
                            {msg.message}
                          </p>
                          <p className="text-xs text-gray-500 text-end">
                            {msg.timeStamp}
                          </p>
                        </div>
                      </div>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Anything......."
                className="flex-grow rounded-full border border-orange-600 p-2 mr-2 focus:outline-none"
              />
              <button
                onClick={sendmessage}
                className="bg-orange-600 text-white p-2 rounded-full flex items-center hover:bg-orange-700 focus:outline-none"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
