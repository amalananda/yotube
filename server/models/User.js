const database = require("../config/mongo")
const { ObjectId } = require('mongodb')

class User {
  static async findAll() {
    try {
      // Pastikan koneksi berhasil
      const db = await database()
      const usersCollection = db.collection("users")

      // Ubah id string menjadi ObjectId
      const users = await usersCollection.find().toArray()

      // Konversi _id menjadi string untuk setiap user
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
      // Pastikan koneksi berhasil
      const db = await database()
      const usersCollection = db.collection("users")
      const result = await usersCollection.aggregate([
        { $match: { _id: new ObjectId(String(id)) } },
        {
          $lookup: {
            from: "posts",           // Nama koleksi yang ingin di-join
            localField: "_id",       // Field di koleksi users
            foreignField: "authorId", // Field di koleksi posts yang berhubungan
            as: "posts"              // Alias hasil join
          }
        }
      ]).toArray()
      if (result.length > 0) {
        const user = result[0]
        user._id = user._id() // Konversi _id ke string
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

      // Cari pengguna berdasarkan nama atau username yang mengandung query
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
      const userCollection = db.collection("users")
      const result = await userCollection.aggregate([
        { $match: { _id: new ObjectId(userId) } },
        {
          $lookup: {
            from: "followers",
            localField: "_id",
            foreignField: "followingId",
            as: "followers"
          }
        }
      ]).toArray()
      console.log("RESULT", result)
      return result[0]
    } catch (err) {
      console.error("Error in countFollowing:", err)
      throw new Error("Error counting following")
    }
  }
}

module.exports = User
