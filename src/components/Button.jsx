import React from "react";

const Button = ({ title, onClick, disabled, className, type }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative border border-yellow-500 font-bold px-6 py-3 rounded transition-colors group overflow-hidden cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 rounded transform -translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-out cursor-pointer bg-yellow-500"></div>
      <div className="relative z-10 text-yellow-500 group-hover:text-black">
        {title}
      </div>
    </button>
  );
};

export default Button;
