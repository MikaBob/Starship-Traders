import { getMyAgent, getMyShips } from './api'

const main = async () => {
    console.log(await getMyAgent())
    console.log(await getMyShips(1, 20))
}

export default main
