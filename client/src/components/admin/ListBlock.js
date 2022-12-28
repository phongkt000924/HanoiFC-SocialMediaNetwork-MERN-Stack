import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DashBoard.css";
import LeftSideBar from "./LeftSideBar";
import HeaderAdmin from "./HeaderAdmin";
import "./User.css";
import moment from "moment";
import "moment/locale/vi";
import LoadMoreUserBtn from "../LoadMoreUserBtn";

const ListBlock = () => {
  const [status, setStatus] = useState("1");
  const [user, setUser] = useState([]);

  const [userLoadMore, setUserLoadMore] = useState(null);

  const [result, setResult] = useState(6);
  const [page, setPage] = useState(0);
  const [flag, setFlag] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    handleLoadMoreListBlock();
  }, [user]);

  const handleSubmit = async (id) => {
    try {
      const req = await axios.patch(
        "http://localhost:5000/api/updateStatusUser",
        {
          id,
          status,
        }
      );
      if (req.status === 200) alert("Đã mở khóa thành viên!");
      getAllUser();
    } catch (error) {}
  };

  // const getAllUser = async () => {
  //   try {
  //     const req = await axios.get("http://localhost:5000/api/getAll");
  //     setUser(req.data.users);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAllUser = async () => {
    try {
      const req = await axios.get(
        `http://localhost:5000/api/getAllUserByName?status=2&username=${name}`
      );
      console.log(req);
      setUser(req.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const arr = [];

  const handleLoadMoreListBlock = () => {
    setPage(page + 1);

    for (let i = 0; i < result * page; i++) {
      if (user[i]) {
        arr.push(user[i]);
        setFlag(false);
      } else {
        setFlag(true);
      }
    }

    setUserLoadMore(arr);
  };

  return (
    <>
      <HeaderAdmin />
      <LeftSideBar />

      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Danh sách thành viên bị khóa</h2>
          <input
            type="text"
            name="search"
            value={name}
            id="search"
            title="Enter to search"
            onChange={(e) =>
              setName(e.target.value.toLowerCase().replace(/ /g, ""))
            }
          />
          <span
            className="material-symbols-outlined"
            onClick={() => getAllUser()}
          >
            search
          </span>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              {userLoadMore &&
                userLoadMore.map((item) => {
                  if (item.role !== "admin")
                    return (
                      <div className="col-md-6 col-sm-6 col-lg-6 mb-5">
                        <div
                          className="card card-product-grid shadow-sm"
                          key={item._id}
                        >
                          <Link to="#" className="img-wrap mt-3 infor-avt-user">
                            <img src={item.avatar} alt="Images User" />
                          </Link>
                          <div className="info-wrap">
                            <div
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <div className="infor-post-user-top">
                                @{item.username}{" "}
                              </div>
                              <div className="infor-post-user-bottom">
                                {item.fullname}
                              </div>
                              <div className="infor-post-user-bottom">
                                {item.email}
                              </div>
                              <div className="infor-post-user-bottom">
                                Đã bị khóa lúc:{" "}
                                {moment(item.updatedAt).format("l")}
                              </div>
                            </div>

                            <select
                              onChange={(e) => setStatus(e.target.value)}
                              className="col-12 mt-3 border-0 rounded infor-select-status-user"
                            >
                              <option value="1">Gỡ khóa</option>
                            </select>

                            <button
                              onClick={() => handleSubmit(item._id)}
                              className="col-12 border-0 rounded text-white my-3 infor-submit-status-user"
                            >
                              Đồng ý
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                })}
            </div>

            {!flag && (
              <LoadMoreUserBtn
                result={result}
                page={page}
                user={user}
                handleLoadMoreUser={handleLoadMoreListBlock}
                setUserLoadMore={setUserLoadMore}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ListBlock;
