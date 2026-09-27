import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'

export async function scryptHash(password, cost) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex')
    scrypt(password, salt, 64, { N: cost }, (err, derivedKey) => {
      if (err) {
        throw err
        reject(null)
      }
      const hash = derivedKey.toString('hex')
      resolve(`V2:${salt}:${cost}:${hash}`)
    })
  })
}

export async function scryptCompare(password, hash) {
  return new Promise((resolve, reject) => {
    const [version, salt, cost, key] = hash.split(':')
    scrypt(password, salt, 64, { N: parseInt(cost) }, (err, derivedKey) => {
      if (err) {
        throw err
        reject(null)
      }
      resolve(timingSafeEqual(Buffer.from(key, 'hex'), derivedKey))
    })
  })
}

export function isScryptPassword(hash) {
  return hash.indexOf('V2:') === 0
}
