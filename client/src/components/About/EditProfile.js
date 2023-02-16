import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { userProfile, updateUser } from "../../utils/API_CALLS";

const EditProfile = ({ updateDetails }) => {
  const [updatedData, setUpdatedData] = useState({});

  const fetchDetails = async () => {
    const data = await userProfile();
    console.log(data);
    setUpdatedData(data);
  };

  const validate = () => {
    const { email, name, contact, location } = updatedData;
    if (!email || !name || !contact || !location) return false;
    return true;
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("All fields are required");
      return;
    }

    // console.log(updatedData);
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("email", updatedData.email);
    formData.append("location", updatedData.location);
    formData.append("contact", updatedData.contact);
    formData.append("profilePic", updatedData.profilePic);
    // console.log(updatedData.profilePic);
    // formData.append("name", updatedData.name);
    const data = await updateUser(formData);
    if (data?.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
      updateDetails();
    }
  };

  const imageUpload = (e) => {
    const profilePic = e.target.files[0];
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(profilePic.type)) {
      setUpdatedData({
        ...updatedData,
        profilePic: e.target.files[0],
      });
    } else {
      toast.error("Invalid Media Format");
      e.target.type = "text";
      e.target.type = "file";
    }
  };

  return (
    <div
      className="modal fade"
      id="profileModal"
      tabIndex="-1"
      aria-labelledby="profileModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="profileModalLabel">
              Edit Profile
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address*
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  value={updatedData.email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={handleInputs}
                  value={updatedData.name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contact" className="form-label">
                  Contact No*
                </label>
                <input
                  name="contact"
                  type="text"
                  className="form-control"
                  id="contact"
                  onChange={handleInputs}
                  value={updatedData?.contact}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="place" className="form-label">
                  Place*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="place"
                  name="location"
                  onChange={handleInputs}
                  value={updatedData?.location}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  onChange={imageUpload}
                  name="profilePic"
                />
                <label className="input-group-text" htmlFor="photo">
                  Upload
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => fetchDetails()}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;