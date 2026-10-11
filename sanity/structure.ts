import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Royal Cashmere')
    .items([
      S.listItem()
        .title('Articles')
        .schemaType('article')
        .child(S.documentTypeList('article').title('Articles')),
      S.divider(),
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings'),
        ),
    ])
