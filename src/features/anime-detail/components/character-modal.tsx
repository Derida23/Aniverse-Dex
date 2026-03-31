import { useTranslation } from 'react-i18next'
import { Mic, Globe } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Character } from '@/types/jikan'

interface CharacterModalProps {
  character: Character | null
  open: boolean
  onClose: () => void
}

export default function CharacterModal({ character, open, onClose }: CharacterModalProps) {
  const { t } = useTranslation()

  if (!character) return null

  const japaneseVA = character.voice_actors.find((va) => va.language === 'Japanese')
  const otherVAs = character.voice_actors.filter((va) => va.language !== 'Japanese')

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Hero header */}
        <div className="relative">
          <div className="h-32 overflow-hidden">
            <img
              src={character.character.images.jpg.image_url}
              alt=""
              className="h-full w-full object-cover blur-xl opacity-40 scale-125"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
          </div>

          <div className="absolute -bottom-10 left-5">
            <img
              src={character.character.images.jpg.image_url}
              alt={character.character.name}
              className="h-24 w-20 rounded-xl object-cover shadow-xl ring-4 ring-background"
            />
          </div>
        </div>

        <div className="px-5 pt-12 pb-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">{character.character.name}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={character.role === 'Main' ? 'default' : 'secondary'}
              >
                {character.role === 'Main' ? '★ Main' : 'Supporting'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t('detail.voiceActor', { count: character.voice_actors.length })}
              </span>
            </div>
          </DialogHeader>

          {character.voice_actors.length > 0 && (
            <>
              <Separator className="my-4" />

              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                  <Mic className="h-4 w-4" />
                  {t('detail.voiceActors')}
                </h3>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {/* Japanese VA highlighted */}
                  {japaneseVA && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                      <img
                        src={japaneseVA.person.images.jpg.image_url}
                        alt={japaneseVA.person.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{japaneseVA.person.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            {japaneseVA.language}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other VAs */}
                  {otherVAs.map((va) => (
                    <div
                      key={`${va.person.mal_id}-${va.language}`}
                      className="flex items-center gap-3 rounded-lg border bg-card p-2.5"
                    >
                      <img
                        src={va.person.images.jpg.image_url}
                        alt={va.person.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{va.person.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{va.language}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
