import {
  UnifiedPresentationProfile,
  UNIFIED_LIVING_VALLEY_PROFILE,
  UNIFIED_CRYSTAL_CAVERNS_PROFILE,
} from './presentation-profile';

export class PresentationProfileRegistry {
  private profiles: Map<string, UnifiedPresentationProfile> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(UNIFIED_LIVING_VALLEY_PROFILE);
    this.register(UNIFIED_CRYSTAL_CAVERNS_PROFILE);
  }

  public register(profile: UnifiedPresentationProfile): boolean {
    if (!this.validate(profile)) {
      console.warn('[PresentationProfileRegistry] Rejected invalid profile registration:', profile);
      return false;
    }
    this.profiles.set(profile.id, profile);
    return true;
  }

  public remove(profileId: string): boolean {
    return this.profiles.delete(profileId);
  }

  public has(profileId: string): boolean {
    return this.profiles.has(profileId);
  }

  public get(profileId: string): UnifiedPresentationProfile | null {
    return this.profiles.get(profileId) ?? null;
  }

  public validate(profile: UnifiedPresentationProfile): boolean {
    if (!profile || typeof profile.id !== 'string' || !profile.id) return false;
    if (!profile.player || !profile.camera || !profile.environment || !profile.global) return false;
    if (typeof profile.global.presentationIntensity !== 'number') return false;
    return true;
  }

  public list(): string[] {
    return Array.from(this.profiles.keys());
  }

  public clear(): void {
    this.profiles.clear();
  }

  public resetToDefaults(): void {
    this.clear();
    this.registerDefaults();
  }
}
