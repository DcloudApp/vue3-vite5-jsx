import Fingerprint2 from 'fingerprintjs2'
import md5 from 'js-md5'

async function getDeviceId() {
  const cachedDeviceId = localStorage.getItem('DeviceId')
  if (cachedDeviceId)
    return cachedDeviceId

  const components = await new Promise((resolve) => {
    Fingerprint2.get(resolve)
  })

  const values = components.map((component, index) =>
    index === 0 ? component.value.replace(/\bNetType\/\w+\b/, '') : component.value,
  )

  const DeviceId = Fingerprint2.x64hash128(values.join(''), 31)
  const encodedDeviceId = md5(window.btoa(DeviceId + window.location.host))
  localStorage.setItem('DeviceId', encodedDeviceId)
  return encodedDeviceId
}

export { getDeviceId }
