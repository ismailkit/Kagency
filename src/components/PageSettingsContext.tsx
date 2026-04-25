'use client'

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import type { CMSPageSettings } from '@/lib/cms'

type ContextValue = {
  settings: CMSPageSettings
  setSettings: (s: CMSPageSettings) => void
}

const PageSettingsContext = createContext<ContextValue>({
  settings: {},
  setSettings: () => {},
})

export function PageSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CMSPageSettings>({})
  return (
    <PageSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </PageSettingsContext.Provider>
  )
}

export function usePageSettings() {
  return useContext(PageSettingsContext).settings
}

/** Rendered inside PageBlocks to push per-page settings up to the root provider. */
export function ApplyPageSettings({ settings }: { settings: CMSPageSettings }) {
  const { setSettings } = useContext(PageSettingsContext)
  useLayoutEffect(() => {
    setSettings(settings)
    return () => setSettings({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(settings)])
  return null
}
