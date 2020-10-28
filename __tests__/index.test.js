// Note this is a manual itegration test which reuires a phidget to be attached and avaliable.
// It will print the output but will no provide ant test reports

const { createIotes } = require('@iotes/core')
const { phidgetStrategy } = require('@iotes/strategy-phidget')

const testTopologoy = {
  hosts: [{ name: 'testapp/0', host: '127.0.0.1', port: '5661' }],
  devices: [
    {
      hostName: 'testapp/0',
      type: 'ROTARY_ENCODER',
      name: 'ENCODER/1',
      channel: 2,
    },
  ],
}

const main = async () => {
  const iotes = createIotes({
    topology: testTopologoy,
    strategy: phidgetStrategy,
  })

  let deviceResult = null
  let prevDeviceResult = null
  let hostResult = null
  let prevHostResult = null

  iotes.deviceSubscribe((state) => {
    deviceResult = state
  })
  iotes.hostSubscribe((state) => {
    hostResult = state
  })

  setInterval(() => {
    if (deviceResult !== prevDeviceResult) {
      console.log(deviceResult)
      prevDeviceResult = deviceResult
    }
    if (hostResult !== prevHostResult) {
      console.log(hostResult)
      prevHostResult = hostResult
    }
  }, 250)
}

main()
