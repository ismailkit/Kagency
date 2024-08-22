import React from "react";
import Jumping from "../../assets/vector/jumping.svg";
import ArrowForward from "../../assets/icons/ArrowForward.svg";
function Landing() {
  return (
    <div className="flex items-stretch justify-between p-36 border-black-500 border-x-[3px] rounded-t-xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl italic font-bold uppercase font-display">
          Hey, We’re Kagency!
        </h1>
        <p className="max-w-2xl mt-16 font-sans text-5xl font-medium leading-tight">
          You have an idea ? we’ve got the skills, the passion, and the flair to make it
          happen.
        </p>
        <a href="/about" className="flex items-center gap-3 mt-16 transition-all hover:gap-5">
          <span className="text-xl font-display leading-[120%] text-red-500 uppercase underline">
            more about us
          </span>
          <img className="inline-block" src={ArrowForward} alt="Arrow forward button" />
        </a>
      </div>
      <div className="">
        <img src={Jumping} alt="" />
      </div>
    </div>
  );
}

export default Landing;
