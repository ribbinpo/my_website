import React from "react";
import { Navbar } from "../components/layout/navbar.component";

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="space-y-6">
      <Navbar />
      {children}
    </div>
  )
}

export default MainLayout;