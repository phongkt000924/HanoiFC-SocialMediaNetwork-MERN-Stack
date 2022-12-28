import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../PostCard";

import LoadIcon from "../../images/loading/loading.gif";
import LoadMoreBtn from "../LoadMoreBtn";
import { getDataAPI } from "../../utils/fetchData";
import { PROFILE_TYPES } from "../../redux/actions/profileAction";

const Posts = () => {
  const { homePosts, auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    setLoad(true);

    const res = await getDataAPI(
      `posts?limit=${homePosts.page * 9}`,
      auth.token
    );

    // console.log(res);

    // dispatch({
    //   type: PROFILE_TYPES.GET_POSTS,
    //   payload: { ...res.data, page: homePosts.page + 1 },
    // });
      
     homePosts.page += 1;

     homePosts.posts = res.data.posts;

    
     homePosts.result = res.data.result;
    
    

    setLoad(false);
  };

  // console.log(homePosts);

  return (
    <div className="posts">
      {homePosts.posts &&
        homePosts.posts.map((post) => {
          if (post.status === 1 && post.user.status === 1)
            return <PostCard key={post._id} post={post} theme={theme} />;
        })}

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
