export interface Service {
  readonly serviceName: string;
  initialize(): Promise<void> | void;
  dispose?(): Promise<void> | void;
}
