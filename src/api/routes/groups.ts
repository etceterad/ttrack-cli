import { GET } from '../handler.ts';

export default {
    get(organizationId: number): Promise<Response> {
        return GET(`/organizations/${organizationId}/groups`);
    },
};
