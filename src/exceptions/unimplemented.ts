export class UnimplementedFeatureException extends Error {
  public constructor(key: string) {
    super(`Feature ${key} has not been implemented yet.`);
  }
}
