"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ViewAllRestrurant = () => {
  const [users, setusers] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    async function getAllUser() {
      try {
        const res = await fetch("http://localhost:5000/auth/getalluser");
        const data = await res.json();
        setusers(data.users);
      } catch (error) {
        console.log(error);
      }
    }
    getAllUser();
  }, []);
  console.log(users);

  useEffect(() => {
    if (!mapInitialized && users.length > 0) {
      const map = L.map("map").setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ',
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHNrYjF2OG5vaG4yMXp1cWd2a2Vxc2xtazhtbGczZDdjaGZ1cXZ3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/QRKDnsEH9fgumBlUEq/giphy.gif",
        iconSize: [50, 50],
      });

      users.forEach((user) => {
        if (user.lat && user.long) {
          const customPopUp = `
                <div className="p-2 border border-orange-800">
                    <p className="text-orange-800 text-lg font-bold">${user.restaurantname}</p>
                </div>
            `;
          L.marker([user.lat, user.long], { icon: customIcon })
            .addTo(map)
            .bindPopup(customPopUp);
        }
      });
      setMapInitialized(true);
    }
  }, [users, mapInitialized]);
  return (
    <>
      <h1>View All restrurants</h1>
      <div
        id="map"
        className="border rounded-md p-2 drop-shadow-2xl"
        style={{ height: "600px" }}
      ></div>
    </>
  );
};

export default ViewAllRestrurant;
