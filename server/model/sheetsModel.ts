import { prop, Typegoose, pre, InstanceType, instanceMethod } from 'typegoose'
import mongoose, { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { IIdentity, ROLE } from '../config'
import { Request } from 'express';
import validator from 'validator'




export class SheetsSchema extends Typegoose {

    public _id: Schema.Types.ObjectId;

    @prop()
    public collName?: string;

    @prop()
    public collData?: string;

    @prop()
    public tableData: {
        phone?: string,
        email?: string,
        groupe?: string,
        language?: string,
        reference?: string,
        details?: string
    }[]
    @prop()
    public tableData2: {
        phone?: string,
        email?: string,
        groupe?: string,
        language?: string,
        reference?: string,
        details?: string
    }[]
    @prop()
    public tableData3: {
        phone?: string,
        email?: string,
        groupe?: string,
        language?: string,
        reference?: string,
        details?: string
    }[]

}

export type User = mongoose.Model<InstanceType<SheetsSchema>, {}> & SheetsSchema;
const SheetsModel = new SheetsSchema().getModelForClass(SheetsSchema, {
    schemaOptions: {
        collection: 'sheets',
    },
});

export default SheetsModel;
