/** Letters and digits only; normalized to upper case for the API. */
export function normalizeTerritoryCode(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

export function isValidTerritoryCode(code: string): boolean {
  return code.length > 0 && /^[A-Z0-9]+$/.test(code)
}
