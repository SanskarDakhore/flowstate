export interface BootstrapConfig {
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  debugMode: boolean;
  targetFps: number;
}

function getImportMetaEnv(): Record<string, any> | undefined {
  try {
    return new Function('return import.meta.env')();
  } catch {
    return undefined;
  }
}

const env = getImportMetaEnv();

export const defaultBootstrapConfig: BootstrapConfig = {
  environment: env?.PROD ? 'production' : env?.MODE === 'staging' ? 'staging' : 'development',
  apiBaseUrl: (env?.VITE_API_BASE_URL as string) || 'http://localhost:3000/api/v1',
  debugMode: env?.PROD !== true,
  targetFps: 60,
};
