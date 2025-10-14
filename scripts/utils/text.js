/**
 * Get initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} - The initials
 */
export function getInitials(name, maxLength = 1) {
    if (!name) return '';
    return name.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, maxLength) // Take only first initial
        .join('');
}