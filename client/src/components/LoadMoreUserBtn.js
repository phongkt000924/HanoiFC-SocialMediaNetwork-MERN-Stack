import React from "react";

const LoadMoreUserBtn = ({
  result,
  page,
  load,
  handleLoadMoreUser,
  setUserLoadMore,
  user,
}) => {
  return (
    <>
      <button
        className="btn btn-dark mx-auto d-block"
        onClick={handleLoadMoreUser}
      >
        Xem thêm
      </button>
    </>
  );
};

export default LoadMoreUserBtn;
