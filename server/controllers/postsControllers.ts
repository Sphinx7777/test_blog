import { Request, Response } from 'express';
import { route, GET, POST, DELETE, before } from 'awilix-express'
import PostModel, { PostSchema, Post } from '../model/postModel';
import UserModel, { User } from '../model/userModel';
import { authUser } from '../middleware/authUser';
// const keys = require('../keys.json');
import asana from 'asana';
import SheetsModel from '../model/sheetsModel';
import { google } from 'googleapis';

const baseColLetter = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'
]
const MAIL_REGEX = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]/
const PHONE_REGEX = /[0-9()\ +.]{7,18}/;
const CLEAR_PHONE_REGEX = /[()\ +.-]+/g;

const getAllBrokerCoordinates = (i: number) => {
	return [
		{
			comment2020: {
				row: i + 1,
				col: baseColLetter[0]
			}
		},
		{
			comment2019: {
				row: i + 1,
				col: baseColLetter[1]
			}
		},
		{
			dataId: {
				row: i + 1,
				col: baseColLetter[3]
			}
		},
		{
			name: {
				row: i + 1,
				col: baseColLetter[6]
			}
		},
		{
			phone: {
				row: i + 1,
				col: baseColLetter[7]
			}
		},
		{
			price: {
				row: i + 1,
				col: baseColLetter[10]
			}
		},
		{
			year: {
				row: i + 1,
				col: baseColLetter[16]
			}
		},
		{
			calledAbout: {
				row: i + 1,
				col: baseColLetter[18]
			}
		},
		{
			agentID: {
				row: i + 1,
				col: baseColLetter[19]
			}
		},
		{
			allBaseDate: {
				row: i + 1,
				col: baseColLetter[20]
			}
		},
	]
}
const getTeamCoordinates = (i: number) => {
	return [

		{
			group: {
				row: i + 1,
				col: baseColLetter[0]
			}
		},
		{
			data: {
				row: i + 1,
				col: baseColLetter[1]
			}
		},
		{
			language: {
				row: i + 1,
				col: baseColLetter[2]
			}
		},
		{
			reference: {
				row: i + 1,
				col: baseColLetter[3]
			}
		},
		{
			email: {
				row: i + 1,
				col: baseColLetter[4]
			}
		},
		{
			phone: {
				row: i + 1,
				col: baseColLetter[5]
			}
		},
		{
			source: {
				row: i + 1,
				col: baseColLetter[6]
			}
		},
		{
			details: {
				row: i + 1,
				col: baseColLetter[7]
			}
		},
		{
			segment: {
				row: i + 1,
				col: baseColLetter[8]
			}
		},
		{
			HighNetWorth: {
				row: i + 1,
				col: baseColLetter[9]
			}
		},
		{
			memberRating: {
				row: i + 1,
				col: baseColLetter[10]
			}
		},
		{
			callEvery: {
				row: i + 1,
				col: baseColLetter[11]
			}
		},
		{
			comments1: {
				row: i + 1,
				col: baseColLetter[12]
			}
		},
		{
			comments2: {
				row: i + 1,
				col: baseColLetter[13]
			}
		},
		{
			comments3: {
				row: i + 1,
				col: baseColLetter[14]
			}
		},
		{
			comments4: {
				row: i + 1,
				col: baseColLetter[15]
			}
		},
		{
			emailsSent: {
				row: i + 1,
				col: baseColLetter[16]
			}
		},
		{
			opened: {
				row: i + 1,
				col: baseColLetter[17]
			}
		},
		{
			clicked: {
				row: i + 1,
				col: baseColLetter[18]
			}
		},
		{
			opened2020Q4: {
				row: i + 1,
				col: baseColLetter[19]
			}
		},
		{
			clickedInvest: {
				row: i + 1,
				col: baseColLetter[20]
			}
		},
		{
			clickedSell: {
				row: i + 1,
				col: baseColLetter[21]
			}
		},


	]
}

