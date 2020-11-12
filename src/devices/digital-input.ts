// Used & Tested on Interface Kits, DAQ1300_0 & DAQ1301

import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from '../phidget'
import { StrategyConfig, Device, DigitalInput } from '../types'

export const createCreateDigitalInput: Device<StrategyConfig, DigitalInput.Type> = (
    host,
    client,
    iotes
) => async (device) => {
    const { name, channel, serialNumber, hubPort, hubPortDevice } = device
    const { hostDispatch, deviceDispatch } = iotes

    const phidgetChannel = await new phidget22.DigitalInput()

    phidgetChannel.setDeviceSerialNumber(Number(serialNumber))
    phidgetChannel.setIsHubPortDevice(Boolean(hubPortDevice))
    phidgetChannel.setHubPort(Number(hubPort))
    phidgetChannel.setChannel(Number(channel))

// Dispatch to app on Phidget state change
    phidgetChannel.onStateChange = (
    state: DigitalInput.State,
    ) => {
    deviceDispatch(
        createDeviceDispatchable(
        name,
        'STATE_CHANGE',
        { state },
        host.config,
        'DIGITAL_INPUT',
        ),
    )
    }

// Open Channel
    await phidgetChannel
    .open(5000)
    .then(() => {
        hostDispatch(
        createHostDispatchable(
            host.config.name,
            'DEVICE_CONNECT',
            { deviceName: name, channel: `${channel}` },
            host.config,
            'DIGITAL_INPUT',
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
            'DIGITAL_INPUT',
            { message: JSON.stringify(err), level: 'WARN' },
        ),
        )
    })

  return device
}