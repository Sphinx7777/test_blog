import { Request, Response } from 'express';
import { route, GET, POST, DELETE, before } from 'awilix-express'
import PostModel, { PostSchema, Post } from '../model/postModel';
import UserModel, { User } from '../model/userModel';
import { authUser } from '../middleware/authUser';
import { GoogleSpreadsheet } from 'google-spreadsheet';
const keys = require('../keys.json');
import asana from 'asana';
import SheetsModel, { SheetsSchema } from '../model/sheetsModel';
import { google } from 'googleapis';

const asanaRegSearch = async (workspaceId: any, userId: any, asanaClient: asana.Client) => {
	const MAIL_REGEX = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]/
	const PHONE_REGEX = /[0-9()\ ]{7,18}/;
	let phones: any[] = []
	let mails: any[] = []
	const asanaResponse = await asanaClient.tasks.findAll({
		assignee: userId,
		workspace: workspaceId,
		completed_since: 'now',
		opt_fields: 'id,name,assignee_status,completed,notes,created_at,modified_at,parent,assignee'
	});
	if (asanaResponse && asanaResponse.data && asanaResponse.data.length > 0) {
		for (let i = 0; i < asanaResponse.data.length; i++) {
			const element = asanaResponse.data[i];
			if (element.name && element.name.length > 0) {
				const temp = element.name.match(PHONE_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 7) {
					phones = phones.concat([temp[0].trim()])
				}
			}
			if (element.notes && element.notes.length > 0) {
				const temp = element.notes.match(PHONE_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 7) {
					phones = phones.concat([temp[0].trim()])
				}
			}
			if (element.name && element.name.length > 0) {
				const temp = element.name.match(MAIL_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 3) {
					mails = mails.concat([temp[0].trim()])
				}
			}
			if (element.notes && element.notes.length > 0) {
				const temp = element.notes.match(MAIL_REGEX)
				if (temp && temp.length > 0 && temp[0].trim().length >= 3) {
					mails = mails.concat([temp[0].trim()])
				}
			}
		}
	}
	return { phones, mails }
}

