import React from "react";

const MemberCard = ({ image, name, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-80">
      <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto object-cover" />
      <h2 className="text-xl font-semibold text-center mt-4 text-primary dark:text-primary">
        {name}
      </h2>
      <p className="text-gray-800 dark:text-gray-400 text-center mt-2">
        {description}
      </p>
    </div>
  );
};

export default MemberCard;
