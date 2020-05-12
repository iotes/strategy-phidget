import {
  HostConfig,
  DeviceConfig,
  Iotes,
  ClientConfig,
} from '@iotes/core'

export type DeviceTypes = 'RFID_READER' | 'ROTARY_ENCODER'
export type StrategyConfig = {}

interface GenericDevice {
  name: string
  type: string
}

// Device
export type Device<StrategyConfig, DeviceType> = (
  host: { config: HostConfig<StrategyConfig>; connection: any },
  client: ClientConfig,
  iotes: Iotes,
) => (device: DeviceConfig<DeviceType>) => Promise<DeviceConfig<DeviceType>>

// RFID READER

export namespace RfidReader {
  export type Type = 'RFID_READER'
  export type Tag = string
  export type Protocol = {
    EM4100: string
    ISO11785_FDX_B: string
    PHIDGET_TAG: string
  }
  export interface Device extends GenericDevice {
    type: Type
  }
}

// ROTARY ENCODER

export namespace RotaryEncoder {
  export type Type = 'ROTARY_ENCODER'
  export interface Device extends GenericDevice {
    type: Type
  }
}
