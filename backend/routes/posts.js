const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

// create post
router.post('/', async(req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    return res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// update post
router.put('/:id', async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId !== req.body.userId) return res.status(403).json('自分以外の投稿を編集できません')
    await post.updateOne({
      $set: req.body
    })
    return res.status(200).json('投稿編集に成功しました')
  } catch (err) {
    return res.status(403).json(err)
  }
})

// delete post
router.delete('/:id', async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(403).json('投稿が見つかりません')
    if (post.userId !== req.body.userId) return res.status(403).json('自分以外の投稿を削除できません')
    await post.deleteOne()
    return res.status(200).json('投稿削除に成功しました')
  } catch (err) {
    return res.status(403).json(err)
  }
})

// get single post
router.get('/:id', async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(403).json('投稿が見つかりません')
    return res.status(200).json(post)
  } catch (err) {
    return res.status(403).json(err)
  }
})

// like post
router.put('/:id/like', async(req, res) => {
  try {
    const targetPost = await Post.findById(req.params.id)
    if (!targetPost.likes.includes(req.body.userId)) {
      await targetPost.updateOne({
        $push: {
          likes: req.body.userId
        }
      })
      return res.status(200).json('投稿にいいねをおしました')
    } else {
      await targetPost.updateOne({
        $pull: {
          likes: req.body.userId
        }
      })
      return res.status(200).json('投稿にいいねをはずしました')
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

// get timeline
router.get('/timeline/:userId', async(req, res)  => {
  try {
    const currentUser = await User.findById(req.params.userId)
    const myPosts = await Post.find({ userId: currentUser._id })
    const followingPosts = await Promise.all(
      currentUser.followings.map((id) => {
        return Post.find({ userId: id })
      })
    )
    return res.status(200).json(myPosts.concat(...followingPosts))
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})
module.exports = router