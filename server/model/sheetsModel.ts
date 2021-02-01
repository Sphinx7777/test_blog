import { prop, Typegoose, pre, InstanceType, instanceMethod } from 'typegoose'
import mongoose, { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { IIdentity, ROLE } from '../config'
import { Request } from 'express';
import validator from 'validator'




export class SheetsSchema extends Typegoose {

    public _id: Schema.Types.ObjectId;

    @prop()
    public group?: any;

    @prop()
    public data?: any;

    @prop()
    public language?: any;

    @prop()
    public reference?: any;

    @prop()
    public email?: any;

    @prop()
    public phone?: any;

    @prop()
    public source?: any;

    @prop()
    public details?: any;

    @prop()
    public segment?: any;

    @prop()
    public HighNetWorth?: any;

    @prop()
    public memberRating?: any;

    @prop()
    public callEvery?: any;

    @prop()
    public comments1?: any;

    @prop()
    public comments2?: any;

    @prop()
    public comments3?: any;

    @prop()
    public comments4?: any;

    @prop()
    public emailsSent?: any;

    @prop()
    public opened?: any;

    @prop()
    public clicked?: any;

    @prop()
    public opened2020Q4?: any;

    @prop()
    public clickedInvest?: any;

    @prop()
    public clickedSell?: any;

    @prop()
    public searchType?: any;

    @prop()
    public comment2020?: any;

    @prop()
    public comment2019?: any;

    @prop()
    public dataId?: any;

    @prop()
    public name?: any;

    @prop()
    public price?: any;

    @prop()
    public year?: any;

    @prop()
    public calledAbout?: any;

    @prop()
    public agentID?: any;

    @prop()
    public allBaseDate?: any;

    @prop()
    public rowIndex?: number;

    @prop()
    public taskName?: any;

    @prop()
    public taskDescription?: any;

    @prop()
    public taskCreated?: any;

    @prop()
    public taskUpdate?: any;

    @prop()
    public taskCompleted?: any;

    @prop()
    public taskModifiedAt?: any;

    @prop()
    public taskCompletedAt?: any;

    @prop()
    public taskAssigneeStatus?: any;

    @prop()
    public allBrokersCoordinates?: any;

    @prop()
    public teamCoordinates?: any;

    @prop()
    public dataType?: any;
}



export type SheetsModelType = mongoose.Model<InstanceType<SheetsSchema>, {}> & SheetsSchema;
const SheetsModel = new SheetsSchema().getModelForClass(SheetsSchema, {
    schemaOptions: {
        collection: 'sheets',
    },
});

export default SheetsModel;
