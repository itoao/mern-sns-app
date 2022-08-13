const router = require('express').Router()
const User = require('../models/User')

// update user
router.put('/:id', async(req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      })
      return res.status(200).json('ユーザー情報が更新されました')
    }
    catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('あなた以外のユーザー情報は更新できません')
  }
})

// delete user
router.delete('/:id', async(req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id, {
        $set: req.body
      })
      return res.status(200).json('ユーザー情報が削除されました')
    }
    catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('あなた以外のユーザー情報は削除できません')
  }
})

// get user
router.get('/:id', async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, updatedAt, ...others } = user._doc
    return res.status(200).json(others)
  }
  catch (err) {
    return res.status(500).json(err)
  }
})

// follow user
router.put('/:id/follow', async(req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const targetUser = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!targetUser.followers.includes(req.body.userId)) {
        await targetUser.updateOne({
          $push: {
            followers: req.body.userId
          }
        })
        await currentUser.updateOne({
          $push: {
            followings: req.params.id
          }
        })
        return res.status(200).json('フォローに成功しました')
      } else {
        return res.status(403).json('あなたはすでにこのユーザーをフォローしています')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json('自分自身をフォローできません')
  }
})

// un-follow user
router.put('/:id/unfollow', async(req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const targetUser = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!targetUser.followers.includes(req.body.userId)) {
        return res.status(403).json('あなたはすでにこのユーザーをフォロー解除しています')
      } else {
        await targetUser.updateOne({
          $pull: {
            followers: req.body.userId
          }
        })
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id
          }
        })
        return res.status(200).json('フォロー解除に成功しました')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json('自分自身をフォロー解除できません')
  }
})

module.exports = router

