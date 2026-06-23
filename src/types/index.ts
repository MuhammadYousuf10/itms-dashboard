// Global Application Types & Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer' | string;
}

// Add future backend entity types here
export interface Violation {
  id: string;
  plateNumber: string;
  speed: number;
  speedLimit: number;
  timestamp: string;
  imageUrl: string;
}
