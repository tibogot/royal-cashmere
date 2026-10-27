import {defineField, defineType, type ImageValue} from 'sanity'

type Orientation = 'portrait' | 'landscape'

type EditableImageOptions = {
  name: string
  title: string
  // Guidance for the client, shown under the field (in French, like the site).
  guidance: string
  minWidth: number
  orientation: Orientation
}

// Asset refs encode the dimensions: image-<hash>-<width>x<height>-<ext>.
function imageDimensions(value: ImageValue | undefined) {
  const match = value?.asset?._ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  return match ? {width: Number(match[1]), height: Number(match[2])} : null
}

function editableImageField({name, title, guidance, minWidth, orientation}: EditableImageOptions) {
  return defineField({
    name,
    title,
    type: 'image',
    description: `${guidance} Laisser vide pour garder la photo par défaut. Placez le point de focus (hotspot) sur le sujet : c'est la partie qui reste visible quand l'image est recadrée.`,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        description:
          'Décrivez la photo en une phrase (ex. « Pull col V en cachemire beige »). Utile pour l’accessibilité et le référencement.',
      }),
    ],
    validation: (rule) => [
      rule.custom((value: ImageValue | undefined) => {
        const size = imageDimensions(value)
        if (!size || size.width >= minWidth) return true
        return `Image trop petite (${size.width} px de large) : minimum ${minWidth} px, sinon elle sera floue.`
      }),
      rule
        .custom((value: ImageValue | undefined) => {
          const size = imageDimensions(value)
          if (!size) return true
          const isPortrait = size.height >= size.width
          if (isPortrait === (orientation === 'portrait')) return true
          return orientation === 'portrait'
            ? 'Cette photo est en paysage : une photo en portrait (verticale) sera beaucoup moins recadrée.'
            : 'Cette photo est en portrait : une photo en paysage (horizontale) sera beaucoup moins recadrée.'
        })
        .warning(),
    ],
  })
}

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  // Listed in the order they appear on the page.
  fields: [
    editableImageField({
      name: 'saleCardImage',
      title: 'Soldes card — image',
      guidance:
        'Photo en portrait (verticale), idéalement 2000 px de large ou plus. Le titre « Soldes » s’affiche en blanc au centre : préférez une photo assez sombre ou unie au milieu.',
      minWidth: 1200,
      orientation: 'portrait',
    }),
    editableImageField({
      name: 'bestsellersCardImage',
      title: 'Bestsellers card — image',
      guidance:
        'Photo en portrait (verticale), idéalement 2000 px de large ou plus. Le titre « Bestsellers » s’affiche en blanc au centre : préférez une photo assez sombre ou unie au milieu.',
      minWidth: 1200,
      orientation: 'portrait',
    }),
    editableImageField({
      name: 'storyBannerImage',
      title: '"Notre histoire" banner — image',
      guidance:
        'Grande photo plein écran, en paysage (horizontale), idéalement 2400 px de large ou plus. Le texte s’affiche en blanc en haut à gauche : gardez cette zone assez calme. Sur mobile, l’image est recadrée en hauteur, donc le sujet doit être bien centré.',
      minWidth: 1920,
      orientation: 'landscape',
    }),
    editableImageField({
      name: 'newInCardImage',
      title: 'Nouveautés card — image',
      guidance:
        'Photo en portrait (verticale), idéalement 2000 px de large ou plus. Aucun texte par-dessus : une photo de produit porté fonctionne très bien.',
      minWidth: 1200,
      orientation: 'portrait',
    }),
    editableImageField({
      name: 'boutiqueVisitImage',
      title: 'Boutique visit — image',
      guidance:
        'Petite photo en portrait (verticale, format 4:5), 1200 px de large suffisent. Elle accompagne le texte sur la visite de la boutique à Uccle.',
      minWidth: 1000,
      orientation: 'portrait',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})
