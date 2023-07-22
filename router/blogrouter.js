const router = require('express').Router()
const { verifyToken } = require('../middleware/auth')
const { multerUpload } = require ('../middleware/multer')
const { blog } = require('../controller')



router.post("/create", verifyToken, multerUpload('./public/imageBlog','Blog').single('file'),blog.createBlog)
router.get("/get",blog.getAll)
router.post('/like', verifyToken, blog.likeBlog)
router.get('/getlike',verifyToken,blog.getLike)

module.exports = router

