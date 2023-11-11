// TODO: sort out the interfaces to dedicated models
export interface Project {
	id: number
	workspace_id: number
	client_id: number
	name: string
	is_private: boolean
	active: boolean
	at: string
	created_at: string
	server_deleted_at: any
	color: string
	billable: boolean
	template: boolean
	auto_estimates: boolean
	estimated_hours: any
	rate: any
	rate_last_updated: any
	currency: any
	recurring: boolean
	recurring_parameters: any
	fixed_fee: any
	actual_hours: number
	actual_seconds: number
	wid: number
	cid: number
}

export interface Workspace {
	id: number
	organization_id: number
	name: string
	profile: number
	premium: boolean
	business_ws: boolean
	admin: boolean
	role: string
	suspended_at: any
	server_deleted_at: any
	default_hourly_rate: any
	rate_last_updated: any
	default_currency: string
	only_admins_may_create_projects: boolean
	only_admins_may_create_tags: boolean
	only_admins_see_billable_rates: boolean
	only_admins_see_team_dashboard: boolean
	projects_billable_by_default: boolean
	reports_collapse: boolean
	rounding: number
	rounding_minutes: number
	api_token: any
	at: string
	logo_url: string
	ical_url: string
	ical_enabled: boolean
	csv_upload: any
	subscription: any
	working_hours_in_minutes: any
}

export interface TimeEntry {
	id: number
	workspace_id: number
	project_id: number
	task_id: any
	billable: boolean
	start: string
	stop: string
	duration: number
	description: string
	tags: any[]
	tag_ids: any[]
	duronly: boolean
	at: string
	server_deleted_at: any
	user_id: number
	uid: number
	wid: number
	pid: number
}

export interface Root {
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

export interface Tag {
	id: number
	workspace_id: number
	name: string
	at: string
}

export interface Client {
	id: number
	wid: number
	archived: boolean
	name: string
	at: string
}