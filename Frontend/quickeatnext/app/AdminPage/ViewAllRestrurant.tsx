"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/actions/userAction";
import { User } from "@/lib/reducers/userSlice/UserReducers";

const ViewAllRestrurant = () => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!mapInitialized && users.length > 0) {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      const map = L.map("map").setView([0, 0], 2);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ',
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHNrYjF2OG5vaG4yMXp1cWd2a2Vxc2xtazhtbGczZDdjaGZ1cXZ3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/QRKDnsEH9fgumBlUEq/giphy.gif",
        iconSize: [50, 50],
      });

      users.forEach((user: User) => {
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
        style={{ height: "600px", width: "68rem" }}
      ></div>
    </>
  );
};

export default ViewAllRestrurant;
