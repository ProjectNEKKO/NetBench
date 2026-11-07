import type { DifficultyTier, TierConfig } from '@/shared/lib/ip-types'
import { calculateSubnet } from '@/shared/lib/ip-utils'

export const DIFFICULTY_TIERS: Record<DifficultyTier, TierConfig> = {
  tier1: {
    id: 'tier1',
    label: 'Tier 1: Byte-Aligned',
    description: 'Foundational class boundaries (/8, /16, /24).',
    prefixRange: [8, 16, 24],
    color: 'emerald',
  },
  tier2: {
    id: 'tier2',
    label: 'Tier 2: Class C Slices',
    description: 'Subnetting in the 4th octet (/25 to /30).',
    prefixRange: [25, 26, 27, 28, 29, 30],
    color: 'cyan',
  },
  tier3: {
    id: 'tier3',
    label: 'Tier 3: Class B Cross-Octet',
    description: 'Subnetting across 3rd and 4th octets (/17 to /23).',
    prefixRange: [17, 18, 19, 20, 21, 22, 23],
    color: 'amber',
  },
  tier4: {
    id: 'tier4',
    label: 'Tier 4: Enterprise & Edge',
    description: 'Wide supernets (/9 to /15) and point-to-point (/31, /32).',
    prefixRange: [9, 10, 11, 12, 13, 14, 15, 31, 32],
    color: 'rose',
  },
}

/**
 * Problem interface for drill sessions.
 */
export interface DrillProblem {
  id: string;
  ip: string;
  cidr: number;
  tier: DifficultyTier;
  expected: ReturnType<typeof calculateSubnet>;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates an IP and CIDR problem tailored to the selected tier.
 */
export function generateProblem(tier: DifficultyTier): DrillProblem {
  const config = DIFFICULTY_TIERS[tier]
  const cidr = config.prefixRange[getRandomInt(0, config.prefixRange.length - 1)]

  let octet1: number
  let octet2: number
  let octet3: number
  let octet4: number

  switch (tier) {
    case 'tier1':
      // Byte-aligned problems
      octet1 = getRandomInt(10, 220)
      octet2 = getRandomInt(1, 254)
      octet3 = getRandomInt(1, 254)
      octet4 = getRandomInt(1, 254)
      break

    case 'tier2':
      // Class C ranges: 192.168.x.x or 10.x.x.x
      octet1 = Math.random() > 0.5 ? 192 : 10
      octet2 = octet1 === 192 ? 168 : getRandomInt(1, 254)
      octet3 = getRandomInt(1, 254)
      octet4 = getRandomInt(1, 254)
      break

    case 'tier3':
      // Class B ranges: 172.16-31.x.x or 10.x.x.x
      octet1 = Math.random() > 0.5 ? 172 : 10
      octet2 = octet1 === 172 ? getRandomInt(16, 31) : getRandomInt(1, 254)
      octet3 = getRandomInt(1, 254)
      octet4 = getRandomInt(1, 254)
      break

    case 'tier4':
      // Wide supernets or edge cases
      octet1 = getRandomInt(10, 192)
      octet2 = getRandomInt(1, 254)
      octet3 = getRandomInt(1, 254)
      octet4 = getRandomInt(1, 254)
      break
  }

  const ip = `${octet1}.${octet2}.${octet3}.${octet4}`
  const expected = calculateSubnet(ip, cidr)

  return {
    id: `${ip}/${cidr}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ip,
    cidr,
    tier,
    expected,
  }
}
