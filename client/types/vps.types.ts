export interface Vps {
      id: string;
      name: string;
      status: "running" | "stopped" | "starting" | "stopping" | "restarting";
      ip: string;
      os: string;
      cpu: number;
      ram: number;
      storage: number;
      createdAt: string;
}

export interface VpsState {
      list: Vps[];
      selected: Vps | null;

      isLoading: boolean;
      isCreating: boolean;
      isDeleting: boolean;

      error: string | null;
}

export interface CreateVpsPayload {
      name: string;
      os: string;
      resources: {
            cpu: number;
            memory: number;
            storage: number;
      };
}

export interface UpdateVpsPayload {
      name?: string;
}
