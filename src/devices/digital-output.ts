// REL1300_0 & REL1301

import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from 'phidget22'
import { StrategyConfig, Device, DigitalOutput } from '../types'

export const createCreateDigitalOutput: Device<
  StrategyConfig,
  DigitalOutput.Type
> = (host, client, iotes) => async (device) => {
  const { type, name, channel } = device
  const {
    hostDispatch, hostSubscribe, deviceDispatch, deviceSubscribe,
  } = iotes

  const phidgetChannel = new phidget22.DigitalOutput()

  phidgetChannel.setHubPort(Number(channel))

  deviceSubscribe(
    (state: any) => {
      if (state[name] && state[name]?.['@@iotes_storeId']) {
        const parsedPayload:number = parseInt(state[name]?.payload, 10)
        if (parsedPayload != null && !Number.isNaN(parsedPayload)) {
          phidgetChannel.setDutyCycle(parsedPayload)
        } else {
          console.warn('Phidget Digital Output requires an integer as a payload. EG createDeviceDispatchable(\'DEVICENAME\', \'UPDATE\', 1)')
        }
      }
    },
    [name],
  )

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
          'PHIDGET22_DIGITAL_OUTPUT',
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
          'PHIDGET22_DIGITAL_OUTPUT',
          { message: JSON.stringify(err), level: 'WARN' },
        ),
      )
    })

  return device
}
