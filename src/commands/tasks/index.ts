import { Command } from 'commander';
import chalk from 'chalk';

import TasksAPI from '../../api/tasks';
import { useTable } from '../../composables/useTable.ts';
import { ITogglTask } from './types.ts';
import { useUserConfig } from '../../composables/useSelectWorkspace.ts';

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
            let {
                workspaceId,
                projectId,
                selectWorkspaceId,
                selectProjectId,
                resetConfig,
                saveConfig,
            } = useUserConfig();

            if (options.n) {
                if (workspaceId || projectId) {
                    await resetConfig();
                    workspaceId = undefined;
                    projectId = undefined;
                }
            }

            if (!workspaceId || !projectId) {
                workspaceId = await selectWorkspaceId();
                projectId = await selectProjectId();
            }

            if (options.saveConfig) {
                await saveConfig();
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
