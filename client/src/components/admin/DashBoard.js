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
import "./User.css";
import moment from "moment";
import "moment/locale/vi";

const DashBoard = () => {
  const { auth } = useSelector((state) => state);

  const [post, setPost] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // getNewPost();
    // firstLoad();
    handleLoadMore();
  }, []);

  // const getNewPost = async () => {
  //   try {
  //     const req = await axios.get("http://localhost:5000/api/newpost");
  //     setPost(req.data.posts);
  //     console.log(req);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getNewPost = async () => {
  //   try {
  //     const req = await axios.get("http://localhost:5000/api/approvedPosts");
  //     setPost(req.data.posts);
  //     console.log(req);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  const handleLoadMore = async () => {
    setPage(prev => prev + 1)
    getDataAPI(`approvedPosts?limit=${page * 9}`, auth.token).then((res) =>
      {
        setPost(res.data.posts)
        setResult(res.data.result)
      }
    );
  }

  // const handleLoadMore = async () => {
  //   console.log(page + " " + result);
  //   setPage(page + 1);

  //   const res = await getDataAPI(`newpost?limit=${page * 9}`, auth.token);

  //   setPost(res.data.posts);

  //   console.log(post);

  //   setResult(res.data.result);
  // };

  return (
    <>
      <HeaderAdmin />

      <LeftSideBar />

      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title" style={{ marginRight: "140px" }}>
            Tất cả bài viết
          </h2>
          {/* <input type="text" />
          <span className="material-symbols-outlined">search</span> */}
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              {post &&
                post.map((item) => {
                  if (item.status === 1)
                    return (
                      <div
                        className="col-md-6 col-sm-6 col-lg-6 mb-5"
                        key={item._id}
                      >
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
                                alt="Images Post"
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
                              <div
                                className="infor-post-user-top"
                                style={{
                                  marginBottom: "2px",
                                }}
                              >
                                @{item.user.username}{" "}
                              </div>
                              <div className="infor-post-user-top">
                                {item.user.fullname}
                              </div>
                              <div
                                className="infor-post-user-bottom"
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                Đã đăng lúc:{" "}
                                {moment(item.createdAt).format("LTS")},{" "}
                                {moment(item.createdAt).format("l")}
                              </div>
                              <div
                                className="infor-post-user-bottom"
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                Đã duyệt lúc:{" "}
                                {moment(item.updatedAt).format("LTS")},{" "}
                                {moment(item.updatedAt).format("l")}
                              </div>
                            </div>

                            <Link
                              to="#"
                              className="title text-truncate infor-post-user-bottom"
                            >
                              Nội dung: {item.content}
                            </Link>
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

export default DashBoard;
