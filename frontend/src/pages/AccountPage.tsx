import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import RoleBar from "../components/RoleBar";
import sprite from "../assets/characters.png";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  lastSeen: Date; // what ???
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    isAdmin: false,
    createdAt: new Date(),
    lastSeen: new Date(),
  });
  const userId = useParams().userId;

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`);
      if (!response.ok) {
        throw new Error("NETWORK_ERROR");
      }
      const userData = await response.json();
      setUserData(userData.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <div className="flex gap-5 justify-between w-[90%] max-w-full px-10">
        <Container
          className="p-8"
          children={
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="font-bold text-2xl">{userData.name}</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                  text="My classes"
                  className="w-full text-2xl"
                  onClick={() => navigate(`/user/${userId}/classes`)}
                />
                <Button
                  text="Change profile"
                  className="w-full text-2xl"
                  onClick={() => {}}
                />
                <Button
                  text="Settings"
                  className="w-full text-2xl"
                  onClick={() => {}}
                />
              </div>
            </div>
          }
        />
        <div className="flex flex-col gap-5 flex-1">
          <RoleBar
            role={`${userData.isAdmin ? "Admin" : "Student"}`}
            points={100}
          />
          <img
            src={sprite}
            alt="character sprite"
            className="justify-self-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
