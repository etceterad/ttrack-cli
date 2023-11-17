import { Command } from 'commander';
import chalk from 'chalk';

import ClientsAPI, { Client } from '../../api/clients';
import { useUserConfig } from '../../composables/useSelectWorkspace.ts';
import { useTable } from '../../composables/useTable.ts';

const TABLE_HEAD: (keyof Client)[] = ['name', 'archived'];

export const clients = new Command('clients')
    .description('Manage your clients.')
    .action(async () => {
        try {
            let { workspaceId, selectWorkspaceId } = useUserConfig();

            if (!workspaceId) {
                workspaceId = await selectWorkspaceId();
            }

            const clientsRequest = await ClientsAPI.get(workspaceId);
            const clients = <Client[] | null>await clientsRequest.json();

            if (!clients) {
                console.log(chalk.red('Invalid credentials.'));
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
