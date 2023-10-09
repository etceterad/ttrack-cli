import { GET } from '../handler.ts';

export default {
	get(): Promise<Response> {
		return GET('/me/time_entries');
	}
}