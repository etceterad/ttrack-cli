#! /usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';
import { entriesCommand } from '../src/commands/entries';
import { authCommand, logoutCommand } from '../src/commands/auth';
import { tasksCommand } from '../src/commands/tasks';
import { clientsCommand } from '../src/commands/clients';
import { tagsCommand } from '../src/commands/tags';

const ttrack = new Command();

ttrack
	.name('ttrack')
	.description('TTrack CLI for jerks who don\'t want to use the web interface.')
	.action(() => {
		console.log(chalk.blueBright('TTrack CLI'));
	})
	.version('0.1.0')
	.addCommand(authCommand)
	.addCommand(logoutCommand)
	.addCommand(tasksCommand)
	.addCommand(clientsCommand)
	.addCommand(tagsCommand)
	.addCommand(entriesCommand);

ttrack.parse();