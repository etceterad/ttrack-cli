import { Command } from 'commander';
import chalk from 'chalk';

import ClientsAPI, { Client } from '../../api/routes/clients.ts';
import { useUserConfig } from '../../composables/useUserConfig.ts';
import { useTable } from '../../composables/useTable.ts';

const TABLE_HEAD: (keyof Client)[] = ['name', 'archived'];

export const clientsCommand = new Command('clients')
    .description('Manage your clients.')
    .action(async () => {
        try {
            const { workspaceId, selectWorkspaceId } = useUserConfig();

            if (!workspaceId.value) {
                await selectWorkspaceId();
            }

            if (!workspaceId.value) {
                console.log(chalk.red('No workspace selected.'));
                return;
            }
            
            const clientsRequest = await ClientsAPI.get(workspaceId.value);
            const clients = <Client[] | null>await clientsRequest.json();

            if (!clients) {
                console.log(chalk.blue('No entries.'));
                return;
            }

            console.log(
                useTable(
                    TABLE_HEAD.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
                    clients.map((client) =>
                        TABLE_HEAD.map((key) => {
                            switch (key) {
                                case 'archived':
                                    return client[key] ? chalk.red('Yes') : 'No';
                                default:
                                    return client[key];
                            }
                        })
                    ),
                    undefined,
                    { headerColor: 'blue' }
                )
            );
        } catch (e) {
            console.error('ERROR!');
            console.error(e);
        }
    });
