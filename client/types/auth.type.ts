export interface User {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "USER";
}

export interface AuthState {
      user: User | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      error: string | null;
}
