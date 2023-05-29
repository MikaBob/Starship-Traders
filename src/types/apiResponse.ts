import {
    ShipCargoType,
    ShipCrewType,
    ShipFuelType,
    ShipModulesType,
    ShipMountsType,
    ShipNavType,
    ShipPartsEngineType,
    ShipPartsFrameType,
    ShipPartsReactorType,
    ShipRegistrationType,
} from './shipTypes'

type GetMyShipResponseType = {
    cargo: ShipCargoType
    crew: ShipCrewType
    engine: ShipPartsEngineType
    frame: ShipPartsFrameType
    fuel: ShipFuelType
    modules: ShipModulesType[]
    mounts: ShipMountsType[]
    nav: ShipNavType
    reactor: ShipPartsReactorType
    registration: ShipRegistrationType
    symbol: string
}

type GetMyAgentResponseType = {
    accountId: string
    symbol: string
    headquarters: string
    credits: number
    startingFaction: string
}

export type { GetMyShipResponseType, GetMyAgentResponseType }
