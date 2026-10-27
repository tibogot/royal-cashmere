import {defineField, defineType} from 'sanity'

const cardImageFields = [
  defineField({
    name: 'alt',
    title: 'Alternative text',
    type: 'string',
    description: 'Short description of the photo, for accessibility and SEO',
  }),
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'saleCardImage',
      title: 'Soldes card — image',
      type: 'image',
      description:
        'Leave empty to use the default photo. Set the hotspot to choose which part stays visible when the card is cropped.',
      options: {hotspot: true},
      fields: cardImageFields,
    }),
    defineField({
      name: 'bestsellersCardImage',
      title: 'Bestsellers card — image',
      type: 'image',
      description:
        'Leave empty to use the default photo. Set the hotspot to choose which part stays visible when the card is cropped.',
      options: {hotspot: true},
      fields: cardImageFields,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})
