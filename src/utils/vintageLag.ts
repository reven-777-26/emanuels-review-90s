/**
 * Authentic late-90s connection latency simulator (1998 dial-up experience).
 *
 * Randomly samples:
 * - Tier 1 (~35%): ~1.0 second (900ms - 1200ms) - ISDN / Fast line
 * - Tier 2 (~45%): ~2.5 - 3.0 seconds (2500ms - 3000ms) - Standard 56K V.90 modem
 * - Tier 3 (~20%): ~5.0 - 6.0 seconds (5000ms - 6000ms) - Congested 28.8K modem
 */
export function getVintageLatencyMs(): number {
  const roll = Math.random();
  if (roll < 0.35) {
    // ~1.0s (900 - 1200ms)
    return 900 + Math.floor(Math.random() * 300);
  } else if (roll < 0.80) {
    // 2.5 - 3.0s (2500 - 3000ms)
    return 2500 + Math.floor(Math.random() * 500);
  } else {
    // 5.0 - 6.0s (5000 - 6000ms)
    return 5000 + Math.floor(Math.random() * 1000);
  }
}

export function simulateVintageLag(customMs?: number): Promise<number> {
  const delay = customMs ?? getVintageLatencyMs();
  return new Promise((resolve) => setTimeout(() => resolve(delay), delay));
}
