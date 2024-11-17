const bcrypt = require("bcrypt")

const hashPassword = (password) => {
  if (!password) {
    throw new Error("Password kosong atau invalid!")
  }
  const salt = bcrypt.genSaltSync(10)
  const hashed = bcrypt.hashSync(password, salt)

  return hashed
}

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

module.exports = { hashPassword, comparePassword }
