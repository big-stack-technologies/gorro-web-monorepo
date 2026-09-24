import { get } from "@gorro/api/client"

export type MarketingCsvFile = {
  filename: string
  contentBase64: string
  mimeType: string
}

function parseContentDispositionFilename(
  header: string | undefined
): string | null {
  if (!header) return null
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim())
    } catch {
      return utf8Match[1].trim()
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header)
  if (quoted?.[1]) return quoted[1]
  const plain = /filename=([^;]+)/i.exec(header)
  return plain?.[1]?.trim() ?? null
}

export async function fetchMarketingCsv(
  url: string,
  params?: Record<string, string>
): Promise<MarketingCsvFile> {
  const response = await get<ArrayBuffer>(url, {
    params,
    responseType: "arraybuffer",
  })

  const raw =
    response.data instanceof ArrayBuffer
      ? Buffer.from(response.data)
      : Buffer.from(response.data as unknown as ArrayBuffer)

  const disposition = response.headers["content-disposition"] as
    | string
    | undefined
  const filename =
    parseContentDispositionFilename(disposition) ?? "export.csv"

  return {
    filename,
    contentBase64: raw.toString("base64"),
    mimeType:
      (response.headers["content-type"] as string | undefined) ??
      "text/csv;charset=utf-8",
  }
}
