import { AboutPillars } from '@/components/AboutPillars'
import { BeliefsCounter } from '@/components/BeliefsCounter'
import { ConsolidationBlock } from '@/components/ConsolidationBlock'
import { ServicesShowcase } from '@/components/ServicesShowcase'
import { ScrollBeliefs } from '@/components/ScrollBeliefs'
import { ContactForm } from '@/components/ContactForm'
import { FlexContent } from '@/components/FlexContent'
import { Ksun } from '@/components/Ksun'
import { LandingHero } from '@/components/LandingHero'
import { LandingWorks } from '@/components/LandingWorks'
import { LogoCarousel } from '@/components/LogoCarousel'
import { PageHero } from '@/components/PageHero'
import { ApplyPageSettings } from '@/components/PageSettingsContext'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { RiveBlock } from '@/components/RiveBlock'
import { RiveBackground } from '@/components/RiveBackground'
import { SectionBlock } from '@/components/SectionBlock'
import { ServicesGrid } from '@/components/ServicesGrid'
import { TestimonialsBlock } from '@/components/TestimonialsBlock'
import type { BackgroundLayer } from '@/components/SectionBlock'
import type {
  CMSContentBlock,
  CMSPageSettings,
  CMSProject,
  CMSSection,
  CMSService,
  CMSTestimonial,
} from '@/lib/cms'
import { mediaURL } from '@/lib/cms'

type Props = {
  blocks: CMSSection[]
  services: CMSService[]
  projects: CMSProject[]
  testimonials?: CMSTestimonial[]
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
    if (layer.type === 'video') {
      // Resolve media library file URL; fall back to manual videoSrc string
      const raw = layer as unknown as Record<string, unknown>
      const fileUrl = mediaURL(raw.videoFile as Parameters<typeof mediaURL>[0])
      const src = fileUrl ?? (raw.videoSrc as string | undefined) ?? ''
      return { ...layer, videoSrc: src } as BackgroundLayer
    }
    if (layer.type === 'rive') {
      // Resolve media library file URL; fall back to manual riveUrl string
      const raw = layer as unknown as Record<string, unknown>
      const fileUrl = mediaURL(raw.riveFile as Parameters<typeof mediaURL>[0])
      const src = fileUrl ?? (raw.riveUrl as string | undefined) ?? ''
      return { ...layer, riveUrl: src } as BackgroundLayer
    }
    return layer
  })
}

/** Returns true if the first solid background layer is a dark colour (avg RGB < 100). */
function sectionIsDark(backgrounds: BackgroundLayer[]): boolean {
  const solid = backgrounds.find(
    (b): b is Extract<BackgroundLayer, { type: 'solid' }> => b.type === 'solid',
  )
  if (!solid) return false
  const c = solid.color ?? ''
  if (!c.startsWith('#') || c.length < 7) return false
  const r = parseInt(c.slice(1, 3), 16)
  const g = parseInt(c.slice(3, 5), 16)
  const b = parseInt(c.slice(5, 7), 16)
  return (r + g + b) / 3 < 100
}

