import { Db, ObjectId, Document, UpdateResult } from 'mongodb'
import { connectToMongo } from '../dbDriver'

class MongoDBDocument implements Document {
    _id: ObjectId
    last_update: number

    constructor(id: number | string) {
        this._id = id as unknown as ObjectId
        this.last_update = new Date().getTime()
    }

    getAssociatedCollectionName(): string {
        throw 'A MongoDBDocument must override method getAssociatedCollectionName().'
    }

    upsert = async (): Promise<boolean> => {
        const dbClient: Db = await connectToMongo()
        const result: UpdateResult = await dbClient.collection(this.getAssociatedCollectionName()).updateOne({ _id: this._id }, { $set: removeUndefinedAndFunctions(this) }, { upsert: true })
        return (result.modifiedCount || result.upsertedCount) > 0
    }
}

const removeUndefinedAndFunctions = (obj: object) => {
    const newObj = {}
    Object.keys(obj).forEach(key => {
        /* @ts-ignore */
        if (obj[key] === Object(obj[key]) && typeof obj[key] !== 'function') {
            /* @ts-ignore */
            newObj[key] = removeUndefinedAndFunctions(obj[key])
            /* @ts-ignore */
        } else if (obj[key] !== undefined) {
            /* @ts-ignore */
            newObj[key] = obj[key]
        }
    })
    return newObj
}

const fromISODateToTimestamp = (isoDate?: string): number | null => {
    if (!isoDate) return null
    return new Date(isoDate).getTime()
}

export { fromISODateToTimestamp, MongoDBDocument, removeUndefinedAndFunctions }
