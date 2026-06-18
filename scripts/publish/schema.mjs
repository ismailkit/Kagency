/**
 * Print the field schema for a collection (default: projects), including
 * plugin-added fields (e.g. SEO meta). Use this so an AI knows exactly which
 * fields exist, their types, whether they're required, and select options.
 *
 *   npm run publish:schema             # projects
 *   npm run publish:schema -- services # any collection slug
 */
const slug = process.argv[2] || 'projects'

const mod = await import('../../src/payload.config.ts')
const config = await mod.default

const collection = config.collections.find((c) => c.slug === slug)
if (!collection) {
  console.error(`Collection "${slug}" not found. Available: ${config.collections.map((c) => c.slug).join(', ')}`)
  process.exit(1)
}

function flatten(fields, prefix = '') {
  const out = []
  for (const f of fields) {
    if (!f) continue
    if (f.type === 'row' || f.type === 'collapsible') {
      out.push(...flatten(f.fields || [], prefix))
      continue
    }
    if (f.type === 'tabs') {
      for (const t of f.tabs || []) out.push(...flatten(t.fields || [], prefix))
      continue
    }
    if (!f.name) continue
    const name = prefix + f.name
    if (f.type === 'group') {
      out.push(...flatten(f.fields || [], `${name}.`))
      continue
    }
    out.push({
      name,
      type: f.type,
      required: !!f.required,
      ...(f.relationTo ? { relationTo: f.relationTo, hasMany: !!f.hasMany } : {}),
      ...(f.options ? { options: f.options.map((o) => (typeof o === 'string' ? o : o.value)) } : {}),
      ...(f.type === 'array' && f.fields
        ? { arrayItemFields: flatten(f.fields, '').map((s) => s.name) }
        : {}),
    })
  }
  return out
}

console.log(`# Field schema for "${slug}"\n`)
console.log(JSON.stringify(flatten(collection.fields), null, 2))
