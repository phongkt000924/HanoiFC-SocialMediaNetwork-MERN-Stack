import React from "react";
import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import { useSelector } from "react-redux";

const Following = ({ users, setShowFollowing }) => {
  const { auth } = useSelector((state) => state);
  return (
    <div className="follow">
      <div className="follow_box">
        <h5 className="text-center">Đang theo dõi</h5>
        <hr />
        <div className="follow_content">
          {users.map((user) => {
            if (user.status === 1)
              return (
                <UserCard
                  key={user._id}
                  user={user}
                  setShowFollowing={setShowFollowing}
                >
                  {auth.user._id !== user._id && <FollowBtn user={user} />}
                </UserCard>
              );
          })}
        </div>

        <div className="close" onClick={() => setShowFollowing(false)}>
          &times;
        </div>
      </div>
    </div>
  );
};

export default Following;
