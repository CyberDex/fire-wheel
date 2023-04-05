import { Assets, ResolverAssetsArray } from "@pixi/assets";
import { assetsManifest } from "../config/assets";
import { Spritesheet } from '@pixi/spritesheet';
import { BaseTexture } from "@pixi/core";
import emojiData from '../config/emoji.json';

/** Initialize and start background loading of all assets */
export async function initAssets() {
    // Init PixiJS assets with this asset manifest
    await Assets.init({ manifest: assetsManifest });

    // Load assets for the load screen
    await Assets.loadBundle('preload');

    // List all existing bundles names
    const allBundles = assetsManifest.bundles.map((item) => item.name);

    // Start up background loading of all bundles
    Assets.backgroundLoadBundle(allBundles);
}

export function isBundleLoaded(bundle: string) {
    const bundleManifest = assetsManifest.bundles.find((b) => b.name === bundle);

    if (!bundleManifest) {
        return false;
    }

    for (const asset of bundleManifest.assets as ResolverAssetsArray) {
        if (!Assets.cache.has(asset.name as string)) {
            return false;
        }
    }

    return true;
}

export function areBundlesLoaded(bundles: string[]) {
    for (const name of bundles) {
        if (!isBundleLoaded(name)) {
            return false;
        }
    }

    return true;
}

export async function initEmojis() {
    await Assets.loadBundle('emoji');

    const spritesheet = new Spritesheet(
        BaseTexture.from('emoji'),
        emojiData
    );

    await spritesheet.parse();
}