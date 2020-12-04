import { prop, Typegoose, InstanceType, Ref, staticMethod } from 'typegoose';
import mongoose from 'mongoose';
import UserModel, { UserSchema } from './userModel'
import validator from 'validator'



export class PostSchema extends Typegoose {
  @prop({
    required: true,
    minlength: 5,
    maxlength: 200
  })
  public title: string;

  @prop({
    required: true,
    maxlength: 5000
  })
  public description: string;

  @prop({
    default: new Date().getTime()
  })
  public createdDate?: Date;

  @prop()
  public updateDate?: Date;

  @prop({ ref: 'UserSchema' })
  public authorId?: Ref<UserSchema>;



  @staticMethod
  public static page(pageNum: number = 1, perPage: number = 100, filter: any = null, sorts: any = null) {
    const query: any = {};
    let lookup = {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'authorId'
    }

    //console.log('staticMethod__FILTER', filter,'pageNum',pageNum,'perPage',perPage)
    if (filter) {
      const ObjectId = mongoose.Types.ObjectId;
      if (filter.hasOwnProperty('fullName') && filter.fullName && !validator.isEmpty(filter.fullName)) {
        query['authorId.fullName'] = {
          $regex: filter.fullName, $options: 'i',
        }
      }
    
      if (filter.hasOwnProperty('title') && filter.title && !validator.isEmpty(filter.title)) {
        query['title'] = {
          $regex: filter.title, $options: 'i',
        };
      }
    }
    let f: Array<any> = [

      { $lookup: lookup },
      {
        $unwind: {
          path: '$authorId'
        }
      },
      { $project: { "authorId.token": 0, "authorId.password": 0, } },

      { $match: query },
    ];

    // // 2 : sort
    const sort: any = {};
    if (sorts) {
      if (sorts.sort === 1 || sorts.sort === -1) {
        sort[sorts.field] = sorts.sort;
      }
    }

    if (Object.entries(sort).length >= 1 && sorts.constructor === Object) {
      f = f.concat([{ $sort: sort }]);
    }

    // 3 : limit
    f = f.concat([
      { $skip: (pageNum - 1) * perPage },
      { $limit: perPage }
    ]);
    console.log('staticMethod__FILTER', filter, 'QUERY', query, 'F', f)

    // log('====================================');
    // log(JSON.stringify(f, null, 5));
    // log('====================================');

    return PostModel.count(query)
      .then((count: any) => {
        //console.log('PostModelReturn__111', query, count)

        return PostModel
          .aggregate(f)
          .collation({ locale: 'en', strength: 2 })
          .then((posts: any) => {
            //console.log('PostModelReturn__222', posts, count)
            return { posts, count }
          })
      }
      );
  }
}

export type Post = mongoose.Model<InstanceType<PostSchema>, {}> & PostSchema;

const PostModel: Post = new PostSchema().getModelForClass(PostSchema, {
  schemaOptions: {
    collection: 'posts',
  },
});

export default PostModel;
