export function getRandomItem(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomBoolean(): boolean {
    return Math.random() >= 0.5;
}