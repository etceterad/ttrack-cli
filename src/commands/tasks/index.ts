import { Command } from 'commander';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';

import UserAPI, { IUser } from '../../api/me';
import TasksAPI from '../../api/tasks';
import { useTable } from '../../composables/useTable.ts';
import { ITogglTask } from './types.ts';

const TABLE_HEAD = ['name', 'active', 'estimated', 'assigned'];
const ENTRY_KEYS: (keyof ITogglTask)[] = ['name', 'active', 'estimated_seconds', 'user_id'];

// POSSIBLE OPERATIONS:
// - list all tasks :check:
// -- flags:
// --- --save-config: saves workspace and project id to .env
// --- -n: new config (resets the old one)
// - create a task
// - update a task

export const tasksCommand = new Command('tasks')
    .description('Manage tasks command.')
    .option('--save-config', 'Saves the selected choice.')
    .option('-n', 'Clears the saved config.')
    .action(async (options) => {
        try {
            let workspaceId: number | undefined = (Bun.env.WORKSPACE_ID && +Bun.env.WORKSPACE_ID) || undefined;
            let projectId: number | undefined = (Bun.env.PROJECT_ID && +Bun.env.PROJECT_ID) || undefined;

            if (options.n) {
				if (workspaceId && projectId) {
					const envContent = await Bun.file('.env').text();
					await Bun.write('.env', envContent.replace(/(WORKSPACE_ID|PROJECT_ID)=.*\n?/, ''));
				}
				
				const userInfoRequest = await UserAPI.get();
				const userInfo = <IUser | null>(await userInfoRequest.json());
				
				if (!userInfo) {
					console.log(chalk.red('Invalid credentials.'));
					return;
				}
				
				workspaceId = await select({
					message: 'Select a workspace:',
					choices: userInfo.workspaces.map((workspace) => ({
						name: workspace.name,
						value: workspace.id,
					})),
				});
				
				projectId = await select({
					message: 'Select a project:',
					choices: userInfo.projects
						.filter(({ workspace_id }) => workspace_id === workspaceId)
						.map((project) => ({
							name: project.name,
							value: project.id,
						})),
				});
            }
			
			if (!workspaceId || !projectId) {
				console.log(chalk.red('No workspace or project selected.'));
				return;
			}
			
			if (options.saveConfig) {
				const envContent = await Bun.file('.env').text();
				await Bun.write('.env', envContent + `\nWORKSPACE_ID=${workspaceId}\nPROJECT_ID=${projectId}`);
			}

            const tasksRequest = await TasksAPI.get({ workspaceId, projectId });
            const tasks = (await tasksRequest.json()) as ITogglTask[];

            console.log(
                useTable(
                    TABLE_HEAD.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
                    tasks.map((task) =>
                        ENTRY_KEYS.map((key) => {
                            let value = task[key];
                            if (value === 'null') {
                                return '---';
                            }
                            if (key === 'estimated_seconds' && typeof value === 'number') {
                                value = value ? `${value / 60}m` : 'No';
                            } else if (key === 'user_id') {
                                value = value ? 'Yes' : 'No';
                            }
                            return value;
                        })
                    ),
                    undefined,
                    {
                        headerColor: 'blue',
                    }
                )
            );
        } catch (e) {
            console.log(chalk.red.bold('ERROR!'));
            console.log(e);
        }
    });
