import { useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";
import { Container } from "../components/Container";
import { Outlet } from "react-router-dom";

const ClassPage = () => {
  return (
    <div className="p-4 w-screen h-screen flex items-center justify-center text-2xl gap-4 flex-col md:flex-row">
      <img alt="character sprite" className="justify-self-center" />
      <Container
        className="max-h-full overflow-auto max-w-content p-5"
        children={<Outlet />}
      />
    </div>
  );
};

export default ClassPage;
