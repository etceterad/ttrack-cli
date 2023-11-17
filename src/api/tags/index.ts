import { GET } from '../handler.ts';

export interface ITag {
    at: string;         // When the tag was created/last modified
    deleted_at: string; // When the tag was deleted
    id: number;         // Tag ID
    name: string;       // Tag name
    workspace_id: number; // Workspace ID
}

export default {
    get(workspaceId: number): Promise<Response> {
        return GET(`/workspaces/${workspaceId}/tags`);
    },
};
