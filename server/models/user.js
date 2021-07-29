import mongoose from 'mongoose'
const user = mongoose.model('user', new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true
    },
    username: {
      type: String,
      unique: false
    },
    password: {
      type: String,
      unique: false
    }
  }
))
export default user