import { Command } from 'commander';
import { useUserConfig } from '../../composables/useUserConfig.ts';

export const groupsCommand = new Command('groups')
    .description('Manage your groups.')
    .action(async () => {
		let { organizationId } = useUserConfig();
		
		try {
		} catch (e) {
			console.log('ERROR!');
			console.log(e);
		}
	});
