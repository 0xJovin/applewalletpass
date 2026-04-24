import { createHash } from "crypto"
import forge from "node-forge"

/**
 * Configuration for Apple Wallet pass generation
 */
export interface AppleWalletConfig {
  /** Apple Pass Type Identifier (e.g., pass.com.yourcompany.businesscard) */
  passTypeIdentifier: string
  /** Apple Team Identifier (10-character string) */
  teamIdentifier: string
  /** Base64-encoded certificate and private key in PEM format */
  certificateBase64: string
  /** Password for the certificate (if encrypted) */
  certificatePassword: string
  /** Base64-encoded Apple WWDR (Worldwide Developer Relations) certificate */
  wwdrCertificateBase64: string
  /** Organization name to display on the pass */
  organizationName?: string
}

/**
 * Data for a business card pass
 */
export interface BusinessCardData {
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Email address */
  email: string
  /** Job title */
  title: string
  /** Company name */
  company?: string
  /** Phone number */
  phone?: string
  /** Website URL */
  website?: string
  /** LinkedIn profile (URL or username) */
  linkedin?: string
  /** Brand color in hex format (e.g., #156741) */
  brandColor: string
  /** Profile photo as base64 data URL */
  profilePhoto?: string
  /** Company logo as base64 data URL */
  companyLogo?: string
  /** Custom fields to add to the vCard */
  customFields?: Array<{ id: string; label: string; value: string }>
  /** QR code icon as base64 string (without data URL prefix) */
  qrCodeBase64?: string
  /** QR code mode: what the QR code should contain */
  qrCodeMode?: "vcard" | "linkedin" | "custom" | "leavegen"
  /** Custom link for QR code (when qrCodeMode is "custom") */
  customLink?: string
  /** LeaveGen form ID (when qrCodeMode is "leavegen") */
  leavegenFormId?: string
  /** @deprecated Use qrCodeMode instead */
  linkedinOnly?: boolean
}

/**
 * Result of pass generation
 */
export interface PassGenerationResult {
  /** Buffer containing the .pkpass file */
  buffer: Buffer
  /** Suggested filename for the pass */
  filename: string
}

/**
 * Generate an Apple Wallet business card pass
 * @param cardData Business card information
 * @param config Apple Wallet configuration
 * @returns Buffer containing the .pkpass file and suggested filename
 */
