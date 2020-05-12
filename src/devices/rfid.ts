import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from 'phidget22'
import { RfidReader, StrategyConfig, Device } from '../types'

export const createCreateRfidReader: Device<StrategyConfig, RfidReader.Type> = (
  host,
  client,
  iotes,
) => async (device) => {
  const { name, channel } = device
  const {
    hostDispatch, deviceDispatch,
  } = iotes

  const phidgetChannel = await new phidget22.RFID()

  phidgetChannel.onTag = (
    tag: RfidReader.Tag,
    protocol: RfidReader.Protocol,
  ) => {
    deviceDispatch(
      createDeviceDispatchable(
        name,
        'TAG',
        { tag, protocol },
        host.config,
        'PHIDGET22_RFID',
      ),
    )
  }

  phidgetChannel.onLostTag = (
    tag: RfidReader.Tag,
    protocol: RfidReader.Protocol,
  ) => {
    deviceDispatch(
      createDeviceDispatchable(
        name,
        'LOST_TAG',
        { tag, protocol },
        host.config,
        'PHIDGET22_RFID',
      ),
    )
  }

  phidgetChannel.setHubPort(Number(channel))

  phidgetChannel
    .open(5000)
    .then(() => phidgetChannel.setEnabled(true))
    .then(() => {
      hostDispatch(
        createHostDispatchable(
          host.config.name,
          'DEVICE_CONNECT',
          { deviceName: name, channel: `${channel}` },
          host.config,
          'PHIDGET22_RFID',
        ),
      )
    })
    .catch((err: { message: string; errorCode: string }) => {
      hostDispatch(
        createHostDispatchable(
          host.config.name,
          'DEVICE_CONNECT',
          { deviceName: name, channel: `${channel}` },
          host.config,
          'PHIDGET22_RFID',
          { message: JSON.stringify(err), level: 'WARN' },
        ),
      )
    })

  return device
}
