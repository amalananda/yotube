const database = require("../config/mongo")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")
const { signToken } = require('../helpers/jwt')

class User {
  static async register(name, username, email, password) {
    try {
      const db = await database()
      const usersCollection = db.collection("users")

      const emailExist = await usersCollection.findOne({ email })
      if (emailExist) {
        throw new Error("Email sudah terdaftar.")
      }

      const hashedPassword = hashPassword(password)
      const result = await usersCollection.insertOne({
        name,
        username,
        email,
        password: hashedPassword,
      })

      return {
        _id: result.insertedId.toString(),
        name,
        username,
        email,
      }
    } catch (err) {
      console.error("Error in register:", err)
      throw new Error("Gagal mendaftarkan pengguna baru")
    }
  }

  static async login(email, password) {
    try {
      const db = await database()
      const usersCollection = db.collection("users")

      const user = await usersCollection.findOne({ email })
      if (!user) {
        throw new Error("Pengguna tidak ditemukan.")
      }
      const isPasswordValid = comparePassword(password, user.password)
      if (!isPasswordValid) {
        throw new Error("Password salah.")
      }
      const payload = { id: user._id, email: user.email }
      const token = signToken(payload)
      return {
        access_token: token,
      }
    } catch (err) {
      console.error("Error in login:", err)
      throw new Error("Gagal masuk")
    }
  }

  static async findAll() {
    try {

      const db = await database()
      const usersCollection = db.collection("users")

      const users = await usersCollection.find().toArray()


      return users.map(user => ({
        ...user,
        _id: user._id.toString()
      }))
    } catch (err) {
      console.error("Error in findAll:", err)
      throw new Error("Error fetching all users")
    }
  }

  static async findById(id) {
    try {
      const db = await database()
      const usersCollection = db.collection("users")
      const result = await usersCollection.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "authorId",
            as: "posts"
          }
        }
      ]).toArray()

      if (result.length > 0) {
        const user = result[0]
        user._id = user._id.toString() // Konversi _id ke string
        user.followers = await this.follower(id)  // Mendapatkan followers
        user.followings = await this.following(id) // Mendapatkan followings
        return user
      } else {
        return null
      }
    } catch (err) {
      console.error("Error in findById:", err)
      throw new Error("Error fetching user by id")
    }
  }

  static async search(query) {
    try {
      const db = await database()
      const usersCollection = db.collection("users")

      const regex = new RegExp(query, "i")  // Case-insensitive regex
      const users = await usersCollection.find({
        $or: [
          { name: { $regex: regex } },
          { username: { $regex: regex } }
        ]
      }).toArray()

      return users.map(user => ({
        ...user,
        _id: user._id.toString()
      }))
    } catch (err) {
      console.error("Error in search:", err)
      throw new Error("Error searching users")
    }
  }
  static async follower(userId) {
    try {
      const db = await database()
      const userCollection = db.collection("followers")
      const result = await userCollection.aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        // {
        //   $lookup: {
        //     from: "followers",
        //     localField: "_id",
        //     foreignField: "followingId",
        //     as: "followers"
        //   }
        // },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "followers"
          }
        },
        {
          $unwind: {
            path: "$followers",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            followers: 1,
            _id: 0,

          }
        }
      ]).toArray()


      console.log(result, '>>><<<')
      const filteredResult = result.filter(follower => follower.followers !== null)

      return filteredResult
    } catch (err) {
      console.error("Error in follower:", err)
      throw new Error("Error fetching followers")
    }
  }

  static async following(userId) {
    try {
      const db = await database()
      const userCollection = db.collection("followers")
      const result = await userCollection.aggregate([
        { $match: { followerId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "following",
            localField: "_id",
            foreignField: "followerId",
            as: "following"
          }
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]).toArray()


      console.log(result)
      return result
    } catch (err) {
      console.error("Error in following:", err)
      throw new Error("Error fetching followings")
    }
  }
  static async getUserWithFollowersAndFollowing(userId) {
    const db = await database()
    const userCollection = db.collection("followers")

    const user = await userCollection.findOne({ _id: new ObjectId(userId) })
    if (!user) throw new GraphQLError("User not found")
    console.log(user, ">>>")
    const followers = await followCollection
      .aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $project: {
            _id: 0,
            name: "$followerUsers.name",
            username: "$followerUsers.username",
          },
        },

      ])
      .toArray()

    const followings = await followCollection
      .aggregate([
        { $match: { followerId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $project: {
            _id: 0,
            name: "$followingUsers.name",
            username: "$followingUsers.username",
          },
        },
        { $replaceRoot: { newRoot: "$followingUsers", username: "$followingUsers.username" } },
      ])
      .toArray()

    return { ...user, followers, followings }
  }
}

module.exports = User
