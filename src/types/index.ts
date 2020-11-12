import {
  HostConfig,
  DeviceConfig,
  Iotes,
  ClientConfig,
} from '@iotes/core'

export type DeviceTypes = 'RFID_READER' | 'ROTARY_ENCODER' | 'DIGITAL_INPUT' | 'DIGITAL_OUTPUT' | 'INTERFACE_KIT'
export type StrategyConfig = {}

interface GenericDevice {
  name: string
  type: string
}

type PhidgetDeviceConfig<DeviceTypes> = DeviceConfig<DeviceTypes> & {
    hubPort?: number
    serialNumber?: number
    hubPortDevice?: boolean
}

// Device
export type Device<StrategyConfig, DeviceType> = (
  host: { config: HostConfig<StrategyConfig>; connection: any },
  client: ClientConfig,
  iotes: Iotes,
) => (device: PhidgetDeviceConfig<DeviceType>) => Promise<PhidgetDeviceConfig<DeviceType>>

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

// DIGITAL INPUT

export namespace DigitalInput {
  export type Type = 'DIGITAL_INPUT'
  export type State = boolean
  export interface Device extends GenericDevice {
    type: Type
  }
}

// DIGITAL OUTPUT

export namespace DigitalOutput {
  export type Type = 'DIGITAL_OUTPUT'
  export type State = boolean
  export interface Device extends GenericDevice {
    type: Type
  }
}

// INTERFACE KIT

export namespace InterfaceKit {
  export type Type = 'INTERFACE_KIT'
  export type State = boolean
  export interface Device extends GenericDevice {
      type: Type
  }
}