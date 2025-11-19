export interface Message {
  text: string;
  type: 'success' | 'error' | 'info' | '';
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  username?: string;
}