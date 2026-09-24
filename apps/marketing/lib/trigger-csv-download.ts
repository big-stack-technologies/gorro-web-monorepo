import type { MarketingCsvFile } from "@/lib/fetch-marketing-csv"

/** Trigger a browser download from a server-fetched CSV payload. */
export function triggerCsvDownload(file: MarketingCsvFile): void {
  const binary = atob(file.contentBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: file.mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = file.filename
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
