import React, { useEffect, useState } from "react";

import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import Saved from "../../components/profile/Saved";

import { useDispatch, useSelector } from "react-redux";
import LoadIcon from "../../images/loading/loading.gif";
import { getProfileUsers } from "../../redux/actions/profileAction";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { profile, auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [saveTab, setSaveTab] = useState(false);

  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id, auth, dispatch, profile.ids]);

  return (
    <div className="profile">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {auth.user._id === id && (
        <div className="profile_tab">
          <button
            className={saveTab ? "" : "active"}
            onClick={() => setSaveTab(false)}
          >
            Bài viết đã đăng
          </button>

          <button
            className={saveTab ? "active" : ""}
            onClick={() => setSaveTab(true)}
          >
            Bài viết đã lưu
          </button>
        </div>
      )}

      {profile.loading ? (
        <img className="d-block mx-auto my-2" src={LoadIcon} alt="loading" />
      ) : ( <>
          {
            saveTab
            ?  <Saved auth={auth} dispatch={dispatch} id={id} profile={profile}/>
            :  <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          }
      </>
      )}
    </div>
  );
};

export default Profile;
