// SetApiClient.ts

export class SetApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Bun automatically loads .env files
    this.apiKey = Bun.env.API_KEY || '';
    this.baseUrl = baseUrl || Bun.env.API_BASE_URL || '';
    console.log(this.apiKey, this.baseUrl);
    
    if (!this.apiKey) {
      throw new Error('API_KEY not found in environment variables');
    }
  }

  async callSetEndpoint<T = any>(data: T): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling set endpoint:', error);
      throw error;
    }
  }
}