const parseErrorResponse = (errorResponse: any) => {
	return JSON.parse(JSON.stringify(errorResponse)).response;
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
				console.log('Google Error', parseErrorResponse(err));
				return;
			} else {
				console.log('Google connected');
				gsRun(client)
			}
		});

		const gsRun = async (cl: any) => {

			const gsApi = google.sheets({
				version: 'v4',
				auth: cl
			})

			const teamDatabaseOptions = {
				spreadsheetId: '1-b5WaeN8Wnc3cEKD1JRdY5KKVwQ76aijDB3BLIMdZGE',
				range: 'A1:V7000'
			}
			const allBrokersDatabaseOptions = {
				spreadsheetId: '1NmtWT2KuBs6sXego4sJDv3tfj4DsUm7wvSjGJkLk9gw',
				range: 'A1:AB15000'
			}
			const teamDatabaseResponse = await gsApi.spreadsheets.values.get(teamDatabaseOptions)
			const allBrokersDatabase = await gsApi.spreadsheets.values.get(allBrokersDatabaseOptions)

			const teamDatabase = teamDatabaseResponse
				&& teamDatabaseResponse.data
				&& teamDatabaseResponse.data.values
				&& teamDatabaseResponse.data.values.length > 0
				? teamDatabaseResponse.data.values
				: []
			const teamDatabaseNamesArr = teamDatabase[0]
			const teamDatabaseForBase: any = []
			teamDatabase.shift()
			if (teamDatabase) {
				for (let i = 0; i < teamDatabase.length; i++) {
					const element = teamDatabase[i];
				}
			}




			console.log(
				'Google_DATA=', teamDatabase,
				'Google_Data_222=', allBrokersDatabase,
				'2_ONE_RES_Items=', teamDatabase[0],
				teamDatabase[1],
				'2_TWO_RES_Items=', allBrokersDatabase.data.values[0],
				allBrokersDatabase.data.values[1],
				'teamDatabaseForData', teamDatabaseForBase
			)
		}



		// 	* @name getKey
		// 	* @description Get private key for Google Service account.
		// 	* @author Vlad Shepelenko
		// 	*/
		//    private getKey(): string {
		// 	   const { config } = this.di;
		// 	   return config.googleCalendar.private_key_id;
		//    }
		//    /**
		// 	* @name getJwt
		// 	* @description Generate JWT class instance for getting access to Google Service account.
		// 	* @author Vlad Shepelenko
		// 	*/
		//    private getJwt(): JWT {
		// 	   const { config } = this.di;
		// 	   return new google.auth.JWT(
		// 		   config.googleCalendar.client_email, null, config.googleCalendar.private_key,
		// 		   [
		// 			   'https://www.googleapis.com/auth/calendar',
		// 			   'https://www.googleapis.com/auth/calendar.events'
		// 		   ],
		// 		   config.googleCalendar.impersonateAccount
		// 	   );
		//    }
		//    /**
		// 	* @name parseErrorResponse
		// 	* @description Transforms Goolge error response into correct object, removing plain text from it.
		// 	* @author Vlad Shepelenko
		// 	*/






















		// const doc = new GoogleSpreadsheet('1fO4oGQpS6yIENQECgdFzHXW4iS2AtXH0BYyWG7Pi9Mw');

		// await doc.useServiceAccountAuth({
		// 	client_email: "shetts@modern-photon-298110.iam.gserviceaccount.com",
		// 	private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDI0zy8RG0HTRaK\n0xkoZoeZy+ca/DOhZfBkhQ1JqYn6Wn+53uWAa8bjHizHt0NOp3CW2kiAtE6jwcIH\nO9mS4LUWRyJLuECNXUM0uBV9TcvvHHRYkKkv2NHsbYq7Feb5yaWublNz+2V3TGSB\nQE6Rjwxxjt40fD0cKpO2RVkBLEF4KZ4RQOhFY+fuTLj0VJjZV0u1EfTp26U+Ov8P\n8m9Cv4OXuszPNOV/2bOVU8T2dvMyNMT6Jct8WzWLQICwbi3FGXMlWHuEUOeCRXo9\nI9ETYOhB4nWBqv3mWP8c+MPTdhkw7/ZUiJV5g9s0pRpY5vrTNJI3sq04fyQLGAY8\nZwlw/N01AgMBAAECggEAVuzP+jGn+6QLYNWUqx8ODKzsgIqvkmm8TtYkdUD0HzAy\n3vIy5o5ADSiPe3bApHfnTPR4s3TYIRuJ73WhbGjlGRp7Jsk+77FxmI0hiBY3cm0f\nkwIyqSoxWyPjC62kR3RXyZOpfadQOP4Q9r0uBOUlHrYXSiKIlPt86kVEDDTqtaaR\ngjpMkSrXxJw2qDUkIVXxqjk9/JzmRRzIsZkErGsJUAbOc1mB0v5OL93dslsHPM4w\nlMbD0j+v833BQ92XCxLVUu3NtHCEanfy4R94TWxvlH8hO10McUhWUlhymgndZiXp\nq/LurIzi4TCyR0Snobcc/xBBbcn4c1HkfSoDDZCddQKBgQDq9Tpk554nkLejXGXA\nDUESX1+Zn8N5lSmrZWGO2qAQxUNNQjmbfQ3yuXwjyXk7HE5CKTilb0QSffJ0egGY\n4YE9NM9TB4ktBKhbGSdvJ6RWAb5RoGpp1htye60OYO0YgZFITvkc68AATQe+2etw\njk4Xa6/pm8w4DbP7w7yWiH4fRwKBgQDaz3Z0rdpRqoRZsrhBEmM2axX1ebx0c9cc\nbrVjNsUkXvghUuG9LY/rN/JUBc8TIs09HFLStYeG8X5pns27X3Lq5wXRXvzymwfT\nNQoGGMfVe/Vp0yvgtMT1IzA/W0P/MiRfp1IGqMnhL2Zib61xP+vJ6ep7y06lzZfz\ns6xHZUD1owKBgBY0yyoSQf5XTSPhbbRzDD1iSjTIxr7M/D04vbm0rAApxKyen7c0\nYIcaRMNVHWIa0MKsBrCMDZD52lpr1Y7PcVmJjja4tZxNnmPNws5cnsmKLKSmVqhe\nFgYB7l83hfEU/dgprp2vIlxk62B8VCY1LOhFw0B++xQpJ2OaIk7P46utAoGBAILe\nRG3isUnY35G6Z6NbuQUKJTcNWV6ZDhZOTKSLVHu9ZVCg/qyj/IjljEUeuEwsq24a\na5rkwas+8ql/NnMT0mqWRA+GbWk4ugRjm5wr5BFWM2DY0UxzMb2gDzJFhrSyK7ke\nHNwoxZ2uOOE1BBpQ7dh01C64WVCnV3OFiculzqVbAoGBAMoUSB58F9MqwlTIVtyW\nrzY8P/KjLBu5hqNbvCmymIH0yyt1FOeVEb11wes1NRtjzyBENZ90zy7wtv+s/jQ1\nScvrB5V7FoE2En+H6lP6VZMmV58M4OI52K8UGx+bETlOE3F/j4yNsAA6/TWTvhiN\nHH+dvip+IDOR3DQ4u2X9hVHp\n-----END PRIVATE KEY-----\n",
		// })

		// await doc.loadInfo()
		// const sheet = doc.sheetsByIndex[0]
		// const rows = await sheet.getRows({
		// 	limit: 15000,
		//     offset: 0
		// })
		// let data: any[] = []

		// rows.forEach(r => {
		// 	const item = {
		// 		phone: r['tel nr.'] || '',
		// 		email: r['El. paštas'] || '',
		// 		groupe: r['vardas'] || '',
		// 		language: r['Kalba'] || '',
		// 		reference: r['Kreipinys'] || '',
		// 		details: r['skambino del'] || ''
		// 	}
		// 	console.log('getOneRow_DATA=', r.rowIndex)
		// data = [...data, item]
		// })
		// console.log('rows', rows[2].a1Range)
		// await sheet.loadCells('A1:V4000')
		// const c6 = sheet.getCellByA1('C6')
		// console.log('6666', c6, '1111', a1.formattedValue)
		// console.log('SSSSSS', sheet.title, sheet.columnCount, sheet.rowCount, sheet.columnCount, doc.title, doc.sheetCount, 'items==', data.length, sheet.cellStats)
		// @ts-ignore
		// const response = await SheetsModel.create({tableData: data})
		// const temp = response.tableData.concat(data)
		// const response2 = await SheetsModel.findByIdAndUpdate({_id: '600af46a5cb7a0516a909016'}, {tableData: temp})
		// const search = response2.tableData.filter(o => o.phone === '37065744369')
		// console.log('response', response2._id, 'search' , search)


		// const headerValues = 
		// [
		// 	'Grupė',          'Data',
		// 	'Kalba',          'Kreipinys',
		// 	'El. paštas',     'Telefonas',
		// 	'Detalės',        'Segmentas',
		// 	'High Net Worth', 'Member Rating',
		// 	'Skambinti kas',  'Komentarai1',
		// 	'Komentarai2',    'Komentarai3',
		// 	'Komentarai4',    'Emails sent',
		// 	'Opened',         'Clicked'
		// ]


		// 		await sheet.loadCells('A2:B4')

		// const c6 = sheet.getCellByA1('C6')
		// console.log('loadCells', sheet.cellStats, c6, c6.value, c6.formattedValue);

		const myAsanaToken = '1/1166882439558482:541134aff3e6d6b1606269bb4f8c7315'
		const clToken = '1/831618836385:9c669fc1d78c7d186772114ae5c699d9'


		const asanaClient = asana.Client.create().useAccessToken('1/831618836385:9c669fc1d78c7d186772114ae5c699d9');
		const asanaUser = await asanaClient.users.me()
		const userId = asanaUser.gid;
		const workspaceIds = asanaUser.workspaces;
		let allPhones: any[] = []
		let allMails: any[] = []

		if (asanaClient && asanaUser && userId && workspaceIds && workspaceIds.length > 0) {
			for (let i = 0; i < workspaceIds.length; i++) {
				const id = workspaceIds[i].gid;
				const response = await asanaRegSearch(id, userId, asanaClient)
				allPhones = Array.from(new Set(allPhones.concat(response.phones)));
				allMails = Array.from(new Set(allMails.concat(response.mails)));
			}
		}

		console.log('USER_TASKS_phones', allPhones, 'mails', allMails);

		// asanaClient.users.me()
		// 	.then((user: any) => {
		// 		const userId = user.gid;
		// 		const workspaceId = user.workspaces[0].gid;

		// 		// @ts-ignore
		// 		// client.tasks.searchTasksForWorkspace(workspaceId)
		// 		// .then((result: any) => {
		// 		//     console.log('searchTasksForWorkspace', result);
		// 		// });

		// 		// client.users.findById(userId)
		// 		// 	.then((result: any) => {
		// 		// 		console.log('findById', result);
		// 		// 	});

		// 		// client.users.findAll(workspaceId)
		// 		// 	.then((result: any) => {
		// 		// 		console.log('findAll', result);
		// 		// 	});


		// 		// @ts-ignore
		// 		// 	client.tasks.updateTask('task ID', {notes: "test", pretty: true})
		// 		// .then((result: any) => {
		// 		//     console.log(result);
		// 		// });

		// 		// @ts-ignore
		// 		// client.tasks.getTask('task ID')
		// 		// .then((result: any) => {
		// 		// 	console.log('getTask', result);
		// 		// });

		// 		// client.users.findByWorkspace(workspaceId)
		// 		// 	.then((result: any) => {
		// 		// 		console.log('getUsersForWorkspace', result);
		// 		// 	});
		// 		console.log('USER', user)
		// 		// const mail = "[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]"
		// 		// const aa = 'first draft save moves back spamoglot13@gmail.com to list 45634288'.match(mail2) || []
		// 		// console.log('aaaaaaaaa', aa[0])


		// 		return asanaClient.tasks.findAll({
		// 			assignee: userId,
		// 			workspace: workspaceId,
		// 			completed_since: 'now',
		// 			opt_fields: 'id,name,assignee_status,completed,notes,created_at,modified_at,parent,assignee'
		// 		});
		// 	})
		// 	.then((response: any) => {
		// 		const mail = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]/
		// 		const phone = /[0-9()\ ]{7,18}/;
		// 		let phones: any[] = []
		// 		let mails: any[] = []
		// 		if (response && response.data && response.data.length > 0) {
		// 			for (let i = 0; i < response.data.length; i++) {
		// 				const element = response.data[i];
		// 				if(element.name && element.name.length > 0) {
		// 					const temp = element.name.match(phone)
		// 					if (temp && temp.length > 0 && temp[0].trim().length >= 7) {
		// 						phones = phones.concat([temp[0].trim()])
		// 					}
		// 				}
		// 				if(element.notes && element.notes.length > 0) {
		// 					const temp = element.notes.match(phone)
		// 					if (temp && temp.length > 0 && temp[0].trim().length >= 7) {
		// 						phones = phones.concat([temp[0].trim()])
		// 					}
		// 				}
		// 				if(element.name && element.name.length > 0) {
		// 					const temp = element.name.match(mail)
		// 					if (temp && temp.length > 0 && temp[0].trim().length >= 3) {
		// 						mails = mails.concat([temp[0].trim()])
		// 					}
		// 				}
		// 				if(element.notes && element.notes.length > 0) {
		// 					const temp = element.notes.match(mail)
		// 					if (temp && temp.length > 0 && temp[0].trim().length >= 3) {
		// 						mails = mails.concat([temp[0].trim()])
		// 					}
		// 				}
		// 			}
		// 		}

		// 		console.log('USER_TASKS_phones', phones, 'mails', mails);
		// 	})





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





// const populatePosts = await Promise.all(response.posts.map(async (post: any) => {
//   const newPost = await this.postModel.findById({ _id: post._id }).populate('authorId', '-password -token -postsId')
//   return newPost
// }))