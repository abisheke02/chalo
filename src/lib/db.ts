import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { decodeEntities } from '@/lib/text'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// The admin API HTML-escapes what it saves, so a title saved as "A & B" is
// stored as "A &amp; B". Short plain-text fields are decoded here as they are
// read, which fixes every page, list and admin form at once. The long `content`
// fields are left alone on purpose: some are shown as raw HTML, where the
// escaping is the protection.
const PLAIN_TEXT_MODELS = new Set([
  'BlogPost', 'Webinar', 'CaseStudy', 'NewsEvent', 'HelpDoc', 'ReleaseNote',
  'FeaturePage', 'Testimonial', 'FAQ', 'SiteContent',
])
const PLAIN_TEXT_FIELDS = new Set([
  'title', 'excerpt', 'description', 'name', 'role', 'school', 'schoolName',
  'speaker', 'speakerTitle', 'author', 'category', 'question', 'answer',
  'label', 'location', 'board',
])

function decodeRecord(model: string, record: Record<string, unknown>) {
  const isSiteContent = model === 'SiteContent'
  for (const [field, value] of Object.entries(record)) {
    if (typeof value !== 'string' || !value.includes('&')) continue
    // For site content, `value` is the editable text (module images are data URLs, left as they are).
    const decode = PLAIN_TEXT_FIELDS.has(field) || (isSiteContent && field === 'value' && !String(record.key).startsWith('module_image_'))
    if (decode) record[field] = decodeEntities(value)
  }
}

function decodeResult(model: string, result: unknown) {
  if (!PLAIN_TEXT_MODELS.has(model) || result === null || typeof result !== 'object') return
  if (Array.isArray(result)) {
    for (const row of result) if (row && typeof row === 'object') decodeRecord(model, row as Record<string, unknown>)
  } else {
    decodeRecord(model, result as Record<string, unknown>)
  }
}

// The extended client behaves exactly like PrismaClient, so it keeps that type.
function withPlainText(client: PrismaClient): PrismaClient {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, args, query }) {
          const result = await query(args)
          decodeResult(model, result)
          return result
        },
      },
    },
  }) as unknown as PrismaClient
}

// Turso (hosted libSQL) in production/whenever TURSO_DATABASE_URL is set —
// falls back to a local SQLite file (DATABASE_URL) for local dev if unset.
// .trim() guards against trailing newlines/whitespace that hosting-provider
// env var UIs (Render, etc.) tend to append when pasting into their fields.
function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim()
  if (tursoUrl) {
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
    })
    return withPlainText(new PrismaClient({ adapter, log: ['query'] }))
  }
  return withPlainText(new PrismaClient({ log: ['query'] }))
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