function BlockContent({
  block,
  services,
  projects,
  projectsByCategory,
  testimonials,
}: {
  block: CMSContentBlock
  services: CMSService[]
  projects: CMSProject[]
  projectsByCategory?: Record<string, CMSProject[]>
  testimonials?: CMSTestimonial[]
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
        imageWidth={block.imageWidth}
        imageHeight={block.imageHeight}
        imagePosition={block.imagePosition}
        imageAlign={block.imageAlign}
        colorEyebrow={block.colorEyebrow}
        colorHeading={block.colorHeading}
        colorHeadingAccent={block.colorHeadingAccent}
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

  if (block.blockType === 'scrollBeliefs') {
    return (
      <ScrollBeliefs
        beliefs={(block.beliefs ?? []) as Array<{ number: string; title: string; body: string }>}
        vhPerBelief={block.vhPerBelief as number | undefined}
        scrub={block.scrub as number | undefined}
        backgroundSvg={block.backgroundSvg as string | undefined}
        titleSize={block.titleSize as 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | null | undefined}
        bodySize={block.bodySize as 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null | undefined}
      />
    )
  }

  if (block.blockType === 'beliefsCounter') {
    return (
      <BeliefsCounter
        beliefs={(block.beliefs ?? []) as Array<{ number: string; title: string; body: string }>}
      />
    )
  }

  if (block.blockType === 'aboutPillars') {
    return (
      <AboutPillars
        pillars={
          (block.pillars ?? []) as Array<{ label: string; descriptor: string; body: string }>
        }
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
        mode={block.mode}
        fit={block.fit}
        alignment={block.alignment}
        aspect={block.aspect}
        scrollTransform={
          block.stEnabled
            ? {
                enabled: true,
                start: block.stStart,
                end: block.stEnd,
                scrub: block.stScrub,
                xFrom: block.stXFrom,
                xTo: block.stXTo,
                yFrom: block.stYFrom,
                yTo: block.stYTo,
                scaleFrom: block.stScaleFrom,
                scaleTo: block.stScaleTo,
                opacityFrom: block.stOpacityFrom,
                opacityTo: block.stOpacityTo,
                ...(block.stMobileOverride
                  ? {
                      mobileXFrom: block.stMobileXFrom,
                      mobileXTo: block.stMobileXTo,
                      mobileYFrom: block.stMobileYFrom,
                      mobileYTo: block.stMobileYTo,
                      mobileScaleFrom: block.stMobileScaleFrom,
                      mobileScaleTo: block.stMobileScaleTo,
                      mobileOpacityFrom: block.stMobileOpacityFrom,
                      mobileOpacityTo: block.stMobileOpacityTo,
                    }
                  : {}),
              }
            : undefined
        }
      />
    )
  }

  if (block.blockType === 'servicesShowcase') {
    return (
      <ServicesShowcase
        services={
          (block.services ?? []) as Array<{
            eyebrow?: string
            headline: string
            body: import('@/lib/richtext').RichTextContent
            bullets: Array<{ item: string }>
          }>
        }
        vhPerService={block.vhPerService as number | undefined}
        scrub={block.scrub as number | undefined}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'consolidationBlock') {
    return (
      <ConsolidationBlock
        titleLine1={block.titleLine1 as string}
        titleLine2={block.titleLine2 as string}
        body={block.body as import('@/lib/richtext').RichTextContent}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'testimonialsBlock') {
    const src = testimonials ?? []
    const filtered = block.featuredOnly ? src.filter((t) => t.featured) : src
    const limited = block.limit ? filtered.slice(0, block.limit) : filtered
    return (
      <TestimonialsBlock
        testimonials={limited}
        title={block.title}
        subtitle={block.subtitle}
        paddingX={block.paddingX}
      />
    )
  }

  if (block.blockType === 'logoCarousel') {
    const logos = (block.logos ?? []).map((item) => ({
      id: item.id,
      image: item.image,
      alt: item.alt,
      href: item.href,
      label: item.label,
    }))
    return (
      <LogoCarousel
        logos={logos}
        rows={Number(block.rows ?? 1)}
        direction={block.direction ?? 'left'}
        alternateRows={block.alternateRows ?? true}
        speed={block.speed ?? 40}
        gap={block.gap ?? 'lg'}
        rowGap={block.rowGap ?? 'md'}
        logoHeight={block.logoHeight ?? 48}
        pauseOnHover={block.pauseOnHover ?? true}
        fadeEdges={block.fadeEdges ?? true}
        grayscale={block.grayscale ?? false}
        paddingTop={block.paddingTop ?? 'md'}
        paddingBottom={block.paddingBottom ?? 'md'}
        paddingX={block.paddingX ?? 'none'}
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
  testimonials,
  pageSettings,
}: Props) {
  const pageNoise = pageSettings?.noise
  const pageBgs = normaliseBgs(pageSettings?.backgrounds as BackgroundLayer[] | undefined)

  return (
    <>
      <ApplyPageSettings settings={pageSettings ?? {}} />
      {/* Page-wide noise overlay — rendered as a real element outside page-blocks
          so overflow:hidden on <main> and any CSS stacking contexts can't clip it. */}
      {pageNoise && pageNoise !== 'none' && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
            backgroundImage: "url('/assets/noise.png')",
            backgroundSize: '400px 400px',
            opacity: 0.55,
            ...(pageNoise === 'gradient'
              ? {
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                }
              : {}),
          }}
        />
      )}
      <div className="page-blocks">
        {/* Page-wide background layers.
            SVG layers: fixed inset-0 container (overflow hidden, no CLS) with inner absolutely-positioned wrapper.
            Other layers: full-cover fixed div with CSS background properties. */}
        {pageBgs?.map((layer, i) => {
          if (layer.type === 'svg') {
            return (
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
                  dangerouslySetInnerHTML={{ __html: layer.svgCode ?? '' }}
                />
              </div>
            )
          }
          if (layer.type === 'video') {
            return (
              <div
                key={i}
                aria-hidden="true"
                className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
                style={{
                  opacity: layer.opacity ?? 1,
                  mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'] | undefined,
                }}
              >
                {layer.videoSrc && (
                  <video
                    src={layer.videoSrc}
                    autoPlay={layer.videoAutoplay ?? true}
                    loop={layer.videoLoop ?? true}
                    muted={layer.videoMuted ?? true}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            )
          }
          if (layer.type === 'rive') {
            const riveLayer = layer as unknown as Record<string, unknown>
            const riveSrc = (riveLayer.riveUrl as string | undefined) ?? ''
            if (!riveSrc) return null
            return (
              <div
                key={i}
                aria-hidden="true"
                className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
              >
                <RiveBackground
                  src={riveSrc}
                  artboard={riveLayer.riveArtboard as string | undefined}
                  stateMachine={riveLayer.riveStateMachine as string | undefined}
                  fit={(riveLayer.riveFit as Parameters<typeof RiveBackground>[0]['fit']) ?? 'cover'}
                  alignment={
                    (riveLayer.riveAlignment as Parameters<typeof RiveBackground>[0]['alignment']) ??
                    'center'
                  }
                  opacity={riveLayer.opacity as number | undefined}
                  blendMode={riveLayer.blendMode as string | undefined}
                  scrub={
                    riveLayer.riveScrubEnabled
                      ? {
                          inputName: riveLayer.riveScrubProperty as string,
                          inputType: riveLayer.riveScrubInputType as 'number' | 'boolean' | undefined,
                          valueMin: riveLayer.riveScrubMin as number | undefined,
                          valueMax: riveLayer.riveScrubMax as number | undefined,
                          scrollStart: riveLayer.riveScrubStart as string | undefined,
                          scrollEnd: riveLayer.riveScrubEnd as string | undefined,
                          scrubStrength: riveLayer.riveScrubStrength as number | undefined,
                        }
                      : undefined
                  }
                />
              </div>
            )
          }
          // solid / gradient / image
          const blend = layer.blendMode as React.CSSProperties['mixBlendMode'] | undefined
          let bgStyle: React.CSSProperties = {}
          if (layer.type === 'solid') {
            bgStyle = { background: layer.color, opacity: layer.opacity ?? 1, mixBlendMode: blend }
            if (layer.enableTransform) {
              if (layer.bgSize) bgStyle.backgroundSize = layer.bgSize
              if (layer.bgPosition) bgStyle.backgroundPosition = layer.bgPosition
              if (layer.bgRepeat)
                bgStyle.backgroundRepeat = layer.bgRepeat as React.CSSProperties['backgroundRepeat']
            }
          } else if (layer.type === 'gradient') {
            bgStyle = { background: layer.value, opacity: layer.opacity ?? 1, mixBlendMode: blend }
            if (layer.enableTransform) {
              if (layer.bgSize) bgStyle.backgroundSize = layer.bgSize
              if (layer.bgPosition) bgStyle.backgroundPosition = layer.bgPosition
              if (layer.bgRepeat)
                bgStyle.backgroundRepeat = layer.bgRepeat as React.CSSProperties['backgroundRepeat']
            }
          } else if (layer.type === 'image') {
            bgStyle = {
              backgroundImage: `url(${layer.url})`,
              backgroundSize: layer.enableTransform && layer.bgSize ? layer.bgSize : 'cover',
              backgroundPosition:
                layer.enableTransform && layer.bgPosition ? layer.bgPosition : 'center',
              backgroundRepeat: (layer.enableTransform && layer.bgRepeat
                ? layer.bgRepeat
                : 'no-repeat') as React.CSSProperties['backgroundRepeat'],
              opacity: layer.opacity ?? 1,
              mixBlendMode: blend,
            }
          }
          return (
            <div
              key={i}
              aria-hidden="true"
              className="fixed inset-0 -z-10 pointer-events-none"
              style={bgStyle}
            />
          )
        })}
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
              noise={pageNoise && pageNoise !== 'none' ? 'none' : section.useNoise}
              backgrounds={normaliseBgs(section.backgrounds)}
              borderType={section.borderType}
              borderColor={section.borderColor}
              borderGradient={section.borderGradient}
              allowOverflow={section.allowOverflow}
              scrollJackHeight={section.scrollJackHeight}
              scrollJackScrub={section.scrollJackScrub}
              entranceAnim={section.entranceAnim}
              entranceType={section.entranceType}
              entranceEasing={section.entranceEasing}
              entranceDuration={section.entranceDuration}
              direction={section.flexDirection}
              justify={section.flexJustify}
              align={section.flexAlign}
              gap={section.flexGap}
              wrap={section.flexWrap}
              minHeightMobile={section.minHeightMobile}
              minHeightDesktop={section.minHeightDesktop}
              className={sectionIsDark(normaliseBgs(section.backgrounds)) ? 'text-white' : ''}
            >
              {innerBlocks.map((b, bi) => (
                <BlockContent
                  key={b.id ?? bi}
                  block={b}
                  services={services}
                  projects={projects}
                  projectsByCategory={projectsByCategory}
                  testimonials={testimonials}
                />
              ))}
            </SectionBlock>
          )
        })}
      </div>
    </>
  )
}
