import { Market, Ship, ShipNavStatus, Shipyard, Waypoint, WaypointTrait, WaypointTraitSymbolEnum } from '../packages/spacetraders-sdk/models'
import { getMyShips, getMarket, getWaypoint, getShipyard, createChart, scanWaypoints, orbitShip, dockShip } from './api'
import { Db, connectToMongo, disconnectFromMongo } from './db/dbDriver'
import { WaypointDocument } from './db/models/WaypointDocument'

export const main = async () => {
    const myShips: Ship[] = await getMyShips(1, 20)

    myShips.map(async (ship: Ship) => {
        shipCollectCurrentWaypointInformation(ship)
        shipCollectSystemInformation(ship)
    })
}

const shipCollectSystemInformation = async (ship: Ship) => {
    if (ship.nav.status === ShipNavStatus.Docked) {
        ship.nav = await orbitShip(ship.symbol)
    }
    if (ship.nav.status === ShipNavStatus.InOrbit) {
        const { cooldown, waypoints } = await scanWaypoints(ship.symbol)
        console.log(cooldown)
        console.log(waypoints)
    }
}

const shipCollectCurrentWaypointInformation = async (ship: Ship) => {
    if (ship.nav.status === ShipNavStatus.InOrbit) {
        ship.nav = await dockShip(ship.symbol)
    }
    if (ship.nav.status === ShipNavStatus.Docked) {
        let shipWaypoint: Waypoint = await getWaypoint(ship.nav.systemSymbol, ship.nav.waypointSymbol)
        let market: Market | undefined
        let shipyard: Shipyard | undefined

        console.log(`Ship ${ship.symbol} is at ${shipWaypoint.systemSymbol} : ${shipWaypoint.symbol}`)

        const promises = shipWaypoint.traits.map(async (waypointTrait: WaypointTrait) => {
            if (waypointTrait.symbol === WaypointTraitSymbolEnum.Marketplace) {
                market = await getMarket(ship.nav.systemSymbol, ship.nav.waypointSymbol)
            } else if (waypointTrait.symbol === WaypointTraitSymbolEnum.Shipyard) {
                shipyard = await getShipyard(ship.nav.systemSymbol, ship.nav.waypointSymbol)
            } else if (waypointTrait.symbol === WaypointTraitSymbolEnum.Uncharted) {
                const { waypoint } = await createChart(ship.symbol)
                shipWaypoint = waypoint
                console.log('New chart Created !')
            }
        })

        await Promise.allSettled(promises).then(async () => {
            const waypointDoc = new WaypointDocument(shipWaypoint, market, shipyard)
            console.log(`Ship ${ship.symbol} is refreshing waypoint ${waypointDoc._id} infos`)
            const dbClient: Db = await connectToMongo()
            waypointDoc.upsert(dbClient)
            await disconnectFromMongo()
        })
    }
}

export default main
