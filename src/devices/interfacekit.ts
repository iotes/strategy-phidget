import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from 'phidget22'
import { InterfaceKit, StrategyConfig, Device } from '../types'

export const createCreateInterfaceKit: Device<StrategyConfig, InterfaceKit.Type> = (
    host,
    client,
    iotes,
) => async (device) => {
    const { name, channel } = device
    const {
        hostDispatch, deviceDispatch,
    } = iotes

    const phidgetChannel = await new phidget22.DigitalInput()

    phidgetChannel.setChannel(channel)

    phidgetChannel.onStateChange = (
        state: InterfaceKit.State
    ) => {
        deviceDispatch(
            createDeviceDispatchable(
                name,
                'INPUT',
                { state },
                host.config,
                'PHIDGET22_INTERFACEKIT',
            ),
        )
    }

    phidgetChannel
        .open(5000)
        //.then(() => phidgetChannel.setEnabled(true))
        .then(() => {
            hostDispatch(
                createHostDispatchable(
                    host.config.name,
                    'DEVICE_CONNECT',
                    { deviceName: name, channel: `${channel}` },
                    host.config,
                    'PHIDGET22_INTERFACEKIT',
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
                    'PHIDGET22_INTERFACEKIT',
                    { message: JSON.stringify(err), level: 'WARN' },
                ),
            )
        })

    return device
}