export interface ITogglTask {
	active: boolean;
	at: string;
	estimated_seconds: number | null;
	id: number;
	name: string;
	project_id: number;
	recurring: boolean;
	server_deleted_at: string | null;
	tracked_seconds: number;
	user_id: number | null;
	workspace_id: number;
}