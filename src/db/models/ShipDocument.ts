import { existsSync } from 'fs'
import {
    Cooldown as CoolDownAPI,
    Ship,
    ShipCargo,
    ShipCrew,
    ShipEngine,
    ShipFrame,
    ShipFuel,
    ShipModule,
    ShipMount,
    ShipNav,
    ShipReactor,
    ShipRegistration,
} from '../../../packages/spacetraders-sdk/models'
import { Db, connectToMongo } from '../dbDriver'
import { MongoDBDocument } from './MongoDBDocument'

const COLLECTION_NAME_FOR_SHIPS = 'ships'

type Cooldown = Omit<CoolDownAPI, 'expiration'> & {
    expiration?: number
}

export class ShipDocument extends MongoDBDocument implements Ship {
    symbol: string
    registration: ShipRegistration
    nav: ShipNav
    crew: ShipCrew
    frame: ShipFrame
    reactor: ShipReactor
    engine: ShipEngine
    modules: ShipModule[]
    mounts: ShipMount[]
    cargo: ShipCargo
    fuel: ShipFuel
    cooldown?: Cooldown

    constructor(ship: ShipDocument) {
        super(ship.symbol)

        // ship
        this.symbol = ship.symbol
        this.registration = ship.registration
        this.nav = ship.nav
        this.crew = ship.crew
        this.frame = ship.frame
        this.reactor = ship.reactor
        this.engine = ship.engine
        this.modules = ship.modules
        this.mounts = ship.mounts
        this.cargo = ship.cargo
        this.fuel = ship.fuel
        this.cooldown = ship.cooldown
    }

    getAssociatedCollectionName(): string {
        return COLLECTION_NAME_FOR_SHIPS
    }

    findAll = async (): Promise<ShipDocument[]> => {
        const dbClient: Db = await connectToMongo()
        return (await dbClient
            .collection(this.getAssociatedCollectionName())
            .find({}, { promoteValues: false })
            .toArray()) as ShipDocument[]
    }
}
