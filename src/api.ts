import env = require('dotenv')
import axios from 'axios'
import {
    Agent,
    AgentsApi,
    Chart,
    Configuration,
    Contract,
    ContractsApi,
    Cooldown,
    FleetApi,
    Market,
    Ship,
    ShipNav,
    Shipyard,
    System,
    SystemsApi,
    Waypoint,
} from 'spacetraders-sdk'

env.config()

const { SPACE_TRADERS_TOKEN, SPACE_TRADERS_API_ENDPOINT, SPACE_TRADERS_USERNAME } = process.env

type APITypes = {
    agents: AgentsApi
    contracts: ContractsApi
    fleet: FleetApi
    systems: SystemsApi
}

let API: APITypes

const init = () => {
    const instance = axios.create({})

    // retry logic for 429 rate-limit errors
    instance.interceptors.response.use(undefined, async error => {
        const apiError = error.response?.data?.error
        const { method, url, data } = error.response.config

        console.error(`API error ${method.toUpperCase()} ${url} ${data ?? ''}`, apiError)

        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after']

            await new Promise(resolve => {
                setTimeout(resolve, retryAfter * 1000)
            })

            return instance.request(error.config)
        }

        return { data: { data: undefined } }
    })

    if ((SPACE_TRADERS_TOKEN ?? '') === '')
        throw new Error('Invalid token provided: ' + SPACE_TRADERS_TOKEN)

    const configuration = new Configuration({
        basePath: SPACE_TRADERS_API_ENDPOINT ?? '',
        username: SPACE_TRADERS_USERNAME ?? '',
        accessToken: SPACE_TRADERS_TOKEN ?? '',
    })

    API = {
        agents: new AgentsApi(configuration, undefined, instance),
        contracts: new ContractsApi(configuration, undefined, instance),
        fleet: new FleetApi(configuration, undefined, instance),
        systems: new SystemsApi(configuration, undefined, instance),
    }
    console.log(`API initialized for account ${configuration.username}`)
}

const getMyAgent = async (): Promise<Agent> => {
    return (await API.agents.getMyAgent()).data.data
}

const getMyShips = async (page: number, limit: number): Promise<Ship[]> => {
    return (await API.fleet.getMyShips(page, limit)).data.data
}

const getSystems = async (): Promise<System[]> => {
    return (await API.systems.getSystems()).data.data
}

const getMarket = async (systemSymbol: string, waypointSymbol: string): Promise<Market> => {
    return (await API.systems.getMarket(systemSymbol, waypointSymbol)).data.data
}

const getShipyard = async (systemSymbol: string, waypointSymbol: string): Promise<Shipyard> => {
    return (await API.systems.getShipyard(systemSymbol, waypointSymbol)).data.data
}

const getWaypoint = async (systemSymbol: string, waypointSymbol: string): Promise<Waypoint> => {
    return (await API.systems.getWaypoint(systemSymbol, waypointSymbol)).data.data
}

const getContracts = async (page: number, limit: number): Promise<Contract[]> => {
    return (await API.contracts.getContracts(page, limit)).data.data
}

const createChart = async (shipSymbol: string): Promise<{ chart: Chart; waypoint: Waypoint }> => {
    return (await API.fleet.createChart(shipSymbol)).data.data
}

const acceptContract = async (
    contractId: string,
): Promise<{ agent: Agent; contract: Contract }> => {
    return (await API.contracts.acceptContract(contractId)).data.data
}

const scanWaypoints = async (
    shipSymbol: string,
): Promise<{ cooldown: Cooldown; waypoints: Waypoint[] }> => {
    return (await API.fleet.createShipWaypointScan(shipSymbol)).data.data
}

const orbitShip = async (shipSymbol: string): Promise<ShipNav> => {
    return (await API.fleet.orbitShip(shipSymbol)).data.data.nav
}

const dockShip = async (shipSymbol: string): Promise<ShipNav> => {
    return (await API.fleet.dockShip(shipSymbol)).data.data.nav
}

export {
    init,
    getMyAgent,
    orbitShip,
    dockShip,
    getMyShips,
    getSystems,
    getMarket,
    getWaypoint,
    getShipyard,
    getContracts,
    scanWaypoints,
    acceptContract,
    createChart,
}
