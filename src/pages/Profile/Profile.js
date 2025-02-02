import React, { useEffect, useState } from "react";
import "./profile.css";
import TitlebarBelowImageList from "../../components/ImageList copy";
import ImageList from "../../components/ImageList";
import ImageListNew from "../../components/ImageListNew";
import { getCurrentUser } from "../../services/authService";
import { getUserData } from "../../services/userDataService";

function Profile(props) {
  const user = getCurrentUser();
  const [userData, setUserData] = useState([]);
  //const [newData, setNewData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        if (data && Array.isArray(data)) {
          setUserData(data);
          console.log("Data fetched successfully:", data);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="profileBox">
      <div className="top">Hi {user.username}'s Profile</div>
      <div className="bottom">
        <div className="left">
          <ImageListNew
            userId={user.id}
            refresh={props.refresh}
            count={props.count}
            setCount={props.setCount}
          />
          
        </div>
        {/* <div className="right">
          <div>Username : {user.username}</div>
          <div>Email : {user.email}</div>
          
        </div> */}
      </div>
    </div>
  );
}

export default Profile;
