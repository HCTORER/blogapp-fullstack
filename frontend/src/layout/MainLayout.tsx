import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
