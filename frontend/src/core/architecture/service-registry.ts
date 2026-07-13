import { Service } from './service';

export class ServiceRegistry {
  private services = new Map<string, Service>();

  public register<T extends Service>(service: T): T {
    if (this.services.has(service.serviceName)) {
      console.warn(`[ServiceRegistry] Service ${service.serviceName} already registered. Overwriting.`);
    }
    this.services.set(service.serviceName, service);
    return service;
  }

  public get<T extends Service>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`[ServiceRegistry] Service '${name}' not found.`);
    }
    return service as T;
  }

  public has(name: string): boolean {
    return this.services.has(name);
  }

  public async clear(): Promise<void> {
    for (const service of this.services.values()) {
      if (service.dispose) {
        await service.dispose();
      }
    }
    this.services.clear();
  }
}
