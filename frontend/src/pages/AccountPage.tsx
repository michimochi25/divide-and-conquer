import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import RoleBar from "../components/RoleBar";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { twMerge } from "tailwind-merge";
import axios from "axios";

const AccountPage = () => {
  const navigate = useNavigate();
  const userId = useParams().userId;
  const { userData, setUserData, logout } = useAuth();
  const [avatarEditMode, setAvatarEditMode] = useState(false);

  const getUser = async () => {
    try {
      const user = await axios.get(`http://localhost:3000/user/${userId}`);
      if (!user || !user.data) {
        throw new Error("User data not found");
      }
      setUserData(user.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const updateUser = async () => {
    try {
      const resp = await axios.put(`http://localhost:3000/user/${userId}`, {
        data: userData,
      });
      console.log("User data updated:", resp.data);
      setAvatarEditMode(!avatarEditMode);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <div className="flex gap-5 justify-between w-[90%] max-w-full px-10 z-0">
        <Container
          className="p-8"
          children={
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="font-bold text-2xl">{userData?.name}</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                  text="My classes"
                  className="w-full text-2xl"
                  onClick={() => navigate(`/user/${userId}/classes`)}
                />
                <Button
                  text="Change profile"
                  className="w-full text-2xl"
                  onClick={() => setAvatarEditMode(!avatarEditMode)}
                />
                <Button
                  text="Settings"
                  className="w-full text-2xl"
                  onClick={() => {}}
                />
                <Button
                  text=""
                  className="text-2xl p-2"
                  icon={
                    <span className="material-symbols-sharp">exit_to_app</span>
                  }
                  onClick={() => logout()}
                />
              </div>
            </div>
          }
        />
        <div className="flex flex-col gap-5 flex-1 items-center">
          <RoleBar
            role={`${userData?.isAdmin ? "Admin" : "Student"}`}
            points={100}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-sharp cursor-pointer select-none"
                style={{
                  fontSize: "54px",
                  visibility: avatarEditMode ? "visible" : "hidden",
                }}
                onClick={() => {
                  if (userData) {
                    setUserData({
                      ...userData,
                      avatar: (userData.avatar - 1 + 8) % 8,
                    });
                  }
                }}
              >
                arrow_left
              </span>
              <div className="w-15%">
                <img
                  className={twMerge("sprite ", `sprite-${userData?.avatar}`)}
                />
              </div>
              <span
                className="material-symbols-sharp cursor-pointer select-none"
                style={{
                  fontSize: "54px",
                  visibility: avatarEditMode ? "visible" : "hidden",
                }}
                onClick={() => {
                  if (userData) {
                    setUserData({
                      ...userData,
                      avatar: (userData.avatar + 1) % 8,
                    });
                  }
                }}
              >
                arrow_right
              </span>
            </div>
            <Button
              text="Save"
              type="button"
              onClick={() => updateUser()}
              className={twMerge(
                "text-xl",
                avatarEditMode ? "visible" : "invisible"
              )}
              icon={<span className="material-symbols-sharp">save</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
