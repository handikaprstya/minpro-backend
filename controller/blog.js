const { log } = require("handlebars")
const db = require("../models")
const blog = db.blog
// const categori = db.category
const user = db.akun
const like = db.like
const { Op, Sequelize} = require('sequelize')

module.exports = {
    createBlog : async (req,res) =>{
        try {
        const {title, content, vidURL, keywords, country} = req.body
            console.log(req.body);
         const imgURL = req.file.filename

         const result = await blog.create(
         {
            title, content, vidURL, keywords,imgURL,country,UserId: req.user.id,
         })
         res.status(200).send(result)
        } catch (error) {
        //  console.log(error)
         res.status(400).send(error)
        }
     },
     getAll: async(req,res)=>{
        try {
            const page = +req.query.page ||  1
            const limit = +req.query.limit || 10;
            const offset = (page - 1) * limit;
            const search = {}
            const {title} = req.query
            if(title){
                search.title = {
                    [Op.like]: `%${title}%`};
            }
            // if(categoriId){
            //     search.categoriId = categoriId
            // }
            const total = await blog.count()


            const result = await blog.findAll({attributes:["title", "content", "vidURL", "keywords", "country","akunId"
           ]}) 
            res.status(200).send({
                totalpage: Math.ceil(total/limit),
                currentpage: page,
                total_blog: total,
                result, 
                status:true
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    likeBlog : async (req, res) => {
        try {
            const userId = req.user.id
            const blogId = req.body.blogId
            const isLike = await like.findOne(
                {where : {akunId : userId, blogBlogId : blogId}}
                )
            if (isLike === null) {
                await like.create(
                    {akunId : userId, blogBlogId : blogId}
                )
                res.status(200).send({
                    message : "like success"
                })
            }
            else{
                await like.destroy(
                    {
                        where : {akunId : userId, blogBlogId : blogId}
                    }
                    )
                    res.status(200).send({
                    message : "unlike success"
                })
                }
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    getLike: async(req,res)=>{
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit||10;
            const offset = (page - 1) * limit;
            
            const total = await like.count()
            const userId = req.user.id


            const result = await like.findAll({
                attributes:["blogBlogId"],
                where:{
                    akunId : userId
                },
                limit,
                offset: offset,
                include: [
                    {model: blog}
                ],
            }) 
            res.status(200).send({
                totalpage: Math.ceil(total/limit),
                currentpage: page,
                total_blog: total,
                result, 
                status:true
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },

}
