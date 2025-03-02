import React from "react";
import NavbarUser from "../../component/user/NavbarUser";

const LayoutUser = ({ children }) => {
  return (
    <React.Fragment>
      <div className=" dark:bg-[#14181D] bg-white">
        <NavbarUser />
        <div className="p-0 flex h-[100vh]">
          <div className="flex-1 ">
            <main
              className="min-h-screen"
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
