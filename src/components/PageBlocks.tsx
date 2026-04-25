import { ContactForm } from '@/components/ContactForm'
import { FlexContent } from '@/components/FlexContent'
import { Ksun } from '@/components/Ksun'
import { LandingHero } from '@/components/LandingHero'
import { LandingWorks } from '@/components/LandingWorks'
import { PageHero } from '@/components/PageHero'
import { ApplyPageSettings } from '@/components/PageSettingsContext'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { RiveBlock } from '@/components/RiveBlock'
import { SectionBlock } from '@/components/SectionBlock'
import { ServicesGrid } from '@/components/ServicesGrid'
import type { BackgroundLayer } from '@/components/SectionBlock'
import type {
  CMSContentBlock,
  CMSPageSettings,
  CMSProject,
  CMSSection,
  CMSService,
} from '@/lib/cms'
import { mediaURL } from '@/lib/cms'

type Props = {
  blocks: CMSSection[]
  services: CMSService[]
  projects: CMSProject[]
  projectsByCategory?: Record<string, CMSProject[]>
  pageSettings?: CMSPageSettings
}

function applyLimit<T>(items: T[], limit?: number) {
  if (!limit || limit < 1) return items
  return items.slice(0, limit)
}

function normaliseBgs(raw: BackgroundLayer[] | undefined): BackgroundLayer[] | undefined {
  if (!raw?.length) return undefined
  return raw.map((layer) => {
    if (layer.type === 'image') {
      const resolved = mediaURL(layer.image) ?? (layer.url as string | undefined) ?? ''
      return { ...layer, url: resolved } as BackgroundLayer
    }
    if (layer.type === 'gradient') {
      // CMS stores the value in a field named 'gradient'; BackgroundLayer type uses 'value'
      const raw = layer as unknown as Record<string, unknown>
      const val = (raw.gradient as string | undefined) ?? layer.value
      return { ...layer, value: val } as BackgroundLayer
    }
    return layer
  })
}

