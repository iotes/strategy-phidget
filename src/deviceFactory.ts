import {
  DeviceFactory, HostConfig, Iotes, ClientConfig,
} from '@iotes/core'
import { createCreateRfidReader, createCreateRotaryEncoder, createCreateInterfaceKit } from './devices'
import { DeviceTypes, StrategyConfig } from './types'

export const createDeviceFactory = (
  host: { config: HostConfig<StrategyConfig>; connection: any },
  client: ClientConfig,
  iotes: Iotes,
): DeviceFactory<DeviceTypes> => {
  // RFID READER
  const createRfidReader = createCreateRfidReader(host, client, iotes)

  // ROTARY ENCODER
  const createRotaryEncoder = createCreateRotaryEncoder(host, client, iotes)

  // INTERFACE KIT
  const createInterfaceKit = createCreateInterfaceKit(host, client, iotes)

  return {
    RFID_READER: createRfidReader,
    ROTARY_ENCODER: createRotaryEncoder,
    INTERFACE_KIT: createInterfaceKit,
  }
}