const createUpdateDataBase = async (data: any[], searchType: string) => {



	let response: any[] = []
	for (let i = 0; i < data.length; i++) {
		const element = data[i];
		let res: any = null
		let res2: any = null
		if (element.phone && element.phone.length > 0) {
			res = await SheetsModel.findOne({ phone: element.phone })
		}
		if ((!element.phone || element.phone.length === 0) && element.email && element.email.length > 0) {
			res2 = await SheetsModel.findOne({ email: element.email })
		}
		if (res && res !== null) {
			if (res.phone && res.phone === element.phone) {
				delete element.phone
			}
			element.searchType = (res.searchType && res.searchType.length > 0 && !res.searchType.includes(searchType)) ? `${res.searchType},${searchType}` : searchType
			res.set(element)
			await res.save()
			response = response.concat(['Update'])
		}
		if (res2 && res2 !== null) {
			if (res2.email && res2.email > 0 && res2.email === element.email) {
				delete element.email
			}
			if (res2.phone && res2.phone > 0 && res2.phone === element.phone) {
				delete element.phone
			}
			element.searchType = (res2.searchType && res2.searchType.length > 0 && !res2.searchType.includes(searchType)) ? `${res2.searchType},${searchType}` : searchType
			res2.set(element)
			await res2.save()
			response = response.concat(['Update'])
		}
		if ((!res && !res) || (res === null && res2 === null)) {
			element.searchType = searchType
			await SheetsModel.create(element)
			response = response.concat(['Create'])
		}
	}
	return response
}

