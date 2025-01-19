import React, { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  changePassword as changePasswordApi,
  uploadAvatar,
  updateProfile,
} from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import Footer from "../common/Footer";

function EditProfile() {
  const { user, getUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    // Set profile data to current user
    setProfileData({
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the field based on the input name
    }));
  };
  console.log(profileData);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleImageChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setErrors("");
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrors("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setErrors("Password must be at least 6 char long");
      return;
    }
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if (!regex.test(newPassword)) {
      setErrors(
        "Password must contain at least one uppercase letter, one special symbol, and at least two numbers."
      );
      return;
    }
    // Handle form submission logic
    try {
      const res = await changePasswordApi({
        new_password1: newPassword,
        new_password2: confirmPassword,
      });
      console.log(res);
      if (res.status === 200) {
        alert("Password Updated Sucessfully");
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.new_password2) {
        setErrors(error.response.data.new_password2);
      }
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    const formData = new FormData();

    console.log(avatar);
    if (avatar) {
      console.log("huh");
      formData.append("avatar", avatar);
      console.log(formData);
      try {
        // Make the API call to upload the image
        // You can replace `uploadAvatar` with your API function
        const response = await uploadAvatar(formData);
        console.log("Avatar uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors("");
    console.log(profileData);

    // Handle profile data submission (e.g., username, first name, last name)
    try {
      // Assuming you have an API endpoint to update the profile (you'll need to implement it)
      const res = await updateProfile(profileData);
      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      console.error(error.response.data);
      setErrors(
        error.response?.data?.detail ||
          "An error occurred while updating the profile."
      );
    }
  };

  return (
    <>
      <div className="lg:px-20 md:px-16 px-5">
        <div className="flex justify-start gap-20">
          <div className="text-white text-[20px] font-bold">Update Profile</div>
          {/* Error Display */}
          {errors && <div className="text-red-500 mt-2">{errors}</div>}
        </div>
        <div className="flex gap-5 mt-5 flex-col md:flex-col lg:flex-row text-[20px]">
          <div className="flex flex-col gap-5 md:w-full lg:w-1/2">
            <div className="border-2 border-primary border-dashed p-5">
              <form onSubmit={handleProfileUpdate} className="">
                {/* Username Field */}
                <div className="p-2 flex justify-between">
                  <label htmlFor="username">Username: </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="min-w-10 p-1 border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
                  />
                </div>

                {/* First Name Field */}
                <div className="p-2 flex justify-between">
                  <label htmlFor="firstName">First Name: </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleInputChange}
                    className="min-w-10 p-1 border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
                  />
                </div>

                {/* Last Name Field */}
                <div className="p-2 flex justify-between">
                  <label htmlFor="lastName">Last Name: </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleInputChange}
                    className="min-w-10 p-1 border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="p-2 flex justify-between">
                  <button type="submit" className="bg-accent text-text p-2">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
            <div className="border-2 border-primary border-dashed p-5 text-[20px]">
              <div className="text-[20px]">Change Password</div>
              <form onSubmit={handleSubmit} className="">
                <div className="p-2 flex justify-between">
                  <label htmlFor="newPassword">New Password: </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="min-w-10 p-1 border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
                  />
                </div>
                <div className="p-2 flex justify-between">
                  <label htmlFor="confirmPassword">Confirm Password: </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    className="min-w-10 p-1 border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
                  />
                </div>

                <div className="p-2 flex justify-between">
                  <button type="submit" className="bg-accent text-text p-2">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="md:w-full lg:w-1/2 h-auto border-2 border-primary border-dashed p-5 text-[20px] -order-1 md:-order-1 lg:order-1">
            <div className="flex flex-col items-center">
              {avatar && (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar Preview"
                  className="mt-3 h-24 w-24 object-cover block rounded-full"
                />
              )}
              {!avatar && (
                <img
                  src={`http://127.0.0.1:8000${user?.avatar}`}
                  alt="Avatar Preview"
                  className="mt-3 h-24 w-24 object-cover block rounded-full"
                  onError={(e) => {
                    e.target.onerror = null; // prevents infinite loop in case default fails
                    e.target.src = "/default-avatar.jpg"; // fallback to default avatar
                  }}
                />
              )}
              <div className="ml-4">
                <div>Username: {user?.username}</div>
                <div>
                  {user?.first_name} {user?.last_name}
                </div>
              </div>
            </div>
            <form
              onSubmit={handleImageSubmit}
              encType="multipart/form-data"
              className="border-t-2 border-primary border-dashed mt-10 pt-5"
            >
              <label htmlFor="avatar" className="block mb-2">
                Upload Avatar
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleImageChange}
                className="overflow-hidden w-full overflow-ellipsis text-nowrap flex-grow h-full p-2 text-lg border text-black bg-white border-gray-300 rounded-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
              />

              <div>
                <button type="submit" className="mt-4 p-2 bg-accent text-text">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
