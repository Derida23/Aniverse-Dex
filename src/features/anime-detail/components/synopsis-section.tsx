import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useSynopsisToggle } from '../hooks/use-synopsis-toggle'

interface SynopsisSectionProps {
  synopsis: string | null
}

export default function SynopsisSection({ synopsis }: SynopsisSectionProps) {
  const { t } = useTranslation()
  const { expanded, toggle, isLong } = useSynopsisToggle(synopsis)

  if (!synopsis) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-3">{t('detail.synopsis')}</h2>
        <p className="text-muted-foreground italic">{t('detail.noSynopsis')}</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-3">{t('detail.synopsis')}</h2>
      <div
        className={
          !expanded && isLong
            ? 'line-clamp-5 text-sm md:text-base leading-relaxed text-muted-foreground'
            : 'text-sm md:text-base leading-relaxed text-muted-foreground'
        }
      >
        {synopsis}
      </div>
      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="mt-2 px-0 text-primary hover:bg-transparent"
        >
          {expanded ? t('common.showLess') : t('common.showMore')}
        </Button>
      )}
    </section>
  )
}
