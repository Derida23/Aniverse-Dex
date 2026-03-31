import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Character } from '@/types/jikan'
import { useAnimeCharacters } from '../api/use-anime-detail'
import CharacterModal from './character-modal'

interface CharacterGridProps {
  animeId: number
}

function CharacterCard({
  char,
  onClick,
}: {
  char: Character
  onClick: () => void
}) {
  const japaneseVA = char.voice_actors.find((va) => va.language === 'Japanese')

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Character image with overlay */}
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <img
          src={char.character.images.jpg.image_url}
          alt={char.character.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Role badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={char.role === 'Main' ? 'default' : 'secondary'}
            className="text-[10px] px-1.5 py-0 shadow-md"
          >
            {char.role === 'Main' ? '★ Main' : 'Supporting'}
          </Badge>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-sm font-bold leading-tight text-white drop-shadow-lg line-clamp-2">
            {char.character.name}
          </p>

          {/* Japanese VA preview */}
          {japaneseVA && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <img
                src={japaneseVA.person.images.jpg.image_url}
                alt={japaneseVA.person.name}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-white/50"
              />
              <div className="flex items-center gap-1 min-w-0">
                <Mic className="h-3 w-3 shrink-0 text-white/70" />
                <span className="text-[11px] text-white/90 truncate">
                  {japaneseVA.person.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

function CharacterCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-3/4 w-full" />
    </div>
  )
}

export default function CharacterGrid({ animeId }: CharacterGridProps) {
  const { t } = useTranslation()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const { data: characters, isPending, isError } = useAnimeCharacters(animeId)

  if (isPending) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.characters')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <CharacterCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.characters')}</h2>
        <p className="text-destructive text-sm">{t('detail.failedCharacters')}</p>
      </section>
    )
  }

  if (!characters || characters.length === 0) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">{t('detail.characters')}</h2>
        <p className="text-muted-foreground text-sm italic">{t('detail.noCharacters')}</p>
      </section>
    )
  }

  // Sort: Main characters first
  const sorted = [...characters].sort((a, b) => {
    if (a.role === 'Main' && b.role !== 'Main') return -1
    if (a.role !== 'Main' && b.role === 'Main') return 1
    return 0
  })

  const mainCount = sorted.filter((c) => c.role === 'Main').length
  const supportCount = sorted.length - mainCount

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-semibold">{t('detail.characters')}</h2>
        <div className="flex items-center gap-2">
          {mainCount > 0 && (
            <Badge variant="default" className="text-xs">
              <Star className="mr-1 h-3 w-3" />
              {mainCount} Main
            </Badge>
          )}
          {supportCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {supportCount} Supporting
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sorted.map((char) => (
          <CharacterCard
            key={char.character.mal_id}
            char={char}
            onClick={() => setSelectedCharacter(char)}
          />
        ))}
      </div>

      <CharacterModal
        character={selectedCharacter}
        open={selectedCharacter !== null}
        onClose={() => setSelectedCharacter(null)}
      />
    </section>
  )
}
