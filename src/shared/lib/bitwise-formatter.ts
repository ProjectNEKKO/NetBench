import type { BinarySlices } from './ip-types'
import { ipToUint32 } from './ip-utils'

/**
 * Splits an IPv4 address and CIDR prefix into binary slice representations:
 * - Network Bits: bits covered by the major network class or base boundary
 * - Subnet Bits: borrowed host bits beyond class boundary up to CIDR prefix
 * - Host Bits: remaining bits for hosts
 */
export function getBinarySlices(ip: string, cidr: number): BinarySlices {
  const ipUint = ipToUint32(ip)
  const fullBin = ipUint.toString(2).padStart(32, '0')

  // Standard classful base prefix boundary for educational reference
  const firstOctet = (ipUint >>> 24) & 0xff
  let baseClassPrefix = 24
  if (firstOctet < 128) {
    baseClassPrefix = 8  // Class A
  } else if (firstOctet < 192) {
    baseClassPrefix = 16 // Class B
  } else if (firstOctet < 224) {
    baseClassPrefix = 24 // Class C
  }

  // If CIDR is greater than base class, borrowed bits are (cidr - baseClassPrefix)
  let netLen = cidr
  let subLen = 0

  if (cidr >= baseClassPrefix) {
    netLen = baseClassPrefix
    subLen = cidr - baseClassPrefix
  }

  const networkBits = fullBin.slice(0, netLen)
  const subnetBits = fullBin.slice(netLen, netLen + subLen)
  const hostBits = fullBin.slice(cidr)

  return {
    networkBits,
    subnetBits,
    hostBits,
  }
}
