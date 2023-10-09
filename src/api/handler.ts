import chalk from 'chalk';

const checkStatus = (): void => {
	if (Bun.env.API_TOKEN) return;
	console.log(chalk.red.bold('You need to authorize first. Please use the command "ttrack auth <email> <password>" to authorize.'));
	throw new Error('No API token found.');
}

export const GET = (path: string): Promise<Response> => {
	checkStatus();
	return fetch(Bun.env.API_BASE_URL + path, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${ btoa(`${ Bun.env.API_TOKEN }:api_token`) }`
		}
	})
}

export const POST = <T>(path: string, data: T): Promise<Response> => {
	checkStatus();
	return fetch(Bun.env.API_BASE_URL + path, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${ btoa(`${ Bun.env.API_TOKEN }:api_token`) }`
		}
	})
}