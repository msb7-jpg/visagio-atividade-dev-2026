import findReviewsSvg from '@/assets/svg/find-reviews-online-cuate.svg'
import homeCinemaSvg from '@/assets/svg/home-cinema-amico.svg'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface ShowcaseFeature {
  actionText: string
  title: string
  description: string
  highlight: string
  svgSrc: string
}

const SHOWCASE_FEATURES: ShowcaseFeature[] = [
  {
    actionText: 'Avaliar Seus Filmes',
    title: 'Notas e Resenhas Comunitárias',
    description: 'Atribua notas de 0 a 10, escreva análises detalhadas e acompanhe a média geral consolidada.',
    highlight: 'Sistema de Avaliações',
    svgSrc: findReviewsSvg
  },
  {
    actionText: 'Gerir o Catálogo',
    title: 'Administração Completa de Obras',
    description: 'Cadastre novos filmes, atualize metadados e gerencie elenco, sinopses e produtoras.',
    highlight: 'Gestão de Conteúdo',
    svgSrc: homeCinemaSvg
  },
  {
    actionText: 'Publicar Críticas',
    title: 'Espaço Aberto para Críticos',
    description: 'Compartilhe suas percepções com a comunidade com formatação rica e comentários autênticos.',
    highlight: 'Voz da Comunidade',
    svgSrc: findReviewsSvg
  },
  {
    actionText: 'Explorar Acervo',
    title: 'Mais de 95.000 Produções',
    description: 'Navegação fluida com filtros por gênero, ordenação por bilheteria e busca instantânea.',
    highlight: 'Catálogo Paginado',
    svgSrc: homeCinemaSvg
  }
]

const WORDS_LIST = SHOWCASE_FEATURES.map((item) => item.actionText)

export function SyncVisualShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const currentItem = SHOWCASE_FEATURES[activeIndex] || SHOWCASE_FEATURES[0]

  return (
    <div className="flex h-[560px] w-full max-w-md flex-col justify-between rounded-2xl border border-white/10 bg-card/85 p-8 shadow-2xl backdrop-blur-xl">
      {/* Top Section: Aceternity LayoutTextFlip com foco em alto nível */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Plataforma RocketFilms
        </span>
        <div className="min-h-[44px]">
          <LayoutTextFlip
            text="Aqui você pode"
            words={WORDS_LIST}
            duration={3800}
            onIndexChange={(nextIndex) => setActiveIndex(nextIndex)}
            textClassName="text-xl md:text-2xl font-bold text-foreground"
            wordClassName="text-xl md:text-2xl border-primary/20 bg-primary/10 text-primary shadow-none"
          />
        </div>
      </div>

      {/* Center Section: Ilustração SVG oficial de assets/svg */}
      <div className="my-2 flex flex-1 items-center justify-center p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.actionText}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src={currentItem.svgSrc}
              alt={currentItem.title}
              className="max-h-[200px] w-auto object-contain drop-shadow-md select-none"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section: Texto explicativo de alto nível com altura fixa reservada */}
      <div className="h-[120px] rounded-xl border border-white/5 bg-secondary/30 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.actionText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-1"
          >
            <span className="text-xs font-semibold text-primary">
              {currentItem.highlight}
            </span>
            <h3 className="line-clamp-1 text-base font-bold text-foreground">
              {currentItem.title}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {currentItem.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
