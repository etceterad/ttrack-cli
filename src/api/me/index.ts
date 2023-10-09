export default {
	get(email: string, pass: string): Promise<Response> {
		return fetch('https://api.track.toggl.com/api/v9/me', {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${btoa(email + ':' + pass)}`
			}
		});
	}
}