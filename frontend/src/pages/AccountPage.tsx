import { Button } from "../components/Button";
import { Container } from "../components/Container";
import RoleBar from "../components/RoleBar";

const AdminPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <div className="flex gap-5 justify-between w-[90%] max-w-full px-10">
        <Container
          className="p-8"
          children={
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="font-bold text-2xl">John Smith</p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                  text="My classes"
                  className="w-full text-2xl"
                  onClick={() => {}}
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
          <RoleBar role="Student" points={100} />
          <img alt="character sprite" className="justify-self-center" />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
