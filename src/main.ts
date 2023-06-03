import { SpaceShip } from './spaceShip'
import { getMyShips } from './api'
import { ShipDocument } from './db/models/ShipDocument'
import { Ship } from '../packages/spacetraders-sdk/models/ship'

export const main = async () => {
    await syncDataBase()
    const ships: ShipDocument[] = await new ShipDocument({} as ShipDocument).findAll()
    console.log(`Amount of ships: ${ships.length}`)

    ships.map(async (ship: ShipDocument) => {
        const spaceShip = new SpaceShip(ship)
        console.log(`Start routine for ${spaceShip.registration.name}`)
        await spaceShip.collectCurrentWaypointInformation()
        await spaceShip.collectSystemInformation()
    })
}

export const syncDataBase = async () => {
    const myShips: Ship[] = (await getMyShips(1, 20)) as Ship[]
    await Promise.allSettled(
        myShips.map(async (ship: Ship) => {
            const spaceShip: SpaceShip = new SpaceShip(ship as ShipDocument)
            await spaceShip.upsert()
        }),
    )
}

export default main
