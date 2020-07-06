import phidget22 from '@wethecurious/phidget22-bundle'
import {
  DeviceFactory,
  HostFactory,
  HostConfig,
  Strategy,
  Iotes,
  createHostDispatchable,
  ClientConfig,
} from '@iotes/core'
import { DeviceTypes, StrategyConfig } from './types'
import { createDeviceFactory } from './deviceFactory'

export const phidgetStrategy: Strategy<StrategyConfig, DeviceTypes> = ({
  hostDispatch,
  deviceDispatch,
  hostSubscribe,
  deviceSubscribe,
}: Iotes): HostFactory<StrategyConfig, DeviceTypes> => async (
  hostConfig: HostConfig<StrategyConfig>,
  clientConfig: ClientConfig,
): Promise<DeviceFactory<DeviceTypes>> => {
  const { name, host } = hostConfig

  let port = null
  try {
    port = Number(hostConfig.port)
  } catch {
    throw Error('Unable to cast port to number type')
  }

  const connection = new phidget22.Connection({
    hostname: host,
    port,
    onAuthenticationNeeded: () => {
      hostDispatch(
        createHostDispatchable(
          name,
          'CONNECT',
          {},
          hostConfig,
          'PHIDGET22_HOST',
          {
            message: 'Authentiction Needed',
            level: 'ERROR',
          },
        ),
      )
    },
    onConnect: () => {
      hostDispatch(
        createHostDispatchable(
          name,
          'CONNECT',
          {},
          hostConfig,
          'PHIDGET22_HOST',
        ),
      )
    },
    onDisconnect: () => {
      hostDispatch(
        createHostDispatchable(
          name,
          'DISCONNECT',
          {},
          hostConfig,
          'PHIDGET22_HOST',
        ),
      )
    },
    onError: (code: string, message: string) => {
      hostDispatch(
        createHostDispatchable(
          name,
          'CONNECT',
          {},
          hostConfig,
          'PHIDGET22_HOST',
          { message, code, level: 'WARN' },
        ),
      )
    },
  })

  await connection
    .connect()
    .catch((err: { message: string; errorCode: string }) => {
      hostDispatch(
        createHostDispatchable(
          name,
          'CONNECT',
          {},
          hostConfig,
          'PHIDGET22_HOST',
          { ...err, level: 'ERROR' },
        ),
      )
    })

  return createDeviceFactory({ config: hostConfig, connection }, clientConfig, {
    hostDispatch,
    hostSubscribe,
    deviceDispatch,
    deviceSubscribe,
  })
}

export const strategy = phidgetStrategy

export {
  DeviceTypes,
  StrategyConfig,
}
