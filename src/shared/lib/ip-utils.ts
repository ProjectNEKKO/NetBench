import type { SubnetCalculationResult } from './ip-types'

/**
 * Parses a dotted-decimal IPv4 string (e.g. "192.168.1.1") into an unsigned 32-bit integer.
 * Always coerces to unsigned with >>> 0.
 */
export function ipToUint32(ip: string): number {
  const octets = ip.trim().split('.')
  if (octets.length !== 4) {
    throw new Error(`Invalid IPv4 address format: "${ip}"`)
  }

  let result = 0
  for (let i = 0; i < 4; i++) {
    const octet = Number(octets[i])
    if (isNaN(octet) || octet < 0 || octet > 255 || !Number.isInteger(octet)) {
      throw new Error(`Invalid octet "${octets[i]}" in IP "${ip}"`)
    }
    result = (result << 8) | octet
  }

  return result >>> 0
}

/**
 * Converts an unsigned 32-bit integer into a dotted-decimal IPv4 string.
 */
export function uint32ToIp(val: number): string {
  const u = val >>> 0
  return [
    (u >>> 24) & 0xff,
    (u >>> 16) & 0xff,
    (u >>> 8) & 0xff,
    u & 0xff,
  ].join('.')
}

/**
 * Generates the unsigned 32-bit subnet mask from a CIDR prefix (0-32).
 * For prefix 0, returns 0.
 * For prefix 32, returns 0xffffffff.
 */
export function cidrToMaskUint32(cidr: number): number {
  if (cidr < 0 || cidr > 32 || !Number.isInteger(cidr)) {
    throw new Error(`Invalid CIDR prefix: ${cidr}. Must be an integer between 0 and 32.`)
  }
  if (cidr === 0) return 0
  return ((0xffffffff << (32 - cidr)) >>> 0)
}

/**
 * Generates the unsigned 32-bit wildcard (inverse) mask from a CIDR prefix.
 */
export function cidrToWildcardUint32(cidr: number): number {
  const mask = cidrToMaskUint32(cidr)
  return (~mask) >>> 0
}

/**
 * Formats an unsigned 32-bit integer into a zero-padded 32-character binary string,
 * optionally grouped by 8-bit octets separated by dots.
 */
export function uint32ToBinaryString(val: number, withDots: boolean = true): string {
  const u = val >>> 0
  const bin = u.toString(2).padStart(32, '0')
  if (!withDots) return bin
  return `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24, 32)}`
}

/**
 * Pure uint32 bitwise calculation of all 6 core subnet parameters and diagnostic breakdown.
 * Correctly accounts for RFC 3021 (/31) and host routes (/32).
 */
export function calculateSubnet(ip: string, cidr: number): SubnetCalculationResult {
  const ipUint = ipToUint32(ip)
  const maskUint = cidrToMaskUint32(cidr)
  const wildcardUint = cidrToWildcardUint32(cidr)

  // Network ID is the bitwise AND of IP and Mask
  const networkUint = (ipUint & maskUint) >>> 0

  // Broadcast Address is the bitwise OR of Network ID and Wildcard Mask
  const broadcastUint = (networkUint | wildcardUint) >>> 0

  const totalHosts = Math.pow(2, 32 - cidr)
  const isRFC3021 = cidr === 31
  const isHostRoute = cidr === 32

  let usableHosts: number
  let firstUsableUint: number
  let lastUsableUint: number

  if (isHostRoute) {
    // /32: 1 usable host, the host IP itself
    usableHosts = 1
    firstUsableUint = ipUint
    lastUsableUint = ipUint
  } else if (isRFC3021) {
    // /31: RFC 3021 point-to-point links (both network & broadcast addresses are usable hosts)
    usableHosts = 2
    firstUsableUint = networkUint
    lastUsableUint = broadcastUint
  } else if (cidr === 0) {
    usableHosts = Math.max(0, totalHosts - 2)
    firstUsableUint = 1 >>> 0
    lastUsableUint = 0xfffffffe >>> 0
  } else {
    // Standard /1 to /30 subnets
    usableHosts = Math.max(0, totalHosts - 2)
    firstUsableUint = (networkUint + 1) >>> 0
    lastUsableUint = (broadcastUint - 1) >>> 0
  }

  // Diagnostic Pedagogical breakdown
  // Significant octet position: ceil(cidr / 8), clamped to 1-4 (for /0 default to 1)
  const significantOctet = cidr === 0 ? 1 : Math.min(4, Math.ceil(cidr / 8))
  const bitsInSigOctet = cidr === 0 ? 0 : cidr % 8 === 0 ? 8 : cidr % 8
  const borrowedBits = bitsInSigOctet === 8 ? 0 : bitsInSigOctet
  const hostBitsInSigOctet = 8 - bitsInSigOctet
  const blockSize = Math.pow(2, hostBitsInSigOctet)

  return {
    ip,
    cidr,
    subnetMask: uint32ToIp(maskUint),
    wildcardMask: uint32ToIp(wildcardUint),
    networkId: uint32ToIp(networkUint),
    broadcastAddress: uint32ToIp(broadcastUint),
    firstUsableHost: uint32ToIp(firstUsableUint),
    lastUsableHost: uint32ToIp(lastUsableUint),
    totalHosts,
    usableHosts,
    breakdown: {
      significantOctet,
      borrowedBits,
      blockSize,
      isRFC3021,
      isHostRoute,
    },
  }
}
