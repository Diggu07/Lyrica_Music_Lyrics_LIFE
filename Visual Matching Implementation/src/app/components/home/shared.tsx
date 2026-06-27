import { ReactNode } from 'react'

export function PlayGlyph({ dark = true }: { dark?: boolean }) {
  return (
    <svg width="12" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
      <path d="M0 14V0L11 7L0 14Z" fill={dark ? '#0B0B0D' : '#FFFFFF'} />
    </svg>
  )
}

export function SaveGlyph({ active }: { active: boolean }) {
  return (
    <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none" aria-hidden="true">
      <path
        d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z"
        fill={active ? '#C6FF33' : 'rgba(255,255,255,0.72)'}
      />
    </svg>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  caption,
  action,
}: {
  eyebrow?: string
  title: string
  caption?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <div
            className="mb-2 text-[10px] uppercase tracking-[0.34em]"
            style={{ color: 'rgba(198,255,51,0.8)', fontFamily: 'var(--font-sans)' }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 2.2vw, 2.15rem)',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>
      <div className="flex items-end gap-4">
        {caption ? (
          <p className="max-w-[420px] text-right text-[12px] leading-5" style={{ color: 'var(--text-muted)' }}>
            {caption}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  )
}
