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

  static async create(data) {
    try {
      const db = await database()
      const postsCollection = db.collection("posts")
      const result = await postsCollection.insertOne(data)

      return {
        _id: result.insertedId.toString(),
        ...data
      }
    } catch (err) {
      console.error("Error in create:", err)
      throw new Error("Error creating post")
    }
  }
}

module.exports = Post
