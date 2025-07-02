// Security utilities for the application

// Simple encryption/decryption using browser's SubtleCrypto API
class SecurityManager {
  private static readonly STORAGE_PREFIX = 'secure_';
  private static readonly KEY_LENGTH = 256;

  // Validate API key format (basic validation)
  static validateApiKey(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') return false;
    
    // Basic Alpha Vantage API key validation - typically 16 characters alphanumeric
    const apiKeyPattern = /^[A-Z0-9]{8,20}$/;
    return apiKeyPattern.test(apiKey.trim());
  }

  // Sanitize external API data to prevent XSS
  static sanitizeApiData(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeApiData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const sanitizedKey = this.sanitizeApiData(key);
        sanitized[sanitizedKey] = this.sanitizeApiData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  // Validate numeric data from API
  static validateNumericData(value: any): number | null {
    if (value === null || value === undefined) return null;
    
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
  }

  // Secure storage for sensitive data
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      // For demo purposes, using base64 encoding. 
      // In production, consider using Web Crypto API for actual encryption
      const encoded = btoa(value);
      localStorage.setItem(this.STORAGE_PREFIX + key, encoded);
    } catch (error) {
      console.error('Failed to store secure item:', error);
      throw new Error('Storage operation failed');
    }
  }

  static getSecureItem(key: string): string | null {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (!item) return null;
      
      return atob(item);
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  }

  static removeSecureItem(key: string): void {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Failed to remove secure item:', error);
    }
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = [];
    
    return {
      canMakeRequest(): boolean {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Remove old requests outside the window
        while (requests.length > 0 && requests[0] < windowStart) {
          requests.shift();
        }
        
        if (requests.length >= maxRequests) {
          return false;
        }
        
        requests.push(now);
        return true;
      },
      
      getTimeUntilNextRequest(): number {
        if (requests.length < maxRequests) return 0;
        
        const oldestRequest = requests[0];
        const windowStart = Date.now() - windowMs;
        return Math.max(0, oldestRequest - windowStart);
      }
    };
  }

  // Content Security Policy helper for dynamic styles
  static createSecureStyleContent(styles: Record<string, any>): string {
    const allowedProperties = [
      'color', 'background-color', 'border-color', 'fill', 'stroke',
      'opacity', 'transform', 'transition', 'animation'
    ];
    
    let secureStyles = '';
    
    for (const [selector, rules] of Object.entries(styles)) {
      // Sanitize selector
      const safeSelector = selector.replace(/[<>"']/g, '');
      secureStyles += `${safeSelector} {\n`;
      
      if (typeof rules === 'object') {
        for (const [property, value] of Object.entries(rules)) {
          // Only allow safe CSS properties
          if (allowedProperties.includes(property) && typeof value === 'string') {
            const safeValue = String(value).replace(/[<>"']/g, '');
            secureStyles += `  ${property}: ${safeValue};\n`;
          }
        }
      }
      
      secureStyles += '}\n';
    }
    
    return secureStyles;
  }
}

export default SecurityManager;