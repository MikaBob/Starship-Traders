import { Market, Ship, ShipNavStatus, Shipyard, Waypoint } from '../packages/spacetraders-sdk/models'
import { getMyShips, getMarket, getWaypoint, getShipyard } from './api'
import { WaypointDocument } from './db/models/WaypointDocument'

const main = async () => {
    const myShips: Ship[] = await getMyShips(1, 20)

    myShips.map(async (ship: Ship) => {
        if (ship.nav.status !== ShipNavStatus.InTransit) {
            const market: Market = await getMarket(ship.nav.systemSymbol, ship.nav.waypointSymbol)
            const shipyard: Shipyard = await getShipyard(ship.nav.systemSymbol, ship.nav.waypointSymbol)
            const waypoint: Waypoint = await getWaypoint(ship.nav.systemSymbol, ship.nav.waypointSymbol)

            console.log(`Ship ${ship.symbol} is at ${waypoint.systemSymbol} : ${waypoint.symbol}`)

            const waypointDoc = new WaypointDocument(waypoint, market, shipyard)

            console.log(`Refreshing waypoint ${waypointDoc._id}`)
            waypointDoc.upsert()
        }
    })
}

export default main
