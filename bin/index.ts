#! /usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';
import entries from '../src/commands/entries';
import me from '../src/commands/auth';

const ttrack = new Command();

ttrack
	.name('ttrack')
	.description('TTrack CLI for jerks who don\'t want to use the web interface.')
	.action(() => {
		console.log(chalk.blueBright('TTrack CLI'));
	})
	.version('0.1.0')
	.addCommand(me)
	.addCommand(entries);

ttrack.parse();