import FingerprintJS from '@fingerprintjs/fingerprintjs'
import md5 from 'js-md5'

async function getDeviceId() {
  const cachedDeviceId = localStorage.getItem('DeviceId')
  if (cachedDeviceId)
    return cachedDeviceId

  const fp = await FingerprintJS.load()
  const { visitorId } = await fp.get()
  const encodedDeviceId = md5(window.btoa(visitorId + window.location.host))
  localStorage.setItem('DeviceId', encodedDeviceId)
  return encodedDeviceId
}
export { getDeviceId }
