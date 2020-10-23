// DAQ1300_0 & DAQ1301

import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from 'phidget22'
import { StrategyConfig, Device, DigitalInput } from '../types'

export const createCreateDigitalInput: Device<
  StrategyConfig,
  DigitalInput.Type
> = (host, client, iotes) => async (device) => {
  const { type, name, channel } = device
  const {
    hostDispatch, hostSubscribe, deviceDispatch, deviceSubscribe,
  } = iotes

  const phidgetChannel = new phidget22.DigitalInput()

  phidgetChannel.setHubPort(Number(channel))

  // Dispatch to app from phidget
  phidgetChannel.onStateChange = (
    value: boolean,
  ) => {
    deviceDispatch(
      createDeviceDispatchable(
        name,
        'VALUE_CHANGE',
        {
          value,
        },
        host.config,
        'PHIDGET22_DIGITAL_INPUT',
      ),
    )
  }

  // Open Channel
  await phidgetChannel
    .open(5000)
    .then(() => phidgetChannel.setEnabled(true))
    .then(() => {
      hostDispatch(
        createHostDispatchable(
          host.config.name,
          'DEVICE_CONNECT',
          { deviceName: name, channel: `${channel}` },
          host.config,
          'PHIDGET22_DIGITAL_INPUT',
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
          'PHIDGET22_DIGITAL_INPUT',
          { message: JSON.stringify(err), level: 'WARN' },
        ),
      )
    })

  return device
}
