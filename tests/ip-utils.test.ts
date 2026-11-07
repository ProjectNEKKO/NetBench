import { describe, expect, it } from 'vitest'
import {
  calculateSubnet,
  cidrToMaskUint32,
  cidrToWildcardUint32,
  ipToUint32,
  uint32ToBinaryString,
  uint32ToIp,
} from '../src/shared/lib/ip-utils'

describe('Pure uint32 bitwise IP utilities', () => {
  describe('ipToUint32 & uint32ToIp roundtrip', () => {
    it('converts standard IP addresses correctly', () => {
      expect(ipToUint32('0.0.0.0')).toBe(0)
      expect(ipToUint32('255.255.255.255')).toBe(0xffffffff >>> 0)
      expect(ipToUint32('192.168.1.1')).toBe(3232235777)
      expect(uint32ToIp(3232235777)).toBe('192.168.1.1')
      expect(uint32ToIp(0)).toBe('0.0.0.0')
      expect(uint32ToIp(0xffffffff)).toBe('255.255.255.255')
    })

    it('throws errors on malformed IP inputs', () => {
      expect(() => ipToUint32('192.168.1')).toThrow()
      expect(() => ipToUint32('192.168.1.300')).toThrow()
      expect(() => ipToUint32('192.168.1.-1')).toThrow()
      expect(() => ipToUint32('abc.def.ghi.jkl')).toThrow()
    })
  })

  describe('cidrToMaskUint32 & cidrToWildcardUint32', () => {
    it('calculates masks for key CIDRs correctly', () => {
      expect(uint32ToIp(cidrToMaskUint32(0))).toBe('0.0.0.0')
      expect(uint32ToIp(cidrToMaskUint32(8))).toBe('255.0.0.0')
      expect(uint32ToIp(cidrToMaskUint32(16))).toBe('255.255.0.0')
      expect(uint32ToIp(cidrToMaskUint32(24))).toBe('255.255.255.0')
      expect(uint32ToIp(cidrToMaskUint32(27))).toBe('255.255.255.224')
      expect(uint32ToIp(cidrToMaskUint32(30))).toBe('255.255.255.252')
      expect(uint32ToIp(cidrToMaskUint32(31))).toBe('255.255.255.254')
      expect(uint32ToIp(cidrToMaskUint32(32))).toBe('255.255.255.255')
    })

    it('calculates wildcard masks correctly', () => {
      expect(uint32ToIp(cidrToWildcardUint32(24))).toBe('0.0.0.255')
      expect(uint32ToIp(cidrToWildcardUint32(27))).toBe('0.0.0.31')
      expect(uint32ToIp(cidrToWildcardUint32(22))).toBe('0.0.3.255')
      expect(uint32ToIp(cidrToWildcardUint32(30))).toBe('0.0.0.3')
      expect(uint32ToIp(cidrToWildcardUint32(32))).toBe('0.0.0.0')
    })
  })

  describe('uint32ToBinaryString', () => {
    it('formats binary string with and without dot separators', () => {
      const ip = ipToUint32('192.168.1.1')
      expect(uint32ToBinaryString(ip, true)).toBe('11000000.10101000.00000001.00000001')
      expect(uint32ToBinaryString(ip, false)).toBe('11000000101010000000000100000001')
    })
  })

  describe('calculateSubnet - Core 6 parameters & edge cases', () => {
    it('accurately calculates a typical /24 network', () => {
      const res = calculateSubnet('192.168.1.155', 24)
      expect(res.subnetMask).toBe('255.255.255.0')
      expect(res.wildcardMask).toBe('0.0.0.255')
      expect(res.networkId).toBe('192.168.1.0')
      expect(res.broadcastAddress).toBe('192.168.1.255')
      expect(res.firstUsableHost).toBe('192.168.1.1')
      expect(res.lastUsableHost).toBe('192.168.1.254')
      expect(res.usableHosts).toBe(254)
      expect(res.totalHosts).toBe(256)
      expect(res.breakdown.significantOctet).toBe(3) // 24 / 8 = 3
      expect(res.breakdown.blockSize).toBe(1)
    })

    it('accurately calculates cross-octet /22 subnet', () => {
      // 172.16.45.197 /22
      // /22 mask: 255.255.252.0 (working octet = 3, block size = 4)
      // 45 / 4 = 11, 11 * 4 = 44 -> net: 172.16.44.0, bcast: 172.16.47.255
      const res = calculateSubnet('172.16.45.197', 22)
      expect(res.subnetMask).toBe('255.255.252.0')
      expect(res.wildcardMask).toBe('0.0.3.255')
      expect(res.networkId).toBe('172.16.44.0')
      expect(res.broadcastAddress).toBe('172.16.47.255')
      expect(res.firstUsableHost).toBe('172.16.44.1')
      expect(res.lastUsableHost).toBe('172.16.47.254')
      expect(res.usableHosts).toBe(1022)
      expect(res.breakdown.significantOctet).toBe(3)
      expect(res.breakdown.blockSize).toBe(4)
    })

    it('accurately calculates /27 subnet in 4th octet', () => {
      // 10.0.0.75 /27 -> block size 32 -> 75 belongs to 64-95 block
      const res = calculateSubnet('10.0.0.75', 27)
      expect(res.subnetMask).toBe('255.255.255.224')
      expect(res.wildcardMask).toBe('0.0.0.31')
      expect(res.networkId).toBe('10.0.0.64')
      expect(res.broadcastAddress).toBe('10.0.0.95')
      expect(res.firstUsableHost).toBe('10.0.0.65')
      expect(res.lastUsableHost).toBe('10.0.0.94')
      expect(res.usableHosts).toBe(30)
      expect(res.breakdown.significantOctet).toBe(4)
      expect(res.breakdown.blockSize).toBe(32)
    })

    it('handles RFC 3021 /31 point-to-point subnets (2 usable hosts)', () => {
      const res = calculateSubnet('10.0.0.1', 31)
      expect(res.subnetMask).toBe('255.255.255.254')
      expect(res.networkId).toBe('10.0.0.0')
      expect(res.broadcastAddress).toBe('10.0.0.1')
      expect(res.firstUsableHost).toBe('10.0.0.0')
      expect(res.lastUsableHost).toBe('10.0.0.1')
      expect(res.usableHosts).toBe(2)
      expect(res.breakdown.isRFC3021).toBe(true)
    })

    it('handles /32 host routes (1 usable host)', () => {
      const res = calculateSubnet('192.168.5.50', 32)
      expect(res.subnetMask).toBe('255.255.255.255')
      expect(res.networkId).toBe('192.168.5.50')
      expect(res.broadcastAddress).toBe('192.168.5.50')
      expect(res.firstUsableHost).toBe('192.168.5.50')
      expect(res.lastUsableHost).toBe('192.168.5.50')
      expect(res.usableHosts).toBe(1)
      expect(res.breakdown.isHostRoute).toBe(true)
    })
  })
})
