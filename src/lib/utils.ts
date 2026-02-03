export function normalizeUtcOffset(offset: string | number): string {
    if (typeof offset === 'number') {
        const sign = offset >= 0 ? '+' : '-';
        const absOffset = Math.abs(offset);
        const hours = Math.floor(absOffset);
        const minutes = (absOffset % 1) * 60;
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // If it's a string, try to parse it
    // Handle "+8", "-6", "8", "-8" cases
    if (/^[+-]?\d+(\.\d+)?$/.test(offset)) {
        const num = parseFloat(offset);
        return normalizeUtcOffset(num);
    }

    // Return as-is if it likely matches standard format (or let it fail later if invalid)
    return offset;
}
