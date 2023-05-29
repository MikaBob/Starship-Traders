import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { GetMyAgentResponseType, GetMyShipResponseType } from './types/apiResponse'

const API_ENDPOINT = 'https://api.spacetraders.io/v2'

const init = (token: string) => {
    axios.interceptors.request.use(config => {
        config.headers['Authorization'] = `Bearer ${token}`
        return config
    })
}

const getCall = (url: string, params?: any): unknown => {
    return axios.get(API_ENDPOINT + url, { params: params } as AxiosRequestConfig).then((resp: AxiosResponse) => {
        return resp.data.data
    })
}

const getMyAgent = (): Promise<GetMyAgentResponseType> => {
    return getCall('/my/agent') as Promise<GetMyAgentResponseType>
}

const getMyShips = (page: number, limit: number): Promise<GetMyShipResponseType[]> => {
    return getCall('/my/ships', { limit: limit, page: page }) as Promise<GetMyShipResponseType[]>
}

export type { GetMyAgentResponseType, GetMyShipResponseType }
export { init, getMyAgent, getMyShips }
