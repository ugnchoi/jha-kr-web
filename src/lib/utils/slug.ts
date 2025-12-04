export type RouteSlugValue = string | string[] | undefined | null;

export type SlugDocument = {
  slug?: string | null;
};

const pickSlug = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length ? normalized : null;
};

export const normalizeSlugParam = (value: RouteSlugValue): string | null => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const normalized = pickSlug(entry);

      if (normalized) {
        return normalized;
      }
    }

    return null;
  }

  return pickSlug(value);
};

export const buildStaticSlugParams = (items?: SlugDocument[] | null) => {
  if (!items?.length) {
    return [];
  }

  return items.reduce<{ slug: string }[]>((acc, item) => {
    const normalized = normalizeSlugParam(item?.slug);

    if (normalized) {
      acc.push({ slug: normalized });
    }

    return acc;
  }, []);
};

