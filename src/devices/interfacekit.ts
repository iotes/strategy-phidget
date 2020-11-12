import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from '../phidget'
import { InterfaceKit, StrategyConfig, Device } from '../types'

export const createCreateInterfaceKit: Device<StrategyConfig, InterfaceKit.Type> = (
  host,
  client,
  iotes,
) => async (device) => {
    const { name, channel, serialNumber, hubPort, hubPortDevice } = device
  const {
    hostDispatch, deviceDispatch,
  } = iotes

  const phidgetChannel = await new phidget22.DigitalInput()

  phidgetChannel.setDeviceSerialNumber(serialNumber)
  phidgetChannel.setIsHubPortDevice(hubPortDevice)
  phidgetChannel.setHubPort(hubPort)
  phidgetChannel.setChannel(channel)

  phidgetChannel.onStateChange = (
    state: InterfaceKit.State,
  ) => {
    deviceDispatch(
      createDeviceDispatchable(
        name,
        'INPUT',
        { state },
        host.config,
        'INTERFACE_KIT',
      ),
    )
  }

  await phidgetChannel
    .open(5000)
    // .then(() => phidgetChannel.setEnabled(true))
    .then(() => {
      hostDispatch(
        createHostDispatchable(
          host.config.name,
          'DEVICE_CONNECT',
          { deviceName: name, channel: `${channel}` },
          host.config,
          'INTERFACE_KIT',
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
          'INTERFACE_KIT',
          { message: JSON.stringify(err), level: 'WARN' },
        ),
      )
    })

  return device
}
