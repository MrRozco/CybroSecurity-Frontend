export function formatAuthorName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return '';
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0];
  }

  const lastName = parts[parts.length - 1];
  const leadingNames = parts.slice(0, -1).join(' ');

  return `${leadingNames} ${lastName.charAt(0).toUpperCase()}.`;
}