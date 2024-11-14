const database = require("../config/mongo")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")
const { signToken } = require('../helpers/jwt')

class User {
  static async register(name, username, email, password) {
    try {
      const db = await database()
      const usersCollection = db.collection("users")

      // Cek apakah email sudah terdaftar
      const emailExist = await usersCollection.findOne({ email })
      if (emailExist) {
        console.log("Email Exist Check: ", emailExist)
        throw new Error("Email sudah terdaftar.")  // Lempar error jika email sudah ada
      }

      const passwordHash = hashPassword(password)
      const result = await usersCollection.insertOne({
        name,
        username,
        email,
        password: passwordHash, // Simpan password yang sudah di-hash
      })

      return {
        _id: result.insertedId.toString(),
        name,
        username,
        email, // Mengembalikan user baru dengan ID
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
        throw new Error("Pengguna tidak ditemukan.")  // Lempar error jika user tidak ditemukan
      }

      // Cek apakah password sesuai
      const isPasswordValid = comparePassword(password, user.password) // Pastikan compare menggunakan bcrypt
      if (!isPasswordValid) {
        throw new Error("Password salah.")  // Lempar error jika password salah
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
      const userCollection = db.collection("followers")
      const result = await userCollection.aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: "$user._id",
            name: "$user.name",
            username: "$user.username"
          }
        }
      ]).toArray()

      // Konversi _id pengguna di followers menjadi string
      return result.map(follower => ({
        ...follower,
        _id: follower._id.toString()
      }))
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
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: "$user._id",
            name: "$user.name",
            username: "$user.username"
          }
        }
      ]).toArray()

      // Konversi _id pengguna di followings menjadi string
      return result.map(following => ({
        ...following,
        _id: following._id.toString()
      }))
    } catch (err) {
      console.error("Error in following:", err)
      throw new Error("Error fetching followings")
    }
  }
}

module.exports = User
