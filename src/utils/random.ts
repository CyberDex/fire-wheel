export function getRandomItem(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInRange(min: number, max: number): number {
    const fixMin = Math.min(min, max);
    const fixMax = Math.max(min, max);

    return Math.floor(Math.random() * (fixMax - fixMin) + fixMin)
}

export function getRandomBoolean(): boolean {
    return Math.random() >= 0.5;
} 