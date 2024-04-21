"use client";

import { fetchUsers } from "@/lib/actions/userAction";
import { PaymentType } from "@/lib/reducers/paymentSlice/paymentReducers";
import { User } from "@/lib/reducers/userSlice/UserReducers";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Counter } from "../Admin/AdminDashboard";
import Swal from "sweetalert2";
import { user } from "@/lib/reducers";

const ManageUserPage = () => {
  const dispatch = useDispatch();
  const [sales, setsales] = useState<PaymentType[]>([]);
  const users = useSelector((state:user) => state.user.users);
  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);
  useEffect(() => {
    async function getAllSales() {
      try {
        const response = await fetch(
          "http://localhost:5000/payment/getAllSales"
        );
        const data = await response.json();
        setsales(data.payments);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSales();
  }, [sales]);

  const allpayments: { [userId: string]: number } = sales.reduce(
    (sumbyuserid: { [userId: string]: number }, sale) => {
      const userId = sale.userId;
      const amount = parseFloat(sale.amount);
      sumbyuserid[userId] = (sumbyuserid[userId] || 0) + amount;
      return sumbyuserid;
    },
    {}
  );

  const handleDeleteUser = async (id: string) => {
    try {
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
        const response = await fetch(
          `http://localhost:8000/auth/deleteuser/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();
        if (response.ok) {
          Swal.fire({
            title: "Delete User Successfully",
            icon: "success",
            timer: 1000,
          });
        } else {
          Swal.fire({
            title: "Error:" + data.message,
            icon: "error",
            timer: 1000,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {users.map((user: User, index: number) => {
          const alluserpayment = allpayments[user._id];
          console.log(alluserpayment);
          return (
            <>
              <div className="flex flex-col gap-3">
                <div key={index} className="relative h-full">
                  <div className="overflow-hidden rounded-lg h-full">
                    <img
                      src={`http://localhost:5000/uploads/${user.resimage}`}
                      className="rounded-lg cursor-pointer object-cover h-full hover:scale-100 transform duration-300"
                      alt={user.restaurantname} // Make sure to include alt attribute for accessibility
                    />
                    <div className="absolute bottom-0 left-0 w-full">
                      <div className="relative z-20 p-2">
                        <p className="text-orange-500 text-3xl font-bold">
                          {user.restaurantname}
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full rounded-lg h-32 bg-gradient-to-t from-black"></div>
                    </div>
                    <div className="top-0 right-0 absolute">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white rounded-lg text-lg p-2"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className="flex text-sm justify-between w-full rounded-3xl p-2 "
                    style={{ boxShadow: "0 0 1em gray" }}
                  >
                    <p className=" text-orange-800">Total Sales(&#8360;):</p>
                    <p>
                      &#8360;
                      <Counter targetValue={alluserpayment?.toFixed(2) || ""} />
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ManageUserPage;
