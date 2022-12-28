import React from "react";
import { useSelector, useDispatch } from "react-redux";

import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import LoadIcon from "../../images/loading/loading.gif";
import { getSuggestions } from "../../redux/actions/suggestionsAction";

const RightSideBar = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  // console.log("suggestions users: ", suggestions.users);

  return (
    <div className="mt-3">
      <UserCard user={auth.user} />

      <div className="d-flex justify-content-between align-items-center my-2">
        <h5 className="text-danger">Những người bạn có thể biết</h5>
        {!suggestions.loading && (
          <i
            className="fas fa-redo"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(getSuggestions(auth.token))}
          />
        )}
      </div>

      {suggestions.loading ? (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
      ) : (
        <div className="suggestions">
          {suggestions.users.map((user) => {
            if (user.status === 1 && user.role !== "admin")
              return (
                <UserCard key={user._id} user={user}>
                  <FollowBtn user={user} />
                </UserCard>
              );
          })}
        </div>
      )}

      <div style={{ opacity: 0.5, textAlign: "center" }} className="my-2">
        {/* <a
          href="https://www.facebook.com/profile.php?id=100008272753095"
          target="_blank"
          rel="noreferrer"
          style={{ wordBreak: "break-all" }}
        >
          https://www.facebook.com/profile.php?id=100008272753095
        </a>
        <small className="d-block">
          Contact me to donate or give me money to drink coffee.
        </small> */}
        <small>&copy; 2022 KIM THAI PHONG</small>
      </div>
    </div>
  );
};

export default RightSideBar;
