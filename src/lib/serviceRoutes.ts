export function serviceSlug(service: string) {
  return service
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function serviceHref(groupSlug: string, service: string) {
  return `/services/${groupSlug}/${serviceSlug(service)}`;
}

export function categoryHref(groupSlug: string) {
  return `/services/${groupSlug}`;
}
