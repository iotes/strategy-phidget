import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from '../phidget'
import { StrategyConfig, Device, RfidReader } from '../types'

export const createCreateRotaryEncoder: Device<
  StrategyConfig,
  RfidReader.Type
> = (host, client, iotes) => async (device) => {
  const { type, name, channel } = device
  const {
    hostDispatch, hostSubscribe, deviceDispatch, deviceSubscribe,
  } = iotes

  const phidgetChannel = new phidget22.Encoder()

  phidgetChannel.setHubPort(Number(channel))

  // Dispatch to app from phidget
  phidgetChannel.onPositionChange = (
    positionDelta: number,
    timeDelta: number,
    isIndexTriggered: boolean,
  ) => {
    deviceDispatch(
      createDeviceDispatchable(
        name,
        'POSITION_CHANGE',
        {
          positionDelta,
          timeDelta,
          isIndexTriggered,
        },
        host.config,
        'PHIDGET22_ENCODER',
      ),
    )
  }

  // Open Channel
  await phidgetChannel
    .open(5000)
    .then(() => phidgetChannel.setEnabled(true))
    .then(() => phidgetChannel.setPositionChangeTrigger(1))
    .then(() => {
      hostDispatch(
        createHostDispatchable(
          host.config.name,
          'DEVICE_CONNECT',
          { deviceName: name, channel: `${channel}` },
          host.config,
          'PHIDGET22_ENCODER',
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
          'PHIDGET22_ENCODER',
          { message: JSON.stringify(err), level: 'WARN' },
        ),
      )
    })

  return device
}
