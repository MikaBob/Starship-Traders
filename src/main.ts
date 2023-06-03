import { Ship } from '../packages/spacetraders-sdk/models'
import { SpaceShip } from './spaceShip'
import { getMyShips } from './api'

export const main = async () => {
    const myShips: Ship[] = await getMyShips(1, 20)
    myShips.map(async (ship: Ship) => {
        const spaceShip: SpaceShip = new SpaceShip(ship)
        await spaceShip.collectCurrentWaypointInformation()
        await spaceShip.collectSystemInformation()
    })
}

export default main
