import React from "react";

const CustomButton = ({ title, containerStyles, iconRight, type, onclick }) => {
  return (
    <button
      onClick={onclick}
      type={type || "button"}
      className={`inline-flex items-center text-base ${containerStyles}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
