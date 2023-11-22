import { select } from '@inquirer/prompts';
import chalk from 'chalk';

import UserAPI, { IUser } from '../api/routes/me.ts';
import { SimpleState } from '../types.ts';

type UseUserConfig = {
    workspaceId: Partial<SimpleState<number>>;
    projectId: Partial<SimpleState<number>>;
    organizationId: Partial<SimpleState<number>>;

    selectWorkspaceId: () => Promise<number>;
    selectProjectId: () => Promise<number>;
    resetConfig: () => Promise<void>;
    saveConfig: () => Promise<void>;
};

// TODO: think of a more complex caching system or third-party
const KEEP_ALIVE = 1000 * 120; // 3 mins

const UserInfoCache: { cached: number; userInfo?: IUser } = { cached: Date.now() };

type UserConfig = {
    workspaceId: Partial<SimpleState<number>>;
    projectId: Partial<SimpleState<number>>;
    organizationId: Partial<SimpleState<number>>;
}

const userConfigState: UserConfig = {
    workspaceId: {},
    projectId: {},
    organizationId: {}
}

export const useUserConfig = (): UseUserConfig => {
    const { workspaceId, projectId, organizationId } = userConfigState;
    workspaceId.value = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;
    projectId.value = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;
    organizationId.value = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;

    const getUserInfo = async (): Promise<IUser> => {
        if (!UserInfoCache.userInfo || UserInfoCache.cached - Date.now() > KEEP_ALIVE) {
            const userInfoRequest = await UserAPI.get();
            const userInfo = <IUser | null>await userInfoRequest.json();

            if (!userInfo) {
                console.log(chalk.red("Can't read the user info."));
                throw new Error("Can't read the user info.");
            }
            UserInfoCache.userInfo = userInfo;
            UserInfoCache.cached = Date.now();
        }
        return UserInfoCache.userInfo;
    };

    const selectWorkspaceId = async (): Promise<number> => {
        const { workspaces } = await getUserInfo();

        workspaceId.value = await select({
            message: 'Select a workspace:',
            choices: workspaces.map((workspace) => ({
                name: workspace.name,
                value: workspace.id,
            })),
        });

        const envContent = await Bun.file('.env').text();
        if (envContent.includes('WORKSPACE_ID')) {
            await Bun.write(
                '.env',
                envContent.replace(/WORKSPACE_ID=.*/, `WORKSPACE_ID=${workspaceId}`)
            );
        } else {
            await Bun.write('.env', envContent + `\nWORKSPACE_ID=${workspaceId}`);
        }

        return workspaceId.value;
    };

    const selectProjectId = async (): Promise<number> => {
        let { projects } = await getUserInfo();
        projects = projects.filter(({ workspace_id }) => workspace_id === workspaceId.value);
        
        if (!projects.length) {
            console.log(chalk.red('No projects found.'));
            throw new Error('No projects found.');
        }

        projectId.value = await select({
            message: 'Select a project:',
            choices: projects
                .filter(({ workspace_id }) => workspace_id === workspaceId.value)
                .map((project) => ({
                    name: project.name,
                    value: project.id,
                })),
        });

        const envContent = await Bun.file('.env').text();
        if (envContent.includes('PROJECT_ID')) {
            await Bun.write(
                '.env',
                envContent.replace(/PROJECT_ID=.*/, `PROJECT_ID=${workspaceId}`)
            );
        } else {
            await Bun.write('.env', envContent + `\nPROJECT_ID=${workspaceId}`);
        }

        return projectId.value;
    };

    const saveConfig = async () => {
        if (!workspaceId || !projectId) {
            throw new Error('No workspace or project id provided.');
        }

        let envContent = await Bun.file('.env').text();
        if (envContent.includes('PROJECT_ID')) {
            envContent = envContent.replace(/PROJECT_ID=.*/, `PROJECT_ID=${projectId}`);
        } else {
            envContent = envContent + `\nPROJECT_ID=${projectId}`;
        }
        if (envContent.includes('WORKSPACE_ID')) {
            envContent = envContent.replace(/WORKSPACE_ID=.*/, `WORKSPACE_ID=${workspaceId}`);
        } else {
            envContent = envContent + `\nWORKSPACE_ID=${workspaceId}`;
        }

        await Bun.write('.env', envContent);
    };

    const resetConfig = async () => {
        const envContent = await Bun.file('.env').text();
        await Bun.write('.env', envContent.replace(/(WORKSPACE_ID|PROJECT_ID)=.*\n?/, ''));
        workspaceId.value = undefined;
        projectId.value = undefined;
        UserInfoCache.userInfo = undefined;
    };

    return {
        workspaceId,
        projectId,
        organizationId,

        selectWorkspaceId,
        selectProjectId,
        resetConfig,
        saveConfig,
    };
};
