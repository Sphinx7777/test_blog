import { prop, Typegoose, pre, InstanceType, instanceMethod } from 'typegoose'
import mongoose, { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { IIdentity, ROLE } from '../config'
import { Request } from 'express';
import validator from 'validator'

@pre<UserSchema>('save', function (next) {
    return bcrypt.genSalt((saltError, salt) => {
        if (!this.isModified('password')) {
            return next();
        }
        if (saltError) {
            return next(saltError);
        }
        return bcrypt.hash(this.password, salt, (hashError, hash) => {
            if (hashError) {
                return next(hashError);
            }
            this.password = hash;
            return next();
        });
    });
})


export class UserSchema extends Typegoose {

    public _id: Schema.Types.ObjectId;

    @prop({
        required: true,
        minlength: 1,
        maxlength: 50
    })
    public firstName?: string;

    @prop({
        required: true,
        minlength: 1,
        maxlength: 50
    })
    public lastName?: string;

    @prop()
    public photoUrl?: string;

    @prop({
        validate: [
            {
                validator: email => validator.isEmail(email),
                message: `{VALUE} is not a valid email`
            }
        ],
        unique: true,
        required: true,
        maxlength: 100

    })
    public email!: string;

    @prop({
        required: true,
        minlength: 6,
        maxlength: 100
    })
    public password!: string;

    @prop()
    public token?: string;

    @prop({
        default: new Date().getTime()
    })
    public createdDate?: Date;

    @prop()
    public lastDateOfActive?: Date;

    @prop()
    public postsId?: [];

    @prop()
    public fullName?: string;




    /**
     * initSessions
     */
    @instanceMethod
    public initSession(req: any) {
        req.session.userId = this._id;
        req.session.firstName = this.firstName;
        req.session.lastName = this.lastName;
    }

    @instanceMethod
    public getIdentity(): IIdentity {
        const identity: IIdentity = {
            id: this._id.toString(),
            role: this._id ? ROLE.USER : ROLE.GUEST,
            firstName: this.firstName,
            lastName: this.lastName,
            updatedAt: Date.now(),
            token: this.token,
            photoUrl: this.photoUrl,
            email: this.email,
            createdDate: this.createdDate,
            lastDateOfActive: this.lastDateOfActive
        };

        return identity;
    }

    @instanceMethod
    public getGuestIdentity() {
        const identity: IIdentity = {
            id: null,
            role: ROLE.GUEST,
            firstName: 'unregistered',
            lastName: 'guest',
            token: null,
            updatedAt: null,
            photoUrl: null,
            email: null,
            createdDate: null
        };

        return identity;
    }

}

export type User = mongoose.Model<InstanceType<UserSchema>, {}> & UserSchema;
const UserModel = new UserSchema().getModelForClass(UserSchema, {
    schemaOptions: {
        collection: 'users',
    },
});

export default UserModel;
