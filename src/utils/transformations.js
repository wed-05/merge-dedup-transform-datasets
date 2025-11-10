'use strict';

/**
 * Item-level transform: normalise string fields.
 * - Trims whitespace
 * - Collapses multiple spaces
 * - For fields that look like a "name", lowercases them for better dedup hits.
 */
function normalizeStrings(item, context) {
  const clone = { ...item };
  const entries = Object.entries(clone);

  for (const [key, value] of entries) {
    if (typeof value === 'string') {
      let next = value.trim().replace(/\s+/g, ' ');
      if (/name/i.test(key)) {
        next = next.toLowerCase();
      }
      clone[key] = next;
    }
  }

  return clone;
}

/**
 * Collection-level transform: sort items by "id" ascending (lexicographically).
 */
function sortById(items, context) {
  if (!Array.isArray(items)) return [];
  const clone = items.slice();

  clone.sort((a, b) => {
    const aId =
      a && Object.prototype.hasOwnProperty.call(a, 'id') && a.id != null
        ? String(a.id)
        : '';
    const bId =
      b && Object.prototype.hasOwnProperty.call(b, 'id') && b.id != null
        ? String(b.id)
        : '';
    if (aId < bId) return -1;
    if (aId > bId) return 1;
    return 0;
  });

  return clone;
}

function identityItem(item) {
  return item;
}

function identityItems(items) {
  return Array.isArray(items) ? items : [];
}

/**
 * Resolve the configured pre- and post-transform names into functions.
 */
function getTransformFunctions(preName, postName) {
  const itemTransforms = {
    normalizeStrings,
  };

  const collectionTransforms = {
    sortById,
  };

  const preTransform =
    preName && itemTransforms[preName]
      ? itemTransforms[preName]
      : identityItem;

  const postTransform =
    postName && collectionTransforms[postName]
      ? collectionTransforms[postName]
      : identityItems;

  return { preTransform, postTransform };
}

module.exports = {
  normalizeStrings,
  sortById,
  identityItem,
  identityItems,
  getTransformFunctions,
};