/**
 * Difficulty tiers for the Subnet Drill practice module.
 */
export type DifficultyTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface TierConfig {
  id: DifficultyTier;
  label: string;
  description: string;
  prefixRange: readonly number[];
  color: string;
}

/**
 * Result of computing all 6 core subnet parameters for an IPv4 address and CIDR prefix.
 */
export interface SubnetCalculationResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkId: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  /**
   * Diagnostic pedagogical metadata for visual breakdowns
   */
  breakdown: {
    significantOctet: number; // 1-indexed (1, 2, 3, or 4)
    borrowedBits: number;     // 0 to 8
    blockSize: number;        // e.g. 1, 2, 4, 8, 16, 32, 64, 128, 256
    isRFC3021: boolean;       // true for /31
    isHostRoute: boolean;     // true for /32
  };
}

/**
 * Binary breakdown representation for 32-bit ruler visualization.
 */
export interface BinarySlices {
  networkBits: string; // Network prefix bits
  subnetBits: string;  // Borrowed subnet bits (if applicable)
  hostBits: string;    // Host portion bits
}