export async function generateBusinessCardPass(
  cardData: BusinessCardData,
  config: AppleWalletConfig
): Promise<PassGenerationResult> {
  // Validate required fields
  if (!cardData.firstName || !cardData.lastName || !cardData.email || !cardData.title) {
    throw new Error("Missing required fields: firstName, lastName, email, title")
  }

  if (!config.passTypeIdentifier || !config.teamIdentifier) {
    throw new Error("Missing required config: passTypeIdentifier, teamIdentifier")
  }

  if (!config.certificateBase64 || !config.certificatePassword) {
    throw new Error("Missing required config: certificateBase64, certificatePassword")
  }

  if (!config.wwdrCertificateBase64) {
    throw new Error("Missing required config: wwdrCertificateBase64")
  }

  // Generate QR content based on qrCodeMode
  let qrContent: string
  const qrMode = cardData.qrCodeMode || (cardData.linkedinOnly ? "linkedin" : "vcard")

  switch (qrMode) {
    case "linkedin":
      qrContent = formatLinkedInUrl(cardData.linkedin || "")
      break
    case "custom":
      qrContent = cardData.customLink || ""
      break
    case "leavegen":
      qrContent = cardData.leavegenFormId
        ? `https://app.getcardova.com/leavegen/form/${cardData.leavegenFormId}`
        : ""
      break
    case "vcard":
    default:
      qrContent = generateVCard(cardData)
      break
  }

  const serialNumber = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const fullName = `${cardData.firstName} ${cardData.lastName}`

  // Convert hex color to RGB and determine text color for contrast
  const backgroundColor = hexToRgb(cardData.brandColor)
  const foregroundColor = isColorLight(cardData.brandColor) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"

  // Create pass JSON
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: config.passTypeIdentifier,
    teamIdentifier: config.teamIdentifier,
    serialNumber: serialNumber,
    organizationName: config.organizationName || "Business Card",
    description: `${fullName} - Business Card`,
    backgroundColor: backgroundColor,
    foregroundColor: foregroundColor,
    labelColor: foregroundColor,
    ...(!cardData.companyLogo && { logoText: config.organizationName || "Business Card" }),
    suppressStripShine: false,
    generic: {
      primaryFields: [
        {
          key: "name",
          value: fullName,
        },
      ],
      secondaryFields: [
        {
          key: "title",
          label: "Title",
          value: cardData.title,
        },
        ...(cardData.company
          ? [
              {
                key: "company",
                label: "Company",
                value: cardData.company,
              },
            ]
          : []),
      ].filter(Boolean),
      auxiliaryFields: [
        {
          key: "email",
          label: "Email",
          value: cardData.email,
        },
        ...(cardData.phone
          ? [
              {
                key: "phone",
                label: "Phone",
                value: cardData.phone,
              },
            ]
          : []),
      ].filter(Boolean),
      backFields: [
        {
          key: "contact_info",
          label: "Contact Information",
          value: `${fullName}\n${cardData.email}${cardData.phone ? "\n" + cardData.phone : ""}`,
        },
        ...(cardData.website
          ? [
              {
                key: "website",
                label: "Website",
                value: cardData.website,
              },
            ]
          : []),
        ...(cardData.linkedin
          ? [
              {
                key: "linkedin",
                label: "LinkedIn",
                value: formatLinkedInUrl(cardData.linkedin),
              },
            ]
          : []),
        {
          key: "instructions",
          label: "Instructions",
          value: "Scan the QR code to save this contact to your device.",
        },
      ].filter(Boolean),
    },
    barcodes: [
      {
        message: qrContent,
        format: "PKBarcodeFormatQR",
        messageEncoding: "utf-8",
        dataDetectorTypes: ["PKDataDetectorTypeAddress", "PKDataDetectorTypePhoneNumber", "PKDataDetectorTypeLink"],
      },
    ],
  }

  // Create files for the pass
  const files: { [key: string]: Buffer } = {}

  // Add pass.json
  const passJsonString = JSON.stringify(passJson)
  files["pass.json"] = Buffer.from(passJsonString, "utf8")

  // Add icon (QR code or fallback)
  let iconBuffer: Buffer
  if (cardData.qrCodeBase64) {
    iconBuffer = Buffer.from(cardData.qrCodeBase64, "base64")
  } else {
    // Create a simple fallback icon (1x1 transparent pixel)
    iconBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64"
    )
  }
  files["icon.png"] = iconBuffer
  files["icon@2x.png"] = iconBuffer

  // Add company logo if provided
  if (cardData.companyLogo) {
    const logoBuffer = processImageFromDataUrl(cardData.companyLogo)
    files["logo.png"] = logoBuffer
    files["logo@2x.png"] = logoBuffer
  }

  // Add profile photo as thumbnail if provided
  if (cardData.profilePhoto) {
    const thumbnailBuffer = processImageFromDataUrl(cardData.profilePhoto)
    files["thumbnail.png"] = thumbnailBuffer
    files["thumbnail@2x.png"] = thumbnailBuffer
  }

  // Create manifest
  const manifest: { [key: string]: string } = {}
  for (const [filename, buffer] of Object.entries(files)) {
    manifest[filename] = createHash("sha1").update(buffer).digest("hex")
  }

  const manifestString = JSON.stringify(manifest)
  files["manifest.json"] = Buffer.from(manifestString, "utf8")

  // Create PKCS#7 signature
  const signature = createSignature(manifestString, config)
  files["signature"] = signature

  // Create ZIP file
  const zipBuffer = createZipBuffer(files)

  return {
    buffer: zipBuffer,
    filename: `${fullName.replace(/[^a-zA-Z0-9]/g, "_")}.pkpass`,
  }
}

/**
 * Create PKCS#7 signature for the pass
 */
