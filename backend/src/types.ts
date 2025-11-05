
export interface User {
  id?: string;
  email: string;
  displayName: string;
  passwordHash?: string;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  fee: number;
  organizerName: string;
  contactInfo?: string;
  // In a real app, these would be securely hashed on the backend.
  // For this frontend-only demo, they are stored as plain text.
  editPasswordHash: string; 
}
