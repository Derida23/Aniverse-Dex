import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'

export default function NotFoundPage() {
  const { t } = useTranslation()
  usePageTitle('404')

  return (
    <article className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">{t('notFound.title')}</h1>
      <p className="text-muted-foreground">{t('notFound.message')}</p>
      <Link to="/" className="text-primary hover:underline">
        {t('notFound.backHome')}
      </Link>
    </article>
  )
}
