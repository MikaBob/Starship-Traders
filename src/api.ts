import env = require('dotenv')
import axios from 'axios'
import { Agent, AgentsApi, Configuration, FleetApi, Ship, System, SystemsApi } from 'spacetraders-sdk'

env.config()

const { SPACE_TRADERS_TOKEN, SPACE_TRADERS_API_ENDPOINT, SPACE_TRADERS_USERNAME } = process.env

type APITypes = {
    agent: AgentsApi
    fleet: FleetApi
    system: SystemsApi
}

let API: APITypes

const init = () => {
    const instance = axios.create({})

    // retry logic for 429 rate-limit errors
    instance.interceptors.response.use(
        async response => {
            return response.data.data
        },
        async error => {
            const apiError = error.response?.data?.error

            console.error('API error', apiError)

            if (error.response?.status === 429) {
                const retryAfter = error.response.headers['retry-after']

                await new Promise(resolve => {
                    setTimeout(resolve, retryAfter * 1000)
                })

                return instance.request(error.config)
            }

            throw error
        },
    )

    if ((SPACE_TRADERS_TOKEN ?? '') === '') throw new Error('Invalid token provided: ' + SPACE_TRADERS_TOKEN)

    const configuration = new Configuration({
        basePath: SPACE_TRADERS_API_ENDPOINT ?? '',
        username: SPACE_TRADERS_USERNAME ?? '',
        accessToken: SPACE_TRADERS_TOKEN ?? '',
    })

    API = {
        agent: new AgentsApi(configuration, undefined, instance),
        fleet: new FleetApi(configuration, undefined, instance),
        system: new SystemsApi(configuration, undefined, instance),
    }
}

const getMyAgent = async (): Promise<Agent> => {
    return (await API.agent.getMyAgent()) as unknown as Agent
}

const getMyShips = async (page: number, limit: number): Promise<Ship[]> => {
    return (await API.fleet.getMyShips(page, limit)) as unknown as Ship[]
}

const getSystems = async (): Promise<System[]> => {
    return (await API.system.getSystems()) as unknown as System[]
}

export { init, getMyAgent, getMyShips, getSystems }
