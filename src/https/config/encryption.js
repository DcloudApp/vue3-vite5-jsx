import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
import JSEncrypt from 'jsencrypt'

// RSA 公钥（建议存在环境变量中）
const PUBLIC_KEY = import.meta.env.VITE_HTTP_PUBLIC_KEY

// 生成 AES 随机密钥
function generateRandomStr(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// AES 加密
function aesEncrypt(keyStr, text) {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

// RSA 加密 AES 密钥
function rsaEncrypt(data, publicKey) {
  if (typeof window !== 'undefined') {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    return encryptor.encrypt(data)
  }
  return null
}

// 生成签名
function generateSign(aesData, aesKey, timestamp) {
  const baseStr = `biz_content=${aesData}&check=${aesKey}&ts=${timestamp}`
  const sha1Hash = CryptoJS.SHA1(baseStr).toString()
  return CryptoJS.MD5(sha1Hash).toString().toUpperCase()
}

// 主加密函数
export function encryption(formData) {
  const device = Cookies.get('Device-Type') || Cookies.get('device_type') || 'web'
  const versionStr = Cookies.get('Version-Code') || Cookies.get('version_code') || '0'
  const version = Number.parseInt(versionStr, 10)

  const isSupported = (device === 'ios' && version > 123) || (device === 'android' && version > 10) || device === 'web'

  if (!isSupported) {
    return formData
  }

  const randomKey = generateRandomStr()
  const timestamp = Date.now()
  const aesData = aesEncrypt(randomKey, JSON.stringify(formData))
  const signature = generateSign(aesData, randomKey, timestamp)
  const encryptedKey = rsaEncrypt(randomKey, PUBLIC_KEY)

  return {
    ts: timestamp,
    biz_content: aesData,
    sign: signature,
    check: encryptedKey,
  }
}
