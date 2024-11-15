const database = require("../config/mongo")
const { ObjectId } = require('mongodb')

class Post {
  static async findAll() {
    try {
      const db = await database()
      const postsCollection = db.collection("posts")
      const posts = await postsCollection.aggregate([
        {
          $lookup: {
            from: "users",  // Nama koleksi pengguna
            localField: "authorId",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $unwind: {
            path: "$authorDetails",
            preserveNullAndEmptyArrays: true  // Menangani kasus jika authorDetails tidak ditemukan
          }
        }
      ]).toArray()

      return posts.map(post => ({
        ...post,
        _id: post._id.toString(),  // Pastikan _id adalah string
        authorDetails: post.authorDetails ? {
          username: post.authorDetails.username,
          imgUrl: post.authorDetails.imgUrl
        } : null
      }))
    } catch (err) {
      console.error("Error in findAll:", err)
      throw new Error("Error fetching all posts")
    }
  }

  static async findById(id) {
    const db = await database()
    const postsCollection = db.collection("posts")
    const post = await postsCollection.aggregate([
      {
        $match: { _id: new ObjectId(id) }
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray()

    if (post.length > 0) {
      post[0]._id = post[0]._id.toString()
      return post[0]
    } else {
      throw new Error("Post not found")
    }
  }

  static async addPost(content, tags, imgUrl, authorId, createdAt, updatedAt) {
    const db = await database()
    const postsCollection = db.collection("posts")
    console.log('Received imgUrl:', imgUrl)
    if (!imgUrl || imgUrl.trim() === '') {
      throw new Error('Image URL is required')
    }
    const newPost = await postsCollection.insertOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt: new Date(createdAt).toISOString(),  // Mengonversi ke format string ISO
      updatedAt: new Date(updatedAt).toISOString(),
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
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true
        }
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
