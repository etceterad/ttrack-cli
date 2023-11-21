import { Command } from 'commander';

import { useUserConfig } from '../../composables/useSelectWorkspace.ts';
import TagsAPI, { ITag } from '../../api/routes/tags.ts';
import { useTable } from '../../composables/useTable.ts';
import chalk from 'chalk';

const TABLE_HEAD: (keyof ITag | 'deleted')[] = ['name', 'deleted'];

export const tagsCommand = new Command('tags').description('Manage your tags.').action(async () => {
    try {
        let { workspaceId, selectWorkspaceId } = useUserConfig();

        if (!workspaceId) {
            workspaceId = await selectWorkspaceId();
        }

        const tagsRequest = await TagsAPI.get(workspaceId);
        const tags = <ITag[] | null>await tagsRequest.json();
        
        if (!tags) {
            console.log(chalk.blue('No entries.'));
            return;
        }
        
        console.log(
            useTable(
                TABLE_HEAD.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
                tags.map((tag) =>
                    TABLE_HEAD.map((key) => {
                        switch (key) {
                            case 'deleted':
                                return tag['deleted_at'] ? chalk.red('Yes') : 'No';
                            default:
                                return tag[key];
                        }
                    })
                )
            )
        );
    } catch (e) {
        console.error('ERROR!');
        console.error(e);
    }
});
