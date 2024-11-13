const database = require("../config/mongo")
const { ObjectId } = require('mongodb')

class Post {
  static async findAll() {
    try {
      const db = await database()
      const postsCollection = db.collection("posts")
      const posts = await postsCollection.find().toArray()

      return posts.map(post => ({
        ...post,
        _id: post._id.toString()
      }))
    } catch (err) {
      console.error("Error in findAll:", err)
      throw new Error("Error fetching all posts")
    }
  }

  static async findById(id) {
    try {
      const db = await database()
      const postsCollection = db.collection("posts")
      const post = await postsCollection.findOne({ _id: new ObjectId(id) })

      if (post) {
        post._id = post._id.toString()
      }
      return post
    } catch (err) {
      console.error("Error in findById:", err)
      throw new Error("Error fetching post by id")
    }
  }

  static async addPost(content, tags, imgUrl, authorId, createdAt, updatedAt) {
    const db = await database()
    const postsCollection = db.collection("posts")
    const newPost = await postsCollection.insertOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt,
      updatedAt,
    })
    return newPost
  }
  static async findAllSorted() {
    const db = await database()
    const postsCollection = db.collection("posts")
    const posts = await postsCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $unwind: "$authorDetails"
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    return posts.map(post => ({
      ...post,
      _id: post._id.toString()
    }))

  }
  static async findById(id) {
    const db = await database()
    const postsCollection = db.collection("posts")
    const post = await postsCollection.findOne({
      _id: new ObjectId(id),
    })
    if (post) {
      post._id = post._id.toString()
    }
    return post
  }
  static async addComment(postId, comment) {
    const db = await database()
    const postsCollection = db.collection("posts")
    const updatedPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: comment } }
    )
    if (updatedPost.modifiedCount === 0) {
      throw new Error("Failed to add comment")
    }
    return this.findById(postId)
  }
  static async addLike(postId, like) {
    const db = await database()
    const postsCollection = db.collection("posts")
    const updatedPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: like } }
    )
    if (updatedPost.modifiedCount === 0) {
      throw new Error("Failed to add like")
    }
    return this.findById(postId)
  }
}

module.exports = Post
