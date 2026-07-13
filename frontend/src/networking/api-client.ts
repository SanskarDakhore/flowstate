import { HealthCheckResponse } from '@flowstate/shared';
import { API_ROUTES } from './api-routes';
import { RequestBuilder } from './request-builder';
import { ResponseHandler } from './response-handler';
import { defaultBootstrapConfig } from '../core/bootstrap/bootstrap-config';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = defaultBootstrapConfig.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  public async getHealth(): Promise<HealthCheckResponse> {
    const builder = new RequestBuilder(this.baseUrl, API_ROUTES.HEALTH);
    const req = builder.buildGet();
    const res = await fetch(req.url, req.init);
    return ResponseHandler.parse<HealthCheckResponse>(res);
  }
}
