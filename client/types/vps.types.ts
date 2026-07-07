export interface Vps {
      id: string;
      name: string;
      status: "RUNNING" | "STOPPED" | "STARTING" | "STOPPING" | "RESTARTING";
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
      region: string;
      image: string;
      plan: string;
}

export interface UpdateVpsPayload {
      name?: string;
}
