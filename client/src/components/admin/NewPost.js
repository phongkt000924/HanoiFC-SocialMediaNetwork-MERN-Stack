import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DashBoard.css";
import LeftSideBar from "./LeftSideBar";
import HeaderAdmin from "./HeaderAdmin";
import LoadMoreBtn from "../LoadMoreBtn";
import { getDataAPI } from "../../utils/fetchData";
import { useSelector } from "react-redux";
import "./Newpost.css";
import moment from "moment";
import "moment/locale/vi";

const Dasboard = () => {
  const { auth } = useSelector((state) => state);

  const [status, setStatus] = useState("1");
  const [post, setPost] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(1);

  useEffect(() => {
    //getNewPost();
    handleLoadMore();
  }, []);

  const handleSubmit = async (id) => {
    try {
      const req = await axios.patch("http://localhost:5000/api/approve", {
        id,
        status,
      });
      if (req.status === 200) alert("Đã duyệt bài viết!");
      getNewPost();
    } catch (error) {}
  };

  const getNewPost = async () => {
    try {
      const req = await axios.get("http://localhost:5000/api/newpost");
      setPost(req.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = async () => {
    // setPage(page + 1);

    // const res = await getDataAPI(`newpost?limit=${page * 9}`, auth.token);

    // setPost(res.data.posts);

    // setResult(res.data.result);
    setPage(page + 1);
    getDataAPI(`newpost?limit=${page * 9}`, auth.token)
    .then((res) =>{
      setPost(res.data.posts);
      setResult(res.data.result);
    })
  };

  return (
    <>
      <HeaderAdmin />

      <LeftSideBar />

      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Bài viết đang chờ duyệt</h2>
          {/* <input type="text" />
          <span className="material-symbols-outlined">search</span> */}
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row content-newpost-row">
              {post &&
                post.map((item) => {
                  if (item.status === 0)
                    return (
                      <div className="col-md-6 col-sm-6 col-lg-6 content-newpost">
                        <div
                          className="card card-product-grid shadow-sm"
                          key={item._id}
                        >
                          <Link to="#" className="img-wrap mt-3">
                            {item.images[0].url.match(/video/i) ? (
                              <video
                                controls
                                src={item.images[0].url}
                                alt={item.images[0].url}
                              />
                            ) : (
                              <img
                                src={item.images[0].url}
                                alt={item.images[0].url}
                                style={{
                                  borderRadius: "3px",
                                }}
                              />
                            )}
                          </Link>

                          <div className="info-wrap">
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <div className="infor-newpost-top">
                                @{item.user.username}{" "}
                              </div>
                              <div className="infor-newpost-top">
                                {item.user.fullname}
                              </div>
                              <div className="infor-newpost-bottom-time">
                                Đã đăng lúc:{" "}
                                {moment(item.createdAt).format("LTS")},{" "}
                                {moment(item.createdAt).format("l")}
                              </div>
                            </div>

                            <Link to="#" className="title infor-newpost-bottom">
                              {item.content}
                            </Link>

                            <select
                              onChange={(e) => setStatus(e.target.value)}
                              className="col-12 mt-3 border-0 rounded infor-select-status-newpost"
                            >
                              <option value="1">Duyệt</option>
                              <option value="2">Không duyệt</option>
                            </select>
                            <button
                              onClick={() => handleSubmit(item._id)}
                              className="col-12 border-0 rounded text-white my-3 infor-submit-status-newpost"
                            >
                              Đồng ý
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                })}
            </div>

            <LoadMoreBtn
              result={result}
              page={page}
              handleLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dasboard;
