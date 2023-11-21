import { GET } from '../handler.ts';

export type GetTasksParams = {
    workspaceId: number;
    projectId: number;
};

export default {
    get({ workspaceId, projectId }: GetTasksParams): Promise<Response> {
        return GET(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
    },
};
