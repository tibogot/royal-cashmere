import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'shopName',
      title: 'Shop name',
      type: 'string',
      initialValue: 'Royal Cashmere',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. Fine cashmere, crafted for Brussels',
    }),
    defineField({
      name: 'description',
      title: 'About the shop',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({name: 'street', title: 'Street', type: 'string'}),
        defineField({name: 'postalCode', title: 'Postal code', type: 'string'}),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          initialValue: 'Brussels',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'Belgium',
          readOnly: true,
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({name: 'website', title: 'Website', type: 'url'}),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'days',
              title: 'Days',
              type: 'string',
              description: 'e.g. Mon–Sat',
            }),
            defineField({
              name: 'hours',
              title: 'Hours',
              type: 'string',
              description: 'e.g. 10:00 – 18:30',
            }),
          ],
          preview: {
            select: {title: 'days', subtitle: 'hours'},
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'pinterest', title: 'Pinterest', type: 'url'}),
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Default meta title',
          type: 'string',
          description: 'Used when an article has no custom SEO title',
        }),
        defineField({
          name: 'description',
          title: 'Default meta description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site settings'}
    },
  },
})
