import { useEffect, useState } from "react";
import apiConfig from "../../config";
import axios from "axios";
import "./Profile.scss";

function Profile() {
  const [profileData, setProfileData] = useState({});
  const loadingProfile = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.myinfo;
      const body = {
        key: "value",
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(apiUrl, body, config);
      setProfileData(response.data);
      console.log(profileData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadingProfile();
  }, []);

  return (
    <div>
      {profileData && (
        <div className="profileinfo-container">
          <p>Tên tài khoản: {profileData.userName} </p>
          <p>
            Vai trò:{" "}
            {profileData.roles &&
              profileData.roles.map((role, index) => {
                return <li key={`role#${index}`}>{role}</li>;
              })}
          </p>
          <p>
            Quyền hạn:{" "}
            {profileData.permissions &&
              profileData.permissions.map((permission, index) => {
                return <li key={`permission#${index}`}>{permission}</li>;
              })}
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;
