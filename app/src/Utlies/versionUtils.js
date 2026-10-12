/**
 * Parse version string to [major, minor, patch] (numbers).
 * Handles "1.0.0", "1.0", "1" and ignores non-numeric suffixes.
 */
function parseVersion(version) {
  if (!version || typeof version !== 'string') return [0, 0, 0];
  const parts = version.trim().replace(/[^0-9.]/g, '').split('.');
  return [
    parseInt(parts[0], 10) || 0,
    parseInt(parts[1], 10) || 0,
    parseInt(parts[2], 10) || 0,
  ];
}

/**
 * Returns true if latestVersion is greater than currentVersion.
 * Returns false if either is invalid or latest <= current.
 */
export function isUpdateRequired(latestVersion, currentVersion) {
  if (!latestVersion || !String(latestVersion).trim()) return false;
  const latest = parseVersion(String(latestVersion));
  const current = parseVersion(String(currentVersion));
  for (let i = 0; i < 3; i++) {
    if (latest[i] > current[i]) return true;
    if (latest[i] < current[i]) return false;
  }
  return false;
}