const asanaRegSearch = async (workspaceId: any, userId: any, asanaClient: asana.Client) => {
	let asanaData: any[] = []
	const asanaResponse = await asanaClient.tasks.findAll({
		assignee: userId,
		workspace: workspaceId,
		completed_since: 'now',
		opt_fields: 'id,name,assignee_status,completed,completed_at,notes,created_at,modified_at,parent,assignee,projects,workspace,hearted,memberships,custom_fields'
	})

	if (asanaResponse && asanaResponse.data && asanaResponse.data.length > 0) {

		for (let i = 0; i < asanaResponse.data.length; i++) {
			const element = asanaResponse.data[i];
			let doc: any = {}
			if (element.name && element.name.length > 0) {
				const temp = element.name.match(PHONE_REGEX)
				const isPhone = temp && temp.length > 0 && temp[0].trim().replace(CLEAR_PHONE_REGEX, '').length >= 7 && temp[0].trim().replace(CLEAR_PHONE_REGEX, '').length <= 11
				if (isPhone) {
					doc.phone = temp[0].trim().replace(CLEAR_PHONE_REGEX, '')
				}
			}
			if (element.notes && element.notes.length > 0) {
				const temp = element.notes.match(PHONE_REGEX)
				const isPhone = temp && temp.length > 0 && temp[0].trim().replace(CLEAR_PHONE_REGEX, '').length >= 7 && temp[0].trim().replace(CLEAR_PHONE_REGEX, '').length <= 11
				if (isPhone) {
					doc.phone = temp[0].trim().replace(CLEAR_PHONE_REGEX, '')
				}
			}
			if (element.name && element.name.length > 0) {
				const temp = element.name.match(MAIL_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 5) {
					doc.email = temp[0].trim().replace(/[()\ +]+/g, '')
				}
			}
			if (element.notes && element.notes.length > 0) {
				const temp = element.notes.match(MAIL_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 5) {
					doc.email = temp[0].trim().replace(/[()\ +]+/g, '')
				}
			}
			const addDock = {
				taskName: element.name,
				taskDescription: element.notes,
				taskCreated: element.created_at,
				taskUpdate: element.modified_at,
				taskCompleted: element.completed,
				taskModifiedAt: element.modified_at,
				taskCompletedAt: element.completed_at,
				taskAssigneeStatus: element.assignee_status,
				dataType: 'teamData',
			}
			if ((doc.phone && doc.phone.length > 0) || (doc.email && doc.email.length > 0)) {
				doc = { ...doc, ...addDock }
				asanaData = [...asanaData, doc]
			}
		}
	}
	return asanaData
}
const getAsanaDate = async () => {
	const myAsanaToken = '1/1166882439558482:541134aff3e6d6b1606269bb4f8c7315'
	const clToken = '1/831618836385:9c669fc1d78c7d186772114ae5c699d9'

	const asanaClient = asana.Client.create().useAccessToken(clToken);
	const asanaUser = await asanaClient.users.me()
	const userId = asanaUser.gid;
	const workspaceIds = asanaUser.workspaces;
	let asanaData: any[] = []


	if (asanaClient && asanaUser && userId && workspaceIds && workspaceIds.length > 0) {
		for (let i = 0; i < workspaceIds.length; i++) {
			const id = workspaceIds[i].gid;
			const response = await asanaRegSearch(id, userId, asanaClient)
			asanaData = [...asanaData, ...response]
		}
	}

	return asanaData
}

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



    const client = new google.auth.JWT(
			"570902052342-compute@developer.gserviceaccount.com",
			null,
			"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/y55/ndUGLrbZ\nq186j3YOShUGkZF0V1I5JJaS8r5SJPrUdKlwsaZgQMB1aIqr+djNQ2TMeMIurRte\niG1k0E4S/XjOIHUgVB1VV2aY+lKyJmJUii0smaIyfHyqwxXjhmk5lG1GMXWOBklG\n4rMvOPcdDOTaBTR30Xl0YBURSNPkgN3/J4bsNz7AqM+5hcXezE1JNF0rUOkic+rl\nAuHFAN/4gaiu0kx1RcYvDx9wKooWhaqnlvOT2BBgrjNruemrqiN3HFtiYRY++jzw\nSBwSKeSV/R5EaPd8Pdj/fUxmyUGpcbAykbIgZVwY0pAn3LhdB+vJ7/F0i5OP/aYQ\n3rgXr9GrAgMBAAECggEAXwdM4284xqTrrSLnfpTpSgAztbr3Zj0DvNNflbSXTw0K\niKy67V7gEA3VLfcbykTzQhSzw0nL8KONjYOsLAi3vln/eqYDUn7Kv+ebqo1Q3vr8\numVyJ4iBoGEkxdj+JesJhOGBWQeVdsavlOMrI+kmKysh0tJEYl+UPXCDz7oVXsAN\naG7WLMXwgO5JX1VHQl+MQN7ggLvF2pcLrJlIP1wrDqTYbxbShhxJpaMgtp9mRarW\nJyoRxae+vl3pQzpgJdmDICTVYmiywgeJcG8QVcQVh+t9kMYqObH0uh3YAMlZlRh1\nI6fAt4PWBsQY8oKxeNpE4Xs0uswoWeQAwN3iTkeUaQKBgQDfS6UxRjVKD2PZgUcM\n8+LaAtbEQhUa3kjGgKhG49/U5myCx0efKnqB9Ep59eNJx++hvVnPaPaF+YytuSTM\nkKJmZ+xqfYTAd7mhnAbQg8VeNYDPg0XynySc7N2VBrd/s6q2VHjnmoJs9HqAbnZB\nD+zcXIIohxfwHklfTYO6JC4r4wKBgQDb4uSbEZfwj/Y6O40UPSVSthknn5er49Al\nE6bAkymcFFuc+Xy7xHV3+MY6cNYnihShhbzlOaGsqkW9VS15SBjPp/Pju+RE0oUe\nFzXilpWpmxT/efezhfYGq8dX7bcpXWn178PvN1jmULGLlBS9BYO+c1pVcvMZZdYT\nxX+umFu9mQKBgQDJ9NbhrAhChYzfigdC9co1N+Aa/VGtTWIw9ug7xZoKKqX12lsy\n3+6RXuuFRxlc/9ICTQnPh7WAEuZjsVJRGndne5Ld9cx9b0ubmUyohqWZwXZROP+o\norswmyMFyF9qxoseAWSgxKQ1+yBYzI9z5P1riNfH4/eImzvtUGRVlKeV1QKBgQCC\ntbfLboPxnsJyD2Bn/YkoR9NgOICCz6O1xp7Drzd27qse/zfkrn5d2OaNavIDAxQM\niGGnqcCv0XAvgmjLxc3p8x8J63Fgb/xtzMJddcJ11hh/XdOfRizf/lE7tbXBwyPv\n7J1+oFoaXzGLlXVWf+a22f+C+BgGqwC9NBQYh71RUQKBgFzvudXHTpbI8Ys6PHDg\nDlFijS9rqRrol25yHFVqH+bDJHGQRKT9WIGO+jLGIVZQkaqLHMLHqkNJGA7FR82A\nIUiybbxR3/cQnjKdshSf+X682d+s9cFcQN4EVg62emE3q3mDmtsrOgL3GG4RY0t6\noPTwvLIXO9AYHffF0ULy8YQ+\n-----END PRIVATE KEY-----\n",
			['https://www.googleapis.com/auth/spreadsheets']
		);

		client.authorize((err, token) => {
			if (err) {
				console.log('Google authorize Error===', err);
				return;
			} else {
				console.log('Google connected !!!');
				createDataBase(client)
			}
		});

		const createDataBase = async (cl: any) => {
			const gsApi = google.sheets({
				version: 'v4',
				auth: cl
			})

			const teamDatabaseOptions = {
				spreadsheetId: '1-b5WaeN8Wnc3cEKD1JRdY5KKVwQ76aijDB3BLIMdZGE',
				range: 'A1:V10000'
			}
			const allBrokersDatabaseOptions = {
				spreadsheetId: '1NmtWT2KuBs6sXego4sJDv3tfj4DsUm7wvSjGJkLk9gw',
				range: 'A1:U20000'
			}
			try {

				console.time('CREATED_DATA')
				console.time('get_Google DBX')
				const teamDatabaseResponse = await gsApi.spreadsheets.values.get(teamDatabaseOptions)
				const allBrokersDatabaseResponse = await gsApi.spreadsheets.values.get(allBrokersDatabaseOptions)

				let teamDatabase =
					teamDatabaseResponse
						&& teamDatabaseResponse.data
						&& teamDatabaseResponse.data.values
						&& teamDatabaseResponse.data.values.length > 0
						? teamDatabaseResponse.data.values
						: []
				let allBrokersDatabase =
					allBrokersDatabaseResponse
						&& allBrokersDatabaseResponse.data
						&& allBrokersDatabaseResponse.data.values
						&& allBrokersDatabaseResponse.data.values.length > 0
						? allBrokersDatabaseResponse.data.values
						: []


				console.timeEnd('get_Google DBX')

				

				console.time('GET_SET_ASANA_DATA')
				const asanaData = await getAsanaDate()
				const asanaRes = await createUpdateDataBase(asanaData, 'asanaDocs')
				const a1 = asanaRes.filter(i => i === 'Update')
				const a2 = asanaRes.filter(i => i === 'Create')

				console.log('asanaRes', asanaRes.length, 'asanaRes_Update', a1.length, 'asanaRes_Create', a2.length)

				console.timeEnd('GET_SET_ASANA_DATA')


				let allBrokersDocks: any[] = []
				for (let i = 1; i < allBrokersDatabase.length; i++) {
					const element = allBrokersDatabase[i];
					const phone = element[7].trim().replace(CLEAR_PHONE_REGEX, '')

					const doc = {
						comment2020: element[0],
						comment2019: element[1],
						brokersTabId: element[3],
						name: element[6],
						phone,
						price: element[10],
						year: element[16],
						calledAbout: element[18],
						agentID: element[19],
						allBrokersBaseDate: element[20],
						dataType: 'allBrokersData',
						allBrokersCoordinates: getAllBrokerCoordinates(i)
					}
					allBrokersDocks = [...allBrokersDocks, doc]
				}
				const allBrokersRes = await createUpdateDataBase(allBrokersDocks, 'allBrokersDocks')

				const b1 = allBrokersRes.filter(i => i === 'Update')
				const b2 = allBrokersRes.filter(i => i === 'Create')

				console.log('allBrokersRes', allBrokersRes.length, 'allBrokersRes_Update', b1.length, 'allBrokersRes_Create', b2.length)
				let teamDocks: any[] = []
				for (let i = 1; i < teamDatabase.length; i++) {
					const element = teamDatabase[i];
					const phone = element[5].trim().replace(CLEAR_PHONE_REGEX, '')
					const email = element[4].trim()
					const doc = {
						group: element[0],
						teamDate: element[1],
						language: element[2],
						reference: element[3],
						email,
						phone,
						source: element[6],
						details: element[7],
						segment: element[8],
						HighNetWorth: element[9],
						memberRating: element[10],
						callEvery: element[11],
						comments1: element[12],
						comments2: element[13],
						comments3: element[14],
						comments4: element[15],
						emailsSent: element[16],
						opened: element[17],
						clicked: element[18],
						opened2020Q4: element[19],
						clickedInvest: element[20],
						clickedSell: element[21],
						dataType: 'teamData',
						teamCoordinates: getTeamCoordinates(i)
					}
					teamDocks = [...teamDocks, doc]
				}
				const teamDocksRes = await createUpdateDataBase(teamDocks, 'teamDocks')

				const c1 = teamDocksRes.filter(i => i === 'Update')
				const c2 = teamDocksRes.filter(i => i === 'Create')

				console.log('teamDocksRes', teamDocksRes.length, 'teamDocksRes_Update', c1.length, 'teamDocksRes_Create', c2.length)

				console.timeEnd('CREATED_DATA')
			} catch (err) {
				console.error('CreateDataBase_ERROR===', err);
			}
		}


		try {
			const id = req.params.id
			const post = await this.postModel.findById(id).populate('authorId', '-password -token -postsId')
			return res.status(200).json({ data: [post], success: true });
		} catch (err) {
			res.status(500).json({ message: 'jdfjdhfjdhjfhdjfhdjfhdh', success: false })
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
