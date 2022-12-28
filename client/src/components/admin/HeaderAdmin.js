import React from "react";
import { Link } from "react-router-dom";

const HeaderAdmin = () => {
  const logoutHandler = () => {
    localStorage.removeItem("firstLogin");
    window.location.reload();
  };

  return (
    <header
      className="main-header navbar"
      style={{
        justifyContent: "flex-end",
      }}
    >
      <div className="col-nav">
        <ul className="nav">
          <li className="dropdown nav-item">
            <Link to="#">
              <img
                className="img-xs rounded-circle"
                src="/images/user.jpg"
                alt="User"
              />
            </Link>
          </li>
          <li>
            <Link
              onClick={logoutHandler}
              className="dropdown-item text-danger"
              to="#"
            >
              Đăng xuất
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default HeaderAdmin;
