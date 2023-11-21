import chalk from 'chalk';
import { Command } from 'commander';

import EntriesAPI from '../../api/routes/entries.ts';
import { useTable } from '../../composables/useTable.ts';

const ENTRY_KEYS = ['billable','start', 'stop', 'duration', 'description'];

export const entriesCommand = new Command('entries')
    .description('Manage your entries.')
    .option('-a', 'Display all entries')
    .option('-l', 'Last entry')
    .action(async (options) => {
        try {
            if (!options.a && !options.l) {
                console.log(chalk.red.bold('Specify the amount'));
                return;
            }
            const response = await EntriesAPI.get();
            const entries = await response.json();
            
            if (!entries) {
                console.log(chalk.blue('No entries.'));
                return;
            }
            
            console.log(
                useTable(
                    ENTRY_KEYS.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
                    (entries as Record<string, unknown>[]).map((entry) =>
                        Object.entries(entry).reduce((acc, [key, value]) => {
                            if (ENTRY_KEYS.includes(key)) {
                                switch(key) {
                                    case 'billable':
                                        value = value ? chalk.green('Yes') : 'No';
                                        break;
                                    case 'stop':
                                    case 'start':
                                            value = new Date(value as string).toLocaleString();
                                            break;
                                    case 'duration': {
                                        if (typeof value === 'number') {
                                            value = new Date(value * 1000)
                                                .toISOString()
                                                .slice(11, 19);
                                        }
                                        break;
                                    }
                                }
                                acc.push(value);
                            }
                            return acc;
                        }, [] as unknown[])
                    ),
                    undefined,
                    {
                        headerColor: 'blue',
                    }
                )
            );
        } catch (e) {
            if (!(e as Error)?.message.includes('No API token found')) {
                console.error('ERROR!');
                console.error(e);
            }
        }
    });
