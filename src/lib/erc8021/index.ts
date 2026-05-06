export const BUILDER_CODE = "bc_3ecvuvrh";
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";

export function getTransactionAttributionCode() {
  return `${ATTRIBUTION_CODE}:${BUILDER_CODE}`;
}

/**
 * Mocks injecting the ERC-8021 tracking code into transaction calldata.
 */
export function buildAttributedTransaction(baseData: `0x${string}`): `0x${string}` {
  // Normally this would append or properly encode the attribution
  return baseData;
}