function createSignature(manifestString: string, config: AppleWalletConfig): Buffer {
  // Decode the base64 to get the full PEM content
  const fullPemContent = Buffer.from(config.certificateBase64, "base64").toString("utf8")
  const wwdrPemContent = Buffer.from(config.wwdrCertificateBase64, "base64").toString("utf8")

  // Extract the certificate part
  const certMatch = fullPemContent.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)
  if (!certMatch) {
    throw new Error("Certificate not found in PEM content")
  }
  const certificatePem = certMatch[0]

  // Extract the private key part
  const privateKeyMatch = fullPemContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/)
  const encPrivateKeyMatch = fullPemContent.match(
    /-----BEGIN ENCRYPTED PRIVATE KEY-----[\s\S]*?-----END ENCRYPTED PRIVATE KEY-----/
  )

  let privateKeyPem: string
  let isEncrypted = false

  if (privateKeyMatch) {
    privateKeyPem = privateKeyMatch[0]
    isEncrypted = false
  } else if (encPrivateKeyMatch) {
    privateKeyPem = encPrivateKeyMatch[0]
    isEncrypted = true
  } else {
    throw new Error(
      "Private key not found in PEM content. Make sure your .p12 conversion included the private key with -nodes flag"
    )
  }

  // Extract WWDR certificate
  const wwdrMatch = wwdrPemContent.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)
  if (!wwdrMatch) {
    throw new Error("WWDR certificate not found in PEM content")
  }
  const wwdrCertificatePem = wwdrMatch[0]

  // Convert PEM to forge objects
  const signerCert = forge.pki.certificateFromPem(certificatePem)
  const wwdrCert = forge.pki.certificateFromPem(wwdrCertificatePem)

  // Import private key with password if encrypted
  let privateKey: forge.pki.PrivateKey

  if (isEncrypted) {
    privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, config.certificatePassword)
    if (!privateKey) {
      throw new Error("Failed to decrypt private key with provided password")
    }
  } else {
    privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
  }

  // Create PKCS#7 signature
  const p7 = forge.pkcs7.createSignedData()
  p7.content = forge.util.createBuffer(manifestString, "utf8")
  p7.addCertificate(signerCert)
  p7.addCertificate(wwdrCert)
  p7.addSigner({
    key: privateKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      },
      {
        type: forge.pki.oids.messageDigest,
      },
      {
        type: forge.pki.oids.signingTime,
        value: new Date() as any,
      },
    ],
  })

  p7.sign({ detached: true })

  // Convert to DER format
  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), "binary")
}

/**
 * Convert hex color to RGB string
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  return "rgb(21, 103, 65)" // fallback to default green
}

/**
 * Check if a color is light (for contrast determination)
 */
