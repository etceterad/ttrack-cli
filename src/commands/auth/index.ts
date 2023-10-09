import { Command } from 'commander';
import chalk from 'chalk';
import { input, password as passwordInput } from '@inquirer/prompts';

import UserAPI, { IUser } from '../../api/me';

export default new Command('auth')
	.description('Authorizes the user.')
	.action(async () => {
		try {
			const email = await input({ message: 'your email:' })
			const pass = await passwordInput({ message: 'your pass:',  })
			
			const response = await UserAPI.get(email, pass);
			const res = await response.json() as IUser;
			
			const envContent = await Bun.file('.env').text();
			await Bun.write('.env', envContent + `\nAPI_TOKEN=${res.api_token}`);
			
			console.log(chalk.green.bold('You are now authorized.'));
		} catch (e) {
			console.log(chalk.red.bold('ERROR!'));
			console.log(e);
		}
	})