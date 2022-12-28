const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");
const Notifies = require("../models/notifyModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ msg: "Vui lòng thêm ảnh của bạn." });

      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
      });

      await newPost.save();

      res.json({
        msg: "Tạo bài viết thành công!",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          user: [...req.user.following, req.user._id],
          status: 1,
        }),
        req.query
      ).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers status")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({ msg: "Success!", result: posts.length, posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getNewPost: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({}), req.query).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({ msg: "Success!", result: posts.length, posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getApprovedPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ status: 1 }),
        req.query
      ).paginating();

      console.log(req.query);

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({ msg: "Success!", result: posts.length, posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  approvePost: async (req, res) => {
    try {
      const { id, status } = req.body;
      const post = await Posts.findOneAndUpdate(
        { _id: id },
        {
          status,
        }
      )
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      const notify = new Notifies({
        id: post._id,
        recipients: post.user.followers,
        url: `/post/${post._id}`,
        text: "đã thêm một bài viết mới.",
        content: post.content,
        image: post.images[0].url,
        user: post.user._id,
      });

      await notify.save();

      res.json({
        msg: "Cập nhật trạng thái bài viết thành công!",
        newPost: {
          ...post._doc,
          status,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({
        msg: "Cập nhật bài viết thành công!",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });

      if (post.length > 0)
        return res.status(400).json({ msg: "Bạn đã thích bài viết này." });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(404).json({ msg: "Bài viết này không tồn tại." });

      res.json({ msg: "Đã thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "Bài viết này không tồn tại." });

      res.json({ msg: "Hủy thích bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ user: req.params.id,"status": 1 }),
        req.query
      ).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers status");

      res.json({ posts, result: posts.length });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      if (!post)
        return res.status(400).json({ msg: "Bài viết này không tồn tại." });

      res.json({ post });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // --------------------

  // getSinglePost: async (req, res) => {
  //   try {
  //     const post = await Posts.findById(req.body.id)
  //       .populate("user likes", "avatar username fullname followers")
  //       .populate({
  //         path: "comments",
  //         populate: {
  //           path: "user likes",
  //           select: "-password",
  //         },
  //       });

  //     if (!post)
  //       return res.status(400).json({ msg: "Bài viết này không tồn tại." });

  //     res.json({ post });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  // --------------------

  getPostsDiscover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 9;

      const result = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $match: { status: 1 } },
        { $sample: { size: Number(num) } },
      ]);

      const posts = await Posts.populate(result, {
        path: "user",
        select: "-password",
      });

      return res.json({ msg: "Success!", result: posts.length, posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Đã xóa bài viết!",
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.user._id,
        saved: req.params.id,
      });

      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã lưu bài viết này." });

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "Người dùng này không tòn tại." });

      res.json({ msg: "Đã lưu bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "Người dùng này không tòn tại." });

      res.json({ msg: "Đã hủy lưu bài viết!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          _id: { $in: req.user.saved },
        }),
        req.query
      ).paginating();

      const savePosts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers status");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
