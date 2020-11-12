// Used & Tested on Interface Kits, REL1300_0 & REL1301

import { createDeviceDispatchable, createHostDispatchable } from '@iotes/core'
import phidget22 from '../phidget'
import { StrategyConfig, Device, DigitalOutput } from '../types'

export const createCreateDigitalOutput: Device<StrategyConfig, DigitalOutput.Type> = (
    host,
    client,
    iotes
) => async (device) => {
    const { name, channel, serialNumber, hubPort, hubPortDevice } = device
    const { hostDispatch, deviceSubscribe } = iotes

    const phidgetChannel = new phidget22.DigitalOutput()

    phidgetChannel.setDeviceSerialNumber(Number(serialNumber))
    phidgetChannel.setIsHubPortDevice(Boolean(hubPortDevice))
    phidgetChannel.setHubPort(Number(hubPort))
    phidgetChannel.setChannel(Number(channel))

    //TODO: Better Error Handling?
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
    .then(() => {
        hostDispatch(
        createHostDispatchable(
            host.config.name,
            'DEVICE_CONNECT',
            { deviceName: name, channel: `${channel}` },
            host.config,
            'DIGITAL_OUTPUT',
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
            'DIGITAL_OUTPUT',
            { message: JSON.stringify(err), level: 'WARN' },
        ),
        )
    })

    return device
}
