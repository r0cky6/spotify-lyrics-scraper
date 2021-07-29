import mongoose from 'mongoose'

const sessionModel = mongoose.model('session', new mongoose.Schema(
  {
   expires:{
     type: Date,
   },
   session:{
     type: Object
   }
  }
))
export default sessionModel