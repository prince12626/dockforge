export interface Vps {
      _id: string;
      userId: string;
      name: string;
      status: "running" | "stopped" | "creating" | "error";
      os: string;
      container: {
            id: string;
            name: string;
            image: string;
      };
      resources: {
            cpu: number;
            memory: number;
            storage: number;
      };
      lastStartedAt: string;
      createdAt: string;
      updatedAt: string;
      runtime: {
            running: boolean;
            status: string;
            pid: number;
            startedAt: string;
            finishedAt: string;
            exitCode: number;
            restarting: boolean;
            oomKilled: boolean;
            paused: boolean;
      };
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
