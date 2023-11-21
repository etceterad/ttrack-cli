import { select } from '@inquirer/prompts';
import chalk from 'chalk';

import UserAPI, { IUser } from '../api/routes/me.ts';

type UseUserConfig = {
    workspaceId?: number;
    projectId?: number;

    selectWorkspaceId: () => Promise<number>;
    selectProjectId: () => Promise<number>;
    resetConfig: () => Promise<void>;
    saveConfig: () => Promise<void>;
};

// TODO: think of a more complex caching system or third-party
const KEEP_ALIVE = 1000 * 120; // 3 mins

const UserInfoCache: { cached: number; userInfo?: IUser } = { cached: Date.now() };

export const useUserConfig = (): UseUserConfig => {
    let workspaceId = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;
    let projectId = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;

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

        workspaceId = await select({
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

        return workspaceId;
    };

    const selectProjectId = async (): Promise<number> => {
        const { projects } = await getUserInfo();

        projectId = await select({
            message: 'Select a project:',
            choices: projects
                .filter(({ workspace_id }) => workspace_id === workspaceId)
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

        return projectId;
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
        workspaceId = undefined;
        projectId = undefined;
        UserInfoCache.userInfo = undefined;
    };

    return {
        workspaceId,
        projectId,

        selectWorkspaceId,
        selectProjectId,
        resetConfig,
        saveConfig,
    };
};
