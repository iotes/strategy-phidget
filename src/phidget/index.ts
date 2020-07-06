declare let phidget22: any

// eslint-disable-next-line global-require
export default typeof phidget22 !== 'undefined' ? phidget22 : require('phidget22')