function isColorLight(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return false

  const r = Number.parseInt(result[1], 16)
  const g = Number.parseInt(result[2], 16)
  const b = Number.parseInt(result[3], 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * Format LinkedIn URL from various input formats
 */
function formatLinkedInUrl(linkedin: string): string {
  if (!linkedin) return ""

  if (linkedin.startsWith("http")) {
    return linkedin
  }

  if (linkedin.includes("linkedin.com/")) {
    return linkedin.startsWith("https://") ? linkedin : `https://${linkedin}`
  }

  const username = linkedin.replace(/^@/, "")
  return `https://linkedin.com/in/${username}`
}

/**
 * Generate vCard from business card data
 */
function generateVCard(cardData: BusinessCardData): string {
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n"

  const fullName = `${cardData.firstName} ${cardData.lastName}`.trim()
  if (fullName) vcard += `FN:${fullName}\n`
  if (cardData.firstName || cardData.lastName)
    vcard += `N:${cardData.lastName};${cardData.firstName};;;\n`
  if (cardData.email) vcard += `EMAIL:${cardData.email}\n`
  if (cardData.phone) vcard += `TEL:${cardData.phone}\n`
  if (cardData.title) vcard += `TITLE:${cardData.title}\n`
  if (cardData.company) vcard += `ORG:${cardData.company}\n`

  if (cardData.website && cardData.website.trim()) {
    const website = cardData.website.trim()
    vcard += `URL:${website.startsWith("http") ? website : `https://${website}`}\n`
  }

  if (cardData.linkedin && cardData.linkedin.trim()) {
    const linkedinUrl = formatLinkedInUrl(cardData.linkedin)
    vcard += `URL:${linkedinUrl}\n`
  }

  if (cardData.customFields && cardData.customFields.length > 0) {
    const validFields = cardData.customFields.filter((field) => field.label && field.value)
    if (validFields.length > 0) {
      const noteContent = validFields.map((field) => `${field.label}: ${field.value}`).join("\\n")
      vcard += `NOTE:${noteContent}\n`
    }
  }

  vcard += "END:VCARD"
  return vcard
}

/**
 * Process image from data URL
 */
function processImageFromDataUrl(dataUrl: string): Buffer {
  const base64Data = dataUrl.split(",")[1]
  if (!base64Data) {
    throw new Error("Invalid data URL format")
  }
  return Buffer.from(base64Data, "base64")
}

/**
 * Create ZIP buffer from files
 */
function createZipBuffer(files: { [key: string]: Buffer }): Buffer {
  const zipEntries: Buffer[] = []
  const centralDirectory: Buffer[] = []
  let offset = 0

  for (const [filename, content] of Object.entries(files)) {
    const filenameBuffer = Buffer.from(filename, "utf8")
    const crc32 = calculateCrc32(content)

    // Local file header
    const localHeader = Buffer.alloc(30 + filenameBuffer.length)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(0, 8)
    localHeader.writeUInt16LE(0, 10)
    localHeader.writeUInt16LE(0, 12)
    localHeader.writeUInt32LE(crc32, 14)
    localHeader.writeUInt32LE(content.length, 18)
    localHeader.writeUInt32LE(content.length, 22)
    localHeader.writeUInt16LE(filenameBuffer.length, 26)
    localHeader.writeUInt16LE(0, 28)
    filenameBuffer.copy(localHeader, 30)

    zipEntries.push(localHeader)
    zipEntries.push(content)

    // Central directory entry
    const centralEntry = Buffer.alloc(46 + filenameBuffer.length)
    centralEntry.writeUInt32LE(0x02014b50, 0)
    centralEntry.writeUInt16LE(20, 4)
    centralEntry.writeUInt16LE(20, 6)
    centralEntry.writeUInt16LE(0, 8)
    centralEntry.writeUInt16LE(0, 10)
    centralEntry.writeUInt16LE(0, 12)
    centralEntry.writeUInt16LE(0, 14)
    centralEntry.writeUInt32LE(crc32, 16)
    centralEntry.writeUInt32LE(content.length, 20)
    centralEntry.writeUInt32LE(content.length, 24)
    centralEntry.writeUInt16LE(filenameBuffer.length, 28)
    centralEntry.writeUInt16LE(0, 30)
    centralEntry.writeUInt16LE(0, 32)
    centralEntry.writeUInt16LE(0, 34)
    centralEntry.writeUInt16LE(0, 36)
    centralEntry.writeUInt32LE(0, 38)
    centralEntry.writeUInt32LE(offset, 42)
    filenameBuffer.copy(centralEntry, 46)

    centralDirectory.push(centralEntry)
    offset += localHeader.length + content.length
  }

  const centralDirectoryBuffer = Buffer.concat(centralDirectory)
  const centralDirectorySize = centralDirectoryBuffer.length

  // End of central directory record
  const endOfCentralDirectory = Buffer.alloc(22)
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0)
  endOfCentralDirectory.writeUInt16LE(0, 4)
  endOfCentralDirectory.writeUInt16LE(0, 6)
  endOfCentralDirectory.writeUInt16LE(Object.keys(files).length, 8)
  endOfCentralDirectory.writeUInt16LE(Object.keys(files).length, 10)
  endOfCentralDirectory.writeUInt32LE(centralDirectorySize, 12)
  endOfCentralDirectory.writeUInt32LE(offset, 16)
  endOfCentralDirectory.writeUInt16LE(0, 20)

  return Buffer.concat([...zipEntries, centralDirectoryBuffer, endOfCentralDirectory])
}

/**
 * Calculate CRC32 checksum
 */
function calculateCrc32(data: Buffer): number {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[i] = c
  }

  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}
