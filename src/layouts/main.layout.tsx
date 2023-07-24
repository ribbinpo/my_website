import React from "react";
import { Navbar } from "../components/layout/navbar.component";

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default MainLayout;