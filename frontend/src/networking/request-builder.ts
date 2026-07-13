export class RequestBuilder {
  private url: string;
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  private body?: string;

  constructor(baseUrl: string, path: string) {
    this.url = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  public setAuthToken(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  public setBody(data: any): this {
    this.body = JSON.stringify(data);
    return this;
  }

  public buildGet(): { url: string; init: RequestInit } {
    return {
      url: this.url,
      init: { method: 'GET', headers: this.headers },
    };
  }

  public buildPost(): { url: string; init: RequestInit } {
    return {
      url: this.url,
      init: { method: 'POST', headers: this.headers, body: this.body },
    };
  }
}
