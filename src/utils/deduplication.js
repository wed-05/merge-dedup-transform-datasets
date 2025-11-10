'use strict';

/**
 * Safely read nested value from an object using dot notation.
 * Example: getNestedValue(obj, 'user.address.city')
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Build a stable deduplication key based on configured fields.
 * If no fields are provided, fall back to the whole object.
 */
function buildKey(item, dedupFields) {
  if (!dedupFields || dedupFields.length === 0) {
    return JSON.stringify(item);
  }

  const parts = dedupFields.map((field) => {
    const value = getNestedValue(item, field);
    const serialised =
      value === undefined ? '∅' : JSON.stringify(value);
    return `${field}=${serialised}`;
  });

  return parts.join('|');
}

/**
 * Deduplicate items based on the key built from dedupFields.
 * Returns unique items, duplicates, and simple stats.
 */
function deduplicate(items, dedupFields) {
  const seen = new Map();
  const unique = [];
  const duplicates = [];

  const stats = {
    inputCount: Array.isArray(items) ? items.length : 0,
    outputCount: 0,
    duplicateCount: 0,
  };

  if (!Array.isArray(items)) {
    return { items: [], duplicates: [], stats };
  }

  for (const item of items) {
    const key = buildKey(item, dedupFields);
    if (seen.has(key)) {
      duplicates.push(item);
      stats.duplicateCount += 1;
    } else {
      seen.set(key, true);
      unique.push(item);
    }
  }

  stats.outputCount = unique.length;
  return { items: unique, duplicates, stats };
}

module.exports = {
  getNestedValue,
  buildKey,
  deduplicate,
};