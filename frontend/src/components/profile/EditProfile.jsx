import React, { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  changePassword as changePasswordApi,
  uploadAvatar, updateProfile
} from "../../services/authService";
import useAuth from "../../hooks/useAuth";

function EditProfile() {
  const {user,getUser} = useAuth();
  const [profileData, setProfileData] = useState({
    username: "",
    first_name:"",
    last_name: ""
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
      last_name: user?.last_name || ""
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
      alert("Passwords do not match!");
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
      const res = await updateProfile(profileData)
      if(res.status === 200) {
        getUser();
      }
    } catch (error) {
      console.error(error.response.data);
      setErrors(error.response?.data?.detail || "An error occurred while updating the profile.");
    }
  }

  return (
    <div className="lg:px-20 md:px-16 px-5">
      <div className="text-white text-[20px] font-bold">Update Profile</div>

      <div className="flex gap-5 mt-5 flex-col md:flex-col lg:flex-row">
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
                  className="min-w-10 bg-slate-500 p-1 rounded-md focus:outline-accent"
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
                  className="min-w-10 bg-slate-500 p-1 rounded-md focus:outline-accent"
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
                  className="min-w-10 bg-slate-500 p-1 rounded-md focus:outline-accent"
                />
              </div>

              {/* Error Display */}
              {errors.length > 0 && (
                <div className="text-red-500 mt-2">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="p-2 flex justify-between">
                <button type="submit" className="bg-accent text-black p-2">
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
                  className="min-w-10 bg-slate-500 p-1 rounded-md focus:outline-accent"
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
                  className="min-w-10 bg-slate-500 p-1 rounded-md focus:outline-accent"
                />
              </div>
              {errors.length > 0 && (
                <div className="text-red-500 mt-2">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              <div className="p-2 flex justify-between">
                <button type="submit" className="bg-accent text-black p-2">
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
              />
            )}
            <div className="ml-4">
              <div>Username: {user?.username}</div>
              <div>{user?.first_name} {user?.last_name}</div>
            </div>
          </div>
          <form onSubmit={handleImageSubmit} encType="multipart/form-data" className="border-t-2 border-primary border-dashed mt-10 pt-5">
            <label htmlFor="avatar" className="block mb-2">
              Upload Avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleImageChange}
              className="overflow-hidden overflow-ellipsis text-nowrap w-full"
            />

            <div>
              <button
                type="submit"
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
