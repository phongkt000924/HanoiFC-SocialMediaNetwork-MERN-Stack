import React from "react";
import { Link, NavLink } from "react-router-dom";

const LeftSideBar = () => {
  return (
    <div>
      <aside className="navbar-aside" id="offcanvas_aside">
        <div className="aside-top">
          <Link to="/dashboard" className="brand-wrap">
            <img
              src="/images/logo-text.png"
              style={{ height: "46" }}
              className="logo"
              alt="Ecommerce dashboard template"
            />
          </Link>

          <div>
            <button className="btn btn-icon btn-aside-minimize">
              <i className="text-muted fas fa-stream"></i>
            </button>
          </div>
        </div>

        <nav>
          <ul className="menu-aside">
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/dashboard"
                exact={true}
              >
                <i className="icon material-symbols-outlined">list_alt</i>
                <span className="text">Tất cả bài viết</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/newpost"
              >
                <i className="icon material-symbols-outlined">checklist</i>
                <span className="text">Bài viết đang chờ duyệt</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/user"
              >
                <i className="icon material-symbols-outlined">
                  supervisor_account
                </i>
                <span className="text">Danh sách thành viên</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/listblock"
              >
                <i className="icon material-symbols-outlined">person_off</i>
                <span className="text">Danh sách thành viên bị khóa</span>
              </NavLink>
            </li>
          </ul>
          <br />
          <br />
        </nav>
      </aside>
    </div>
  );
};

export default LeftSideBar;
