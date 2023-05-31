import { Chart, Market, Shipyard, Waypoint, WaypointFaction, WaypointOrbital, WaypointTrait, WaypointType } from '../../../packages/spacetraders-sdk/models'
import { MongoDBDocument } from './MongoDBDocument'

const COLLECTION_NAME_FOR_WAYPOINTS = 'waypoints'

export class WaypointDocument extends MongoDBDocument implements Waypoint {
    type: WaypointType
    systemSymbol: string
    x: number
    y: number
    orbitals: WaypointOrbital[]
    faction?: WaypointFaction | undefined
    traits: WaypointTrait[]
    chart?: Chart | undefined
    symbol: string
    market?: Market
    shipyard?: Shipyard

    constructor(waypoint: Waypoint, market?: Market, shipyard?: Shipyard) {
        super(waypoint.symbol)

        // waypoint
        this.symbol = waypoint.symbol
        this.type = waypoint.type
        this.systemSymbol = waypoint.systemSymbol
        this.x = waypoint.x
        this.y = waypoint.y
        this.orbitals = waypoint.orbitals
        this.faction = waypoint.faction
        this.traits = waypoint.traits
        this.chart = waypoint.chart

        this.market = market
        this.shipyard = shipyard
    }

    getAssociatedCollectionName(): string {
        return COLLECTION_NAME_FOR_WAYPOINTS
    }
}
