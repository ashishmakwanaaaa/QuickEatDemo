"use client";

import React, { useEffect, useState } from "react";
import Carousel from "@itseasy21/react-elastic-carousel";
import { Rating } from "@mui/material";
import { User } from "lib/reducers/userSlice/UserReducers";

interface ReviewType {
  userid: User;
  message: string;
  star: number;
}

const ReviewPage = () => {
  const [reviews, setreviews] = useState<ReviewType[]>([]);
  useEffect(() => {
    async function fetchReviews() {
      const response = await fetch(
        "http://localhost:5000/reviews/getallreviews"
      );
      const data = await response.json();
      setreviews(data.reviews);
    }
    fetchReviews();
  }, []);
  return (
    <>
      <div className="flex font-[Poppins] flex-col items-center gap-6 p-6 bg-[url('https://c-suiteresources.com/wp-content/uploads/2015/10/home-testimonial-background.jpg')]">
        <p
          className="font-bold  text-4xl text-center text-white"
          data-aos="zoom-in"
        >
          Our Testinomials
        </p>
        <div className="bg-white h-1 w-32 rounded"></div>
        <Carousel
          showArrows={true}
          isRTL={false}
          pagination={false}
          itemsToShow={1}
          itemsToScroll={1}
        >
          {reviews?.length > 0 ? (
            reviews.map((review, index) => {
              return (
                <>
                  <div
                    data-aos="fade-down"
                    className="flex flex-col gap-4 border-2 border-cyan-900 rounded-xl p-8 w-1/2 items-center"
                  >
                    <img
                      src={`http://localhost:5000/uploads/${review.userid.image}`}
                      alt=""
                      className="rounded-full  w-24 h-24"
                    />
                    <div className="flex flex-col items-center">
                      <p className="font-bold">{review.userid.ownername}</p>
                      <p className="text-3xl text-white font-bold">
                        {review.userid.restaurantname}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-2 drop-shadow-2xl rounded-2xl ">
                      <p className="text-sm text-gray-900 ">
                        {" "}
                        <span className="text-5xl text-black font-bold">
                          &ldquo;
                        </span>{" "}
                        {review.message}
                      </p>

                      <Rating name="read-only" value={review.star} readOnly />
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <p> NO Data</p>
          )}
        </Carousel>
      </div>
    </>
  );
};

export default ReviewPage;
