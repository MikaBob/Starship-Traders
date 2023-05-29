type WaypointType = 'ASTEROID_FIELD' | 'DEBRIS_FIELD' | 'GAS_GIANT' | 'GRAVITY_WELL' | 'JUMP_GATE' | 'MOON' | 'NEBULA' | 'ORBITAL_STATION' | 'PLANET'
type ShipRoleType = 'CARRIER' | 'COMMAND' | 'EXCAVATOR' | 'EXPLORER' | 'FABRICATOR' | 'HARVESTER' | 'HAULER' | 'INTERCEPTOR' | 'PATROL' | 'REFINERY' | 'REPAIR' | 'SATELLITE' | 'SURVEYOR' | 'TRANSPORT'
type ShipFlightModeType = 'BURN' | 'CRUISE' | 'DRIFT' | 'STEALTH'
type ShipStatusType = 'DOCKED' | 'IN_ORBIT' | 'IN_TRANSIT'
type ShipCrewRotationType = 'RELAXED' | 'STRICT'
type ShipFrameType =
    | 'FRAME_CARRIER'
    | 'FRAME_CRUISER'
    | 'FRAME_DESTROYER'
    | 'FRAME_DRONE'
    | 'FRAME_EXPLORER'
    | 'FRAME_FIGHTER'
    | 'FRAME_FRIGATE'
    | 'FRAME_HEAVY_FREIGHTER'
    | 'FRAME_INTERCEPTOR'
    | 'FRAME_LIGHT_FREIGHTER'
    | 'FRAME_MINER'
    | 'FRAME_PROBE'
    | 'FRAME_RACER'
    | 'FRAME_SHUTTLE'
    | 'FRAME_TRANSPORT'
type ShipReactorType = 'REACTOR_ANTIMATTER_I' | 'REACTOR_CHEMICAL_I' | 'REACTOR_FISSION_I' | 'REACTOR_FUSION_I' | 'REACTOR_SOLAR_I'
type ShipEngineType = 'ENGINE_HYPER_DRIVE_I' | 'ENGINE_IMPULSE_DRIVE_I' | 'ENGINE_ION_DRIVE_I' | 'ENGINE_ION_DRIVE_II'
type ShipModuleType =
    | 'MODULE_CARGO_HOLD_I'
    | 'MODULE_CREW_QUARTERS_I'
    | 'MODULE_ENVOY_QUARTERS_I'
    | 'MODULE_FUEL_REFINERY_I'
    | 'MODULE_JUMP_DRIVE_I'
    | 'MODULE_JUMP_DRIVE_II'
    | 'MODULE_JUMP_DRIVE_III'
    | 'MODULE_MICRO_REFINERY_I'
    | 'MODULE_MINERAL_PROCESSOR_I'
    | 'MODULE_ORE_REFINERY_I'
    | 'MODULE_PASSENGER_CABIN_I'
    | 'MODULE_SCIENCE_LAB_I'
    | 'MODULE_SHIELD_GENERATOR_I'
    | 'MODULE_SHIELD_GENERATOR_II'
    | 'MODULE_WARP_DRIVE_I'
    | 'MODULE_WARP_DRIVE_II'
    | 'MODULE_WARP_DRIVE_III'

type ShipMountType =
    | 'MOUNT_GAS_SIPHON_I'
    | 'MOUNT_GAS_SIPHON_II'
    | 'MOUNT_GAS_SIPHON_III'
    | 'MOUNT_LASER_CANNON_I'
    | 'MOUNT_MINING_LASER_I'
    | 'MOUNT_MINING_LASER_II'
    | 'MOUNT_MINING_LASER_III'
    | 'MOUNT_MISSILE_LAUNCHER_I'
    | 'MOUNT_SENSOR_ARRAY_I'
    | 'MOUNT_SENSOR_ARRAY_II'
    | 'MOUNT_SENSOR_ARRAY_III'
    | 'MOUNT_SURVEYOR_I'
    | 'MOUNT_SURVEYOR_II'
    | 'MOUNT_SURVEYOR_III'
    | 'MOUNT_TURRET_I'
type DepositType =
    | 'ALUMINUM_ORE'
    | 'AMMONIA_ICE'
    | 'COPPER_ORE'
    | 'DIAMONDS'
    | 'GOLD_ORE'
    | 'ICE_WATER'
    | 'IRON_ORE'
    | 'MERITIUM_ORE'
    | 'PLATINUM_ORE'
    | 'PRECIOUS_STONES'
    | 'QUARTZ_SAND'
    | 'SILICON_CRYSTALS'
    | 'SILVER_ORE'
    | 'URANITE_ORE'
type ShipRequirementsType = {
    crew: number
    power: number
    slots: number
}
type ShipModsType = {
    description: string
    name: string
    requirements: ShipRequirementsType
    symbol: string
}
type ShipModulesType = ShipModsType & {
    capacity: number
    range: number
    symbol: ShipModuleType
}
type ShipMountsType = ShipModsType & {
    deposits: DepositType[]
    strength: number
    symbol: ShipMountType
}
type ShipPartsType = ShipModsType & {
    condition: number
}

type ShipPartsFrameType = ShipPartsType & {
    fuelCapacity: number
    moduleSlots: number
    mountingPoints: number
    symbol: ShipFrameType
}
type ShipPartsReactorType = ShipPartsType & {
    powerOutput: number
    symbol: ShipReactorType
}
type ShipPartsEngineType = ShipPartsType & {
    speed: number
    symbol: ShipEngineType
}

type ShipRegistrationType = {
    factionSymbol: string
    name: string
    role: ShipRoleType
}
type TrajectoryType = {
    symbol: string
    systemSymbol: string
    type: WaypointType
    x: number
    y: number
}
type ShipRouteType = {
    arrival: Date
    departure: TrajectoryType
    departureTime: Date
    destination: TrajectoryType
}
type ShipNavType = {
    flightMode: ShipFlightModeType
    route: ShipRouteType
    status: ShipStatusType
    systemSymbol: string
    waypointSymbol: string
}
type ShipCrewType = {
    capacity: number
    current: number
    morale: number
    required: number
    rotation: ShipCrewRotationType
    wages: number
}
type ShipCargoInventoryType = {
    description: string
    name: string
    symbol: string
    units: number
}
type ShipCargoType = {
    capacity: number
    inventory: ShipCargoInventoryType[]
    units: number
}
type ShipFuelType = {
    capacity: number
    consumed: {
        amount: number
        timestamp: Date
    }
    current: number
}

export type {
    DepositType,
    ShipCargoInventoryType,
    ShipCargoType,
    ShipCrewRotationType,
    ShipCrewType,
    ShipFlightModeType,
    ShipFrameType,
    ShipFuelType,
    ShipModulesType,
    ShipModuleType,
    ShipMountsType,
    ShipMountType,
    ShipNavType,
    ShipPartsEngineType,
    ShipPartsFrameType,
    ShipPartsReactorType,
    ShipReactorType,
    ShipRegistrationType,
    ShipRequirementsType,
    ShipRoleType,
    ShipStatusType,
    WaypointType,
}
