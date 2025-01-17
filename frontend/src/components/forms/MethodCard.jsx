import React from "react";

const MethodCard = ({ method, selectedMethod, handleMethodSelect, icon: Icon }) => {
  return (
    <div
      onClick={() => handleMethodSelect(method)}
      className={`flex-1 p-2 text-center rounded-lg cursor-pointer hover:text-accent text-black dark:text-white ${
        selectedMethod === method
          ? "shadow-selected shadow-accent border-2 border-accent"
          : "border-2 border-primary"
      }`}
    >
      <h3 className="font-semibold flex items-center justify-center">
        <span className="flex items-center">
          <Icon className="mr-2" />
          {method.charAt(0).toUpperCase() + method.slice(1)}
        </span>
      </h3>
    </div>
  );
};

export default MethodCard;
