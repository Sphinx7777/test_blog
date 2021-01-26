import { route, GET, POST, DELETE, before } from 'awilix-express'
import { app } from '../server'
import PostModel, {PostSchema, Post} from '../model/postModel';
import { Request, Response } from 'express';



@route('')
export default class RenderAPI {
    public postModel: Post;
    constructor() {
        this.postModel = PostModel
    }

    @route('/')
    @GET()
    async getIndex(req: any, res: Response) {
        return app.render(req, res, '/index', req.query)
    }

    @route('/view')
    @GET()
    async getView(req: any, res: Response) {
        const id = req.params.id || req.query.id
        const posts: any = await this.postModel.findById(id).populate('authorId','-password -token -postsId');
        return app.render(req, res, '/view', {data: [posts]})
    }


    @route('/authorization')
    @GET()
    async getAuthorization(req: any, res: Response) {
        return app.render(req, res, '/authorization', req.query)
    }

    @route('/register')
    @GET()
    async getRegister(req: any, res: Response) {
        return app.render(req, res, '/register', req.query)
    }

    @route('/profile/:id')
    @GET()
    async getProfile(req: any, res: Response) {
        const id = req.params.id
        const posts: any = await this.postModel.findById(id).populate('authorId','-password -token -postsId');
        return app.render(req, res, '/profile', {data: posts})
    }

    @route('/posts')
    @GET()
    async getPosts(req: any, res: Response) {
       // console.log('SERVgetPostsQUERY', req.query )
        const pageNum = +req.query.pageNum >= 1 ? +req.query.pageNum : 1
        const perPage = +req.query.perPage ? +req.query.perPage : 5
        const filter = {title: req.query.title , lastName: req.query.lastName}
        const sorts = req.query.sorts ? req.query.sorts : null
        const response = await PostSchema.page(pageNum, perPage, {...filter} , sorts)
        //console.log('SERVgetRESPONSE', response )
        return app.render(req, res, '/posts', {data: response.posts, count: response.count})
    }
}