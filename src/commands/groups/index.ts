import { Command } from 'commander';

export const groupsCommand = new Command('groups')
    .description('Manage your groups.')
    .action(async () => {});
