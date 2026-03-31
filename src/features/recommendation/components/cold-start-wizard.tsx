import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GENRE_OPTIONS } from '@/lib/genres'
import { useColdStart } from '../hooks/use-cold-start'

const MIN_GENRES = 3

export default function ColdStartWizard() {
  const { t } = useTranslation()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const { markCompleted, setGenres } = useColdStart()
  const navigate = useNavigate()

  function toggleGenre(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  function handleNext() {
    if (selectedIds.length >= MIN_GENRES) {
      setStep(2)
    }
  }

  function handleStartExploring() {
    setGenres(selectedIds)
    markCompleted()
    navigate(`/search?genres=${selectedIds.join(',')}`)
  }

  const selectedNames = GENRE_OPTIONS.filter((g) => selectedIds.includes(g.id)).map((g) => g.name)

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        {step === 1 ? (
          <>
            <CardHeader>
              <CardTitle>{t('coldStart.step1Title')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('coldStart.step1Desc', { count: MIN_GENRES })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Genre selection">
                {GENRE_OPTIONS.map((genre) => {
                  const isSelected = selectedIds.includes(genre.id)
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors select-none ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => toggleGenre(genre.id)}
                    >
                      {genre.name}
                    </button>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('coldStart.selected', { count: selectedIds.length })}
              </span>
              <Button onClick={handleNext} disabled={selectedIds.length < MIN_GENRES}>
                {t('common.next')}
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>{t('coldStart.step2Title')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('coldStart.step2Desc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedNames.map((name) => (
                  <Badge key={name} variant="default">
                    {name}
                  </Badge>
                ))}
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                {t('coldStart.step2Hint')}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                {t('common.back')}
              </Button>
              <Button onClick={handleStartExploring}>{t('coldStart.startExploring')}</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
