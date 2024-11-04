import React from "react";

const MethodCard = ({ method, selectedMethod, handleMethodSelect, icon: Icon }) => {
  return (
    <div
      onClick={() => handleMethodSelect(method)}
      className={`flex-1 p-2 text-center rounded-lg cursor-pointer ${
        selectedMethod === method
          ? "shadow-selected shadow-green-800"
          : "border border-gray-100"
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
