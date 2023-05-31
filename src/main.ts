import { getMyAgent, getMyShips, getSystems } from './api'

const main = async () => {
    console.log(await getMyAgent())
    console.log(await getMyShips(1, 20))
    console.log(await getSystems())
}

export default main
