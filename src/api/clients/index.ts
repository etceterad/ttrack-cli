import { GET } from '../handler.ts';

export interface Client {
    archived: boolean;
    at: string;
    id: number;
    name: string;
    server_deleted_at: string | null;
    wid: number;
}

export default {
    get(workspaceId: number): Promise<Response> {
        return GET(`/workspaces/${workspaceId}/clients`);
    },
};
