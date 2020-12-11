import { Request, Response } from 'express';
import { route, GET, POST, DELETE, before } from 'awilix-express'
import PostModel, { PostSchema, Post } from '../model/postModel';
import UserModel, { User } from '../model/userModel';
import { authUser } from '../middleware/authUser';
import { GoogleSpreadsheet } from 'google-spreadsheet';
const creds = require('../client_secret.json');
import asana from 'asana';


@route('/api/v.1.0')
export default class PostsAPI {
	public postModel: Post;
	public userModel: User;
	constructor() {
		this.postModel = PostModel;
		this.userModel = UserModel;
	}

	@route('/posts')
	@GET()
	async getPosts(req: any, res: Response) {
		const pageNum = +req.query.pageNum >= 1 ? +req.query.pageNum : 1
		const perPage = +req.query.perPage ? +req.query.perPage : 5
		const filter = { title: req.query.title, fullName: req.query.fullName }
		const sorts = req.body.sorts ? req.body.sorts : null
		try {
			const response = await PostSchema.page(pageNum, perPage, { ...filter }, sorts)
			//console.log('SERVER_RESPONSE',response)
			return res.status(200).json({
				data: response.posts, success: true, pager: {
					page: pageNum, count: response.count, perPage: perPage
				}
			});
		}
		catch (err) {
			res.status(500).json({ message: err.message, success: false })
		}
	}

	@route('/posts/one/:id')
	@GET()
	async getOnePosts(req: any, res: Response) {
		const doc = new GoogleSpreadsheet('1fO4oGQpS6yIENQECgdFzHXW4iS2AtXH0BYyWG7Pi9Mw');

		await doc.useServiceAccountAuth(creds)

		await doc.loadInfo()
		const sheet = doc.sheetsByIndex[0]
		const rows = await sheet.getRows({
			limit: 50,
			offset: 1
		})
		// rows.forEach(r => {
		// 	console.log('getOnePosts', `Hours: ${r.Hours} Tasks: ${r.Tasks}`)
		// 	if (r.Hours === '666') {
		// 		r.Hours = '333'
		// 		r.save()
		// 	}
		// 	if (r.Tasks === 'Donate') {
		// 		r.delete()
		// 	}
		// })

		const client = asana.Client.create().useAccessToken('in skype');

		// @ts-ignore
		// 	client.tasks.findAll()
		// 	.then((result: any) => {
		// 		 console.log('getTasks__ALLLLLL', result);
		// 	});

		// @ts-ignore
		// client.tasks.getTasks({ opt_fields: 'id,name,assignee_status,completed,notes' })
		// 	.then((result: any) => {
		// 		console.log('AAAAAAAAAAA', result);
		// 	});

		client.users.me()
			.then((user: any) => {
				const userId = user.gid;
				const workspaceId = user.workspaces[0].gid;
				
				// @ts-ignore
				// client.tasks.searchTasksForWorkspace(workspaceId)
				// .then((result: any) => {
				//     console.log('searchTasksForWorkspace', result);
				// });

				// client.users.findById(userId)
				// 	.then((result: any) => {
				// 		console.log('findById', result);
				// 	});

				// client.users.findAll(workspaceId)
				// 	.then((result: any) => {
				// 		console.log('findAll', result);
				// 	});


				// @ts-ignore
				// 	client.tasks.updateTask('task ID', {notes: "test", pretty: true})
				// .then((result: any) => {
				//     console.log(result);
				// });

				// @ts-ignore
				// client.tasks.getTask('task ID')
				// .then((result: any) => {
				// 	console.log('getTask', result);
				// });

				// client.users.findByWorkspace(workspaceId)
				// 	.then((result: any) => {
				// 		console.log('getUsersForWorkspace', result);
				// 	});
				console.log('USER', user)

				// const mail = "[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]"
				// const phone = '[0-9]{8}'
				// const aa = 'first draft save moves back spamoglot13@gmail.com to list 45634288'.match(mail) || []
				// console.log('aaaaaaaaa', aa[0])


				return client.tasks.findAll({
					assignee: userId,
					workspace: workspaceId,
					completed_since: 'now',
					opt_fields: 'id,name,assignee_status,completed,notes,created_at,modified_at,parent,assignee'
				});
			})
			.then((response: any) => {
				console.log('USER_TASKS', response.data);
			})





		try {
			const id = req.params.id
			const post = await this.postModel.findById(id).populate('authorId', '-password -token -postsId')
			return res.status(200).json({ data: [post], success: true });
		} catch (err) {
			res.status(500).json({ message: err.message, success: false })
		}
	}

	@route('/posts/add')
	@POST()
	@before(authUser)
	async createPost(req: any, res: Response) {
		try {
			const createdPost = await this.postModel.create(req.body);
			const response = await this.postModel.findOne({ _id: createdPost._id }).populate('authorId', '-password -token -postsId')
			const _id = req.body.authorId
			const user: any = await this.userModel.findOne({ _id })
			if (user.postsId && user.postsId.length) {
				user.postsId.push(createdPost._id)
			} else {
				user.postsId = []
				user.postsId.push(createdPost._id)
			}
			await UserModel.findOneAndUpdate({ _id }, user)
			res.status(200).json({ success: true, message: 'Post successfully added', data: [response] })
		} catch (err) {
			res.status(500).json({ message: err.message, success: false })
		}
	}

	@route('/posts/update/:id')
	@POST()
	@before(authUser)
	async updatePost(req: any, res: Response) {
		try {
			await this.postModel.findOneAndUpdate({ _id: req.params.id }, req.body.post);
			const updatePost = await this.postModel.findOne({ _id: req.params.id });
			res.json({ success: true, message: 'Post updated successfully', data: [updatePost] })
		} catch (err) {
			res.status(500).json({ message: err.message, success: false })
		}
	}

	@route('/posts/del/:id')
	@DELETE()
	@before(authUser)
	async deletePost(req: any, res: Response) {
		try {
			const deletePost = await this.postModel.findOne({ _id: req.params.id });
			const _id = deletePost.authorId
			const user: any = await this.userModel.findOne({ _id })
			if (user.postsId && user.postsId.length) {
				user.postsId = user.postsId.filter((postId: string) => postId.toString() !== req.params.id.toString())
			}
			await this.postModel.deleteOne({ _id: req.params.id })
			await UserModel.findOneAndUpdate({ _id }, user)
			const id = deletePost._id
			res.json({ data: [{ id }], success: true, message: 'Post successfully deleted' })
		} catch (err) {
			res.status(500).json({ message: err.message, success: false })
		}
	}
}





// const populatePosts = await Promise.all(response.posts.map(async (post: any) => {
//   const newPost = await this.postModel.findById({ _id: post._id }).populate('authorId', '-password -token -postsId')
//   return newPost
// }))