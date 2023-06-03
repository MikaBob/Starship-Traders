import {
    Market,
    ShipMount,
    ShipMountSymbolEnum,
    ShipNavStatus,
    Shipyard,
    Waypoint,
    WaypointTrait,
    WaypointTraitSymbolEnum,
} from '../packages/spacetraders-sdk/models'
import {
    createChart,
    dockShip,
    getMarket,
    getShipyard,
    getWaypoint,
    orbitShip,
    scanWaypoints,
} from './api'
import { fromISODateToTimestamp } from './db/models/MongoDBDocument'
import { ShipDocument } from './db/models/ShipDocument'
import { WaypointDocument } from './db/models/WaypointDocument'

export class SpaceShip extends ShipDocument {
    constructor(ship: ShipDocument) {
        super(ship)
    }

    collectSystemInformation = async () => {
        if (this.hasScannerDevice() === undefined || this.hasCoolDown()) return
        console.log(`${this._id} scan for current system ${this.nav.systemSymbol}`)

        if (this.nav.status === ShipNavStatus.Docked) {
            this.nav = await orbitShip(this.symbol)
        }
        if (this.nav.status === ShipNavStatus.InOrbit) {
            const { cooldown, waypoints } = await scanWaypoints(this.symbol)
            this.cooldown = { ...cooldown, expiration: fromISODateToTimestamp(cooldown.expiration) }
            console.log(this.cooldown)
            waypoints.map(async (waypoint: Waypoint) => {
                const waypointDoc = new WaypointDocument(waypoint)
                await waypointDoc.upsert()
            })
            console.log(`Ship ${this.symbol} scanned ${waypoints.length} waypoints.`)
        }
        this.upsert()
    }

    collectCurrentWaypointInformation = async () => {
        if (this.hasScannerDevice() === undefined || this.hasCoolDown()) return
        console.log(`${this._id} scan for current waypoint ${this.nav.waypointSymbol}`)
        if (this.nav.status === ShipNavStatus.InOrbit) {
            this.nav = await dockShip(this.symbol)
        }
        if (this.nav.status === ShipNavStatus.Docked) {
            let shipWaypoint: Waypoint = await getWaypoint(
                this.nav.systemSymbol,
                this.nav.waypointSymbol,
            )
            let market: Market | undefined
            let shipyard: Shipyard | undefined

            console.log(
                `Ship ${this.symbol} is at ${shipWaypoint.systemSymbol} : ${shipWaypoint.symbol}`,
            )

            // gather waypoint info
            const promises = shipWaypoint.traits.map(async (waypointTrait: WaypointTrait) => {
                if (waypointTrait.symbol === WaypointTraitSymbolEnum.Marketplace) {
                    market = await getMarket(this.nav.systemSymbol, this.nav.waypointSymbol)
                } else if (waypointTrait.symbol === WaypointTraitSymbolEnum.Shipyard) {
                    shipyard = await getShipyard(this.nav.systemSymbol, this.nav.waypointSymbol)
                } else if (waypointTrait.symbol === WaypointTraitSymbolEnum.Uncharted) {
                    const { waypoint } = await createChart(this.symbol)
                    shipWaypoint = waypoint
                    console.log('New chart Created !')
                }
            })

            // upsert in DB
            await Promise.allSettled(promises).then(async () => {
                const waypointDoc = new WaypointDocument(shipWaypoint, market, shipyard)
                console.log(`Ship ${this.symbol} is refreshing waypoint ${waypointDoc._id} infos`)
                await waypointDoc.upsert()
            })
        }
        this.upsert()
    }

    hasSurveyDevice = (): ShipMount | undefined => {
        const device: ShipMount | undefined = this.mounts.find(
            shipMount =>
                [
                    ShipMountSymbolEnum.SurveyorIii.toString(),
                    ShipMountSymbolEnum.SurveyorIi.toString(),
                    ShipMountSymbolEnum.SurveyorI.toString(),
                ].indexOf(shipMount.symbol) > 0,
        )
        console.log(`${this._id} do${device !== undefined ? 'es' : 'es NOT'} have a survey module`)
        return device
    }
    hasScannerDevice = (): ShipMount | undefined => {
        const device: ShipMount | undefined = this.mounts.find(
            shipMount =>
                [
                    ShipMountSymbolEnum.SensorArrayIii.toString(),
                    ShipMountSymbolEnum.SensorArrayIi.toString(),
                    ShipMountSymbolEnum.SensorArrayI.toString(),
                ].indexOf(shipMount.symbol) > 0,
        )
        console.log(`${this._id} do${device !== undefined ? 'es' : 'es NOT'} have a sensor module`)
        return device
    }
    hasMinningDevice = (): ShipMount | undefined => {
        const device: ShipMount | undefined = this.mounts.find(
            shipMount =>
                [
                    ShipMountSymbolEnum.MiningLaserIii.toString(),
                    ShipMountSymbolEnum.MiningLaserIi.toString(),
                    ShipMountSymbolEnum.MiningLaserI.toString(),
                ].indexOf(shipMount.symbol) > 0,
        )
        console.log(`${this._id} do${device !== undefined ? 'es' : 'es NOT'} have a minning module`)
        return device
    }
    hasCoolDown = (): boolean => {
        if (this.cooldown !== undefined) {
            if (
                this.cooldown.expiration !== undefined &&
                this.cooldown.expiration - new Date().getTime() > 0
            ) {
                console.log(`${this._id} must cool down`)
                return true
            }
            this.cooldown = undefined
            this.upsert()
        }
        return false
    }
}
