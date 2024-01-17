import { writable } from "svelte/store";

export type Mods = {
	name: string;
	full_name: string;
	owner: string;
	package_url: string;
	donation_link: string;
	date_created: string;
	date_updated: string;
	uuid4: string;
	rating_score: string;
	is_pinned: boolean;
	is_deprecated: boolean;
	has_nsfw_content: boolean;
	categories: string[];
	versions: ModVersion[];
};

export type ModVersion = {
	name: string;
	full_name: string;
	description: string;
	icon: string;
	version_number: string;
	dependencies: string[];
	download_url: string;
	downloads: number;
	date_created: string;
	website_url: string;
	is_active: boolean;
	uuid4: string;
	file_size: number;
};

export const modList = writable<Mods[]>([]);
