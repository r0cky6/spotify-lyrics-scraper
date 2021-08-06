import express from 'express'
import bcrypt from 'bcryptjs'

import user from '../models/user.js'

const router = express.Router()
// signup a user
router.post('/api/signup', async (req, res) => {
  let { email, username, password, remember } = req.body.form    
  if (email && username && password) {
      email = sanitize(email.trim())
      username = sanitize(username.trim())
      password = bcrypt.hashSync(sanitize(password.trim()), 10)
  }

  if (!email || !username || !password) return res.status(400).json({msg: 'bad credentials!'})
  if (!!( await user.findOne({ email }) )) return res.status(400).json({msg: 'email is taken'})
  await user.create(  
      {email, username, password}, 
      (err, doc) => { 
          if (err) return res.status(400).json({msg: err})
          req.session.user_id = doc._id
          if (remember) req.session.cookie.maxAge = MAX_AGE
          return res.status(201).json({msg: `welcome`})
      }
  )
})

// login the user
router.post('/api/login', async (req, res) => {
  let { email, password, remember } = req.body.form
  if (email && password && remember) {
      email = sanitize(email.trim())
      password = sanitize(password.trim())
      remember = sanitize(remember)
  }

  const foundUser = await user.findOne({ email })
  if (foundUser) {
      if (bcrypt.compareSync(password, foundUser.password)) {
          req.session.user_id = foundUser._id
          if (!!remember) req.session.cookie.maxAge = MAX_AGE
          return res.status(200).json({msg: `You've logged in`})
      }else return res.status(400).json({msg: `Wrong password`})
  }
  return res.status(404).json({msg: `Wrong email`})
})

// logout the user
router.post('/api/logout', async (req, res) => {
  req.session.user_id = null
  req.session.destroy()
  await res.clearCookie('connect.sid')
  return res.status(200).json({msg: `You've logged out`})
})

// get all public info about a user
router.get(['/api/u', '/api/u/:id'], async (req,res) => {
  if (req.params.id) return res.status(200).json(await user.findOne({'_id': req.params['id'] }, {password: 0}).lean())
  if (req.session.user_id) return res.status(200).json(await user.findOne({'_id': req.session.user_id}, {password: 0}).lean())
  return res.status(400).json({msg: `You aren't authenticated`})
})

export default router