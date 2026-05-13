import React from "react";
import { useAppContext } from "../../context/userContext";

export function NavBarUser({ children }) {
  const { user } = useAppContext();
  return (
    <>
      <div className="h-full">{children}</div>
    </>
  );
}
