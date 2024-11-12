const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

// Mendapatkan URI dari environment variable
const uri = process.env.uri

// Membuat client MongoDB dengan konfigurasi versi API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Fungsi untuk menghubungkan ke MongoDB
async function database() {
  try {
    // Koneksi ke server MongoDB
    await client.connect()
    console.log("Successfully connected to MongoDB!")

    // Verifikasi koneksi dengan perintah ping
    await client.db("gc01-database").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")

    // Mengembalikan database untuk digunakan
    return client.db("gc01-database")
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
    throw new Error("Failed to connect to MongoDB")
  }
}

module.exports = database
