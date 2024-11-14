const database = require("../config/mongo")
const { ObjectId } = require('mongodb')

class Follower {
  static async findAllUserFollower(userId) {
    try {
      // Pastikan koneksi berhasil
      const db = await database()
      const followersCollection = db.collection("followers")
      // Ubah id string menjadi ObjectId
      const followers = await followersCollection.find({ followerId: new ObjectId(userId) }).toArray()
      // console.log("userId", userId)
      // console.log("followers", followers)

      // Konversi _id menjadi string untuk setiap user
      return followers.map(follower => ({
        ...follower,
        _id: follower._id.toString()
      }))
    } catch (err) {
      console.error("Error in findAll:", err)
      throw new Error("Error fetching all users")
    }
  }
  static async findAllUserFollowing(userId) {
    try {
      // Pastikan koneksi berhasil
      const db = await database()
      const followingCollection = db.collection("followers")

      // Ubah id string menjadi ObjectId
      const following = await followingCollection.find({ followingId: new ObjectId(userId) }).toArray()

      // Konversi _id menjadi string untuk setiap user
      return following.map(following => ({
        ...following,
        _id: following._id.toString()
      }))
    } catch (err) {
      console.error("Error in findAll:", err)
      throw new Error("Error fetching all users")
    }
  }
  static async countFollowing(userId) {
    try {
      const db = await database()
      const followersCollection = db.collection("followers")

      const result = await followersCollection.aggregate([
        { $match: { followerId: new ObjectId(userId) } },
        { $count: "totalFollowing" }
      ]).toArray()

      // Jika hasilnya kosong, berarti following-nya 0
      return result[0]?.totalFollowing || 0
    } catch (err) {
      console.error("Error in countFollowing:", err)
      throw new Error("Error counting following")
    }
  }

  static async countFollowing(userId) {
    try {
      const db = await database()
      const followingsCollection = db.collection("followers")

      const result = await followingsCollection.aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        { $count: "totalFollowers" }
      ]).toArray()

      // Jika hasilnya kosong, berarti followers-nya 0
      return result[0]?.totalFollowers || 0
    } catch (err) {
      console.error("Error in countFollowing:", err)
      throw new Error("Error counting following")
    }
  }


  static async createFollow(followerId, followingId) {
    const db = await database()
    const followersCollection = db.collection("followers")
    const newFollow = {
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await followersCollection.insertOne(newFollow)
    return { _id: result.insertedId, ...newFollow }
  }
}

module.exports = Follower
