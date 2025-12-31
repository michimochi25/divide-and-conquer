import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import RoleBar from "../components/RoleBar";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { useErrorContext } from "../ErrorContext";

const AccountPage = () => {
  const navigate = useNavigate();
  const { userData, setUserData, logout } = useAuth();
  const { setErrorMsg } = useErrorContext();
  const [avatarEditMode, setAvatarEditMode] = useState(false);

  const getUser = async () => {
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/${
          userData?._id
        }`
      );
      if (!user || !user.data) {
        throw new Error("User data not found");
      }
      setUserData(user.data.user);
    } catch (error) {
      setErrorMsg("Failed to fetch user data:", error);
    }
  };

  const updateUser = async () => {
    try {
      const resp = await axios.put(
        `http://localhost:3000/user/${userData?._id}`,
        {
          data: userData,
        }
      );
      console.log("User data updated:", resp.data);
      setAvatarEditMode(!avatarEditMode);
    } catch (error) {
      setErrorMsg("Failed to update user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      getUser();
    } else {
      console.log("Failed fetching..");
    }
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <div className="flex gap-5 justify-center sm:w-[90%] z-0 flex-wrap">
        <Container
          className="container max-h-full justify-between overflow-auto sm:w-auto p-5 max-w-full mx-2"
          children={
            <div className="flex flex-col items-center justify-center gap-5 w-full h-full">
              <p className="font-bold text-2xl">{userData?.name}</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                  text="My classes"
                  className="w-full text-2xl"
                  onClick={() => navigate(`/user/${userData?._id}/classes`)}
                />
                <Button
                  text="Change profile"
                  className="w-full text-2xl"
                  onClick={() => setAvatarEditMode(!avatarEditMode)}
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
        <div className="flex flex-col gap-5 items-center">
          <RoleBar role={`${userData?.isAdmin ? "Admin" : "Student"}`} />
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
              <div className="min-w-[100px]">
                <div
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
