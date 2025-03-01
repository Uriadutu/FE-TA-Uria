import React from "react";
import NavbarUser from "../../component/user/NavbarUser";

const LayoutUser = ({ children }) => {
  return (
    <React.Fragment>
      <div className=" bg-[#14181D]">
        <NavbarUser />
        <div className="p-0 flex h-[100vh]">
          <div className="flex-1 bg-[#14181D]">
            <main
              className="min-h-screen bg-[#14181D]"
              style={{ minHeight: "100vh", Width: "100%" }}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LayoutUser;
