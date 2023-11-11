import { GET } from '../handler.ts';
import { Client, Project, Tag, TimeEntry, Workspace } from '../../types.ts';

export interface IUser {
	id: number
	api_token: string
	email: string
	fullname: string
	timezone: string
	toggl_accounts_id: string
	default_workspace_id: number
	beginning_of_week: number
	image_url: string
	created_at: string
	updated_at: string
	openid_email: any
	openid_enabled: boolean
	country_id: any
	has_password: boolean
	at: string
	intercom_hash: string
	tags: Tag[]
	clients: Client[]
	time_entries: TimeEntry[]
	projects: Project[]
	workspaces: Workspace[]
}

export default {
	auth(email: string, pass: string): Promise<Response> {
		return fetch('https://api.track.toggl.com/api/v9/me', {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${btoa(email + ':' + pass)}`
			}
		});
	},
	get(): Promise<Response> {
		return GET(`/me?with_related_data=true`);
	}
}