function BlockContent({
  block,
  services,
  projects,
  projectsByCategory,
}: {
  block: CMSContentBlock
  services: CMSService[]
  projects: CMSProject[]
  projectsByCategory?: Record<string, CMSProject[]>
}) {
  if (block.blockType === 'landingHero') {
    return (
      <LandingHero
        title={block.title}
        subtitle={block.subtitle}
        image={block.image}
        ctaLabel={block.cta?.label}
        ctaHref={block.cta?.href}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        subtitleAnim={block.subtitleAnim}
        subtitleAnimType={block.subtitleAnimType}
        subtitleAnimEasing={block.subtitleAnimEasing}
        subtitleAnimDuration={block.subtitleAnimDuration}
        subtitleAnimDelay={block.subtitleAnimDelay}
        ctaAnim={block.ctaAnim}
        ctaAnimType={block.ctaAnimType}
        ctaAnimEasing={block.ctaAnimEasing}
        ctaAnimDuration={block.ctaAnimDuration}
        ctaAnimDelay={block.ctaAnimDelay}
        imageAnim={block.imageAnim}
        imageAnimType={block.imageAnimType}
        imageAnimEasing={block.imageAnimEasing}
        imageAnimDuration={block.imageAnimDuration}
        imageAnimDelay={block.imageAnimDelay}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'pageHero') {
    return (
      <PageHero
        title={block.title}
        subtitle={block.subtitle}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        subtitleAnim={block.subtitleAnim}
        subtitleAnimType={block.subtitleAnimType}
        subtitleAnimEasing={block.subtitleAnimEasing}
        subtitleAnimDuration={block.subtitleAnimDuration}
        subtitleAnimDelay={block.subtitleAnimDelay}
        contentAnim={block.contentAnim}
        contentAnimType={block.contentAnimType}
        contentAnimEasing={block.contentAnimEasing}
        contentAnimDuration={block.contentAnimDuration}
        contentAnimDelay={block.contentAnimDelay}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'servicesGrid') {
    const source = block.featuredOnly ? services.filter((s) => s.featured) : services
    return (
      <ServicesGrid
        services={applyLimit(source, block.limit)}
        title={block.title}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        itemsAnim={block.itemsAnim}
        itemsAnimType={block.itemsAnimType}
        itemsAnimEasing={block.itemsAnimEasing}
        itemsAnimDuration={block.itemsAnimDuration}
        itemsAnimDelay={block.itemsAnimDelay}
        itemsAnimStagger={block.itemsAnimStagger}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'projectsGrid') {
    const source = block.featuredOnly ? projects.filter((p) => p.featured) : projects
    return (
      <ProjectsGrid
        projects={applyLimit(source, block.limit)}
        title={block.title}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        itemsAnim={block.itemsAnim}
        itemsAnimType={block.itemsAnimType}
        itemsAnimEasing={block.itemsAnimEasing}
        itemsAnimDuration={block.itemsAnimDuration}
        itemsAnimDelay={block.itemsAnimDelay}
        itemsAnimStagger={block.itemsAnimStagger}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'contactForm') {
    return (
      <PageHero
        title={block.title}
        subtitle={block.subtitle}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        subtitleAnim={block.subtitleAnim}
        subtitleAnimType={block.subtitleAnimType}
        subtitleAnimEasing={block.subtitleAnimEasing}
        subtitleAnimDuration={block.subtitleAnimDuration}
        subtitleAnimDelay={block.subtitleAnimDelay}
        contentAnim={block.contentAnim}
        contentAnimType={block.contentAnimType}
        contentAnimEasing={block.contentAnimEasing}
        contentAnimDuration={block.contentAnimDuration}
        contentAnimDelay={block.contentAnimDelay}
        paddingX={block.paddingX}
      >
        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </PageHero>
    )
  }

  if (block.blockType === 'flexContent') {
    return (
      <FlexContent
        textAlign={block.textAlign}
        verticalAlign={block.verticalAlign}
        contentWidth={block.contentWidth}
        columnSplit={block.columnSplit}
        gap={block.gap}
        paddingTop={block.paddingTop}
        paddingBottom={block.paddingBottom}
        paddingX={block.paddingX}
        eyebrow={block.eyebrow}
        eyebrowSize={block.eyebrowSize}
        eyebrowWeight={block.eyebrowWeight}
        heading={block.heading}
        headingAccent={block.headingAccent}
        headingAccentSize={block.headingAccentSize}
        headingAccentX={block.headingAccentX}
        headingAccentY={block.headingAccentY}
        headingAccentHref={(() => {
          const p = block.headingAccentPage
          if (!p) return block.headingAccentHref
          const slug = typeof p === 'object' ? (p.slug ?? '') : p
          return slug === 'home' ? '/' : `/${slug}`
        })()}
        headingSize={block.headingSize}
        headingStyle={block.headingStyle}
        headingWeight={block.headingWeight}
        body={block.body}
        bodySize={block.bodySize}
        bodyWeight={block.bodyWeight}
        ctaLabel={block.ctaLabel}
        ctaHref={(() => {
          const p = block.ctaPage
          if (!p) return block.ctaHref
          const slug = typeof p === 'object' ? (p.slug ?? '') : p
          return slug === 'home' ? '/' : `/${slug}`
        })()}
        ctaStyle={block.ctaStyle}
        image={block.image}
        imageAspect={block.imageAspect}
        colorEyebrow={block.colorEyebrow}
        colorHeading={block.colorHeading}
        colorBody={block.colorBody}
        colorCta={block.colorCta}
        eyebrowAnim={block.eyebrowAnim}
        eyebrowAnimType={block.eyebrowAnimType}
        eyebrowAnimEasing={block.eyebrowAnimEasing}
        eyebrowAnimDuration={block.eyebrowAnimDuration}
        eyebrowAnimDelay={block.eyebrowAnimDelay}
        headingAnim={block.headingAnim}
        headingAnimType={block.headingAnimType}
        headingAnimEasing={block.headingAnimEasing}
        headingAnimDuration={block.headingAnimDuration}
        headingAnimDelay={block.headingAnimDelay}
        accentAnim={block.accentAnim}
        accentAnimType={block.accentAnimType}
        accentAnimEasing={block.accentAnimEasing}
        accentAnimDuration={block.accentAnimDuration}
        accentAnimDelay={block.accentAnimDelay}
        bodyAnim={block.bodyAnim}
        bodyAnimType={block.bodyAnimType}
        bodyAnimEasing={block.bodyAnimEasing}
        bodyAnimDuration={block.bodyAnimDuration}
        bodyAnimDelay={block.bodyAnimDelay}
        ctaAnim={block.ctaAnim}
        ctaAnimType={block.ctaAnimType}
        ctaAnimEasing={block.ctaAnimEasing}
        ctaAnimDuration={block.ctaAnimDuration}
        ctaAnimDelay={block.ctaAnimDelay}
        slotAnim={block.slotAnim}
        slotAnimType={block.slotAnimType}
        slotAnimEasing={block.slotAnimEasing}
        slotAnimDuration={block.slotAnimDuration}
        slotAnimDelay={block.slotAnimDelay}
      />
    )
  }

  if (block.blockType === 'ksun') {
    return (
      <Ksun
        title={block.title}
        subtitle={block.subtitle}
        titleAnim={block.titleAnim}
        titleAnimType={block.titleAnimType}
        titleAnimEasing={block.titleAnimEasing}
        titleAnimDuration={block.titleAnimDuration}
        titleAnimDelay={block.titleAnimDelay}
        subtitleAnim={block.subtitleAnim}
        subtitleAnimType={block.subtitleAnimType}
        subtitleAnimEasing={block.subtitleAnimEasing}
        subtitleAnimDuration={block.subtitleAnimDuration}
        subtitleAnimDelay={block.subtitleAnimDelay}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'landingWorks') {
    return (
      <LandingWorks
        columns={block.columns ?? []}
        projectsByCategory={projectsByCategory ?? {}}
        sectionAnim={block.sectionAnim}
        sectionAnimType={block.sectionAnimType}
        sectionAnimEasing={block.sectionAnimEasing}
        sectionAnimDuration={block.sectionAnimDuration}
        sectionAnimDelay={block.sectionAnimDelay}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'rive') {
    const resolvedUrl = mediaURL(block.riveFile) ?? block.riveUrl ?? ''
    if (!resolvedUrl) return null
    return (
      <RiveBlock
        riveUrl={resolvedUrl}
        artboard={block.artboard}
        animation={block.animation}
        stateMachine={block.stateMachine}
        scrollInput={block.scrollInput}
        mode={block.mode}
        fit={block.fit}
        alignment={block.alignment}
        aspect={block.aspect}
        animDuration={block.animDuration}
        scrubStart={block.scrubStart}
        scrubEnd={block.scrubEnd}
      />
    )
  }

  return null
}

export function PageBlocks({
  blocks,
  services,
  projects,
  projectsByCategory,
  pageSettings,
}: Props) {
  const pageNoise = pageSettings?.noise
  const pageBgs = normaliseBgs(pageSettings?.backgrounds as BackgroundLayer[] | undefined)

  return (
    <>
      <ApplyPageSettings settings={pageSettings ?? {}} />
      <div
        className={`page-blocks${pageNoise && pageNoise !== 'none' ? ` is-noise${pageNoise === 'gradient' ? '--gradient' : ''}` : ''}`}
      >
        {/* Page-wide background layers.
            SVG layers: fixed inset-0 container (overflow hidden, no CLS) with inner absolutely-positioned wrapper.
            Other layers: full-cover fixed div with CSS background properties. */}
        {pageBgs?.map((layer, i) =>
          layer.type === 'svg' ? (
            <div
              key={i}
              aria-hidden="true"
              className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
              style={{
                opacity: layer.opacity ?? 1,
                mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'] | undefined,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: layer.svgTop ?? 'auto',
                  right: layer.svgRight ?? 'auto',
                  bottom: layer.svgBottom ?? 'auto',
                  left: layer.svgLeft ?? 'auto',
                  ...(layer.svgTransform ? { transform: layer.svgTransform } : {}),
                }}
                // SVG code comes from the CMS admin — only accessible to canManageContent staff
                dangerouslySetInnerHTML={{ __html: layer.svgCode }}
              />
            </div>
          ) : (
            <div
              key={i}
              aria-hidden="true"
              className="fixed inset-0 -z-10 pointer-events-none"
              style={(() => {
                const blend = layer.blendMode as React.CSSProperties['mixBlendMode'] | undefined
                if (layer.type === 'solid') {
                  const s: React.CSSProperties = {
                    background: layer.color,
                    opacity: layer.opacity ?? 1,
                    mixBlendMode: blend,
                  }
                  if (layer.enableTransform) {
                    if (layer.bgSize) s.backgroundSize = layer.bgSize
                    if (layer.bgPosition) s.backgroundPosition = layer.bgPosition
                    if (layer.bgRepeat)
                      s.backgroundRepeat = layer.bgRepeat as React.CSSProperties['backgroundRepeat']
                  }
                  return s
                }
                if (layer.type === 'gradient') {
                  const s: React.CSSProperties = {
                    background: layer.value,
                    opacity: layer.opacity ?? 1,
                    mixBlendMode: blend,
                  }
                  if (layer.enableTransform) {
                    if (layer.bgSize) s.backgroundSize = layer.bgSize
                    if (layer.bgPosition) s.backgroundPosition = layer.bgPosition
                    if (layer.bgRepeat)
                      s.backgroundRepeat = layer.bgRepeat as React.CSSProperties['backgroundRepeat']
                  }
                  return s
                }
                return {
                  backgroundImage: `url(${layer.url})`,
                  backgroundSize: layer.enableTransform && layer.bgSize ? layer.bgSize : 'cover',
                  backgroundPosition:
                    layer.enableTransform && layer.bgPosition ? layer.bgPosition : 'center',
                  backgroundRepeat:
                    layer.enableTransform && layer.bgRepeat ? layer.bgRepeat : 'no-repeat',
                  opacity: layer.opacity ?? 1,
                  mixBlendMode: blend,
                }
              })()}
            />
          ),
        )}
        {blocks.map((section, index) => {
          const innerBlocks = section.block ?? []
          if (!innerBlocks.length) return null

          return (
            <SectionBlock
              key={section.id ?? index}
              styleType={section.containerStyle}
              paddingTop={section.paddingTop}
              paddingBottom={section.paddingBottom}
              paddingX={section.paddingX}
              noise={section.useNoise}
              backgrounds={normaliseBgs(section.backgrounds)}
              borderType={section.borderType}
              borderColor={section.borderColor}
              borderGradient={section.borderGradient}
              allowOverflow={section.allowOverflow}
              scrollJackHeight={section.scrollJackHeight}
              scrollJackScrub={section.scrollJackScrub}
              direction={section.flexDirection}
              justify={section.flexJustify}
              align={section.flexAlign}
              gap={section.flexGap}
              wrap={section.flexWrap}
            >
              {innerBlocks.map((b, bi) => (
                <BlockContent
                  key={b.id ?? bi}
                  block={b}
                  services={services}
                  projects={projects}
                  projectsByCategory={projectsByCategory}
                />
              ))}
            </SectionBlock>
          )
        })}
      </div>
    </>
  )
}
