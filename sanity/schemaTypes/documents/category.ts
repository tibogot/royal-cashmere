import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // `title` stays the French name (the slug is built from it); these are
    // the names shown on the Dutch and English site. Empty falls back to it.
    defineField({
      name: 'titleTranslations',
      title: 'Title — translations',
      type: 'internationalizedArrayString',
      description: 'Nom de la catégorie en néerlandais et en anglais.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description shown on category pages',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
