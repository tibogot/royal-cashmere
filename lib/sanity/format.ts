const dateFormatter = new Intl.DateTimeFormat("fr-BE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatArticleDate(value: string) {
  return dateFormatter.format(new Date(value));
}
