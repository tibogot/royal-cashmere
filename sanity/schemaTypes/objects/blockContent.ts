import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
              defineField({
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              }),
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Article link',
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                to: [{type: 'article'}],
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
  ],
})
