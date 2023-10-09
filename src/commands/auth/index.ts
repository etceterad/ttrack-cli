import { Command } from 'commander';
import chalk from 'chalk';

import UserAPI from '../../api/me';

export default new Command('auth')
	.description('Authorizes the user.')
	.argument('<email>', 'Your email')
	.argument('<pass>', 'Your password')
	.action(async (email, pass) => {
		try {
			const response = await UserAPI.get(email, pass);
			const res = await response.json();
			
			const envContent = await Bun.file('.env').text();
			await Bun.write('.env', envContent + `\nAPI_TOKEN=${res.api_token}`);
			
			console.log(chalk.green.bold('You are now authorized.'));
		} catch (e) {
			console.log(e);
			console.log(chalk.red.bold('Something went wrong.'));
		}
	})