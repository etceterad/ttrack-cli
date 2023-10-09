import chalk from 'chalk';
import { Command } from 'commander';

import EntriesAPI from '../../api/entries';
import { useTable } from '../../composables/useTable.ts';

const ENTRY_KEYS = ['billable','start', 'stop', 'duration', 'description'];

export default new Command('entries')
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
            
            console.log(
                useTable(
                    ENTRY_KEYS.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
                    (entries as Record<string, unknown>[]).map((entry) =>
                        Object.entries(entry).reduce((acc, [key, value]) => {
                            if (ENTRY_KEYS.includes(key)) {
                                if (key === 'start' || key === 'stop') {
                                    value = new Date(value as string).toLocaleString();
                                }
                                if (key === 'duration' && !isNaN(+(value as string))) {
                                    value = new Date(+(value as string) * 1000)
                                        .toISOString()
                                        .slice(11, 19);
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
