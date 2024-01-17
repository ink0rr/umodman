<script lang="ts">
	import { browser } from "$app/environment";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { join } from "@tauri-apps/api/path";
	import { open } from "@tauri-apps/api/shell";
	import { Play, Settings } from "lucide-svelte";
	import { ModeWatcher } from "mode-watcher";
	import * as Dialog from "~/components/ui/dialog";
	import { Link } from "~/components/ui/link";
	import { Toaster } from "~/components/ui/sonner";
	import { APP_DATA_DIR } from "~/constants";

	import "../app.pcss";

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});

	let dialogOpen = false;

	const launchGame = async () => {
		dialogOpen = true;
		// TODO: Support multiple games and profiles
		const doorstopTarget = await join(
			APP_DATA_DIR,
			"lethal-company/profiles/Default/BepInEx/core/BepInEx.Preloader.dll",
		);
		await open(`steam://run/1966720//--doorstop-enable true --doorstop-target "${doorstopTarget}"`);
		dialogOpen = false;
	};
</script>

<Toaster />
<ModeWatcher />

<QueryClientProvider {client}>
	<main class="flex h-screen flex-row">
		<section class="flex h-screen w-60 flex-col gap-2 border-r p-4">
			<span class="text-xl font-bold">Game</span>
			<div class="mx-2">
				<button
					class="flex w-full flex-row items-center gap-2 rounded px-2 py-1 font-medium text-gray-600 hover:bg-primary-foreground disabled:bg-gray-700 dark:text-gray-200"
					on:click={launchGame}
				>
					<Play class="h-5 w-5" />
					Launch
				</button>
			</div>
			<span class="font-bold">Mods</span>
			<div class="mx-2 flex flex-col">
				<Link href="/installed-mods">Installed</Link>
				<Link href="/browse-mods">Browse</Link>
				<Link href="/downloads">Downloads</Link>
			</div>
			<span class="font-bold">Other</span>
			<div class="mx-2 flex flex-col">
				<Link href="/settings">
					<Settings class="h-5 w-5" />
					Settings
				</Link>
			</div>
		</section>
		<section class="flex-1">
			<slot />
		</section>
		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Launching game</Dialog.Title>
				</Dialog.Header>
				Please wait
			</Dialog.Content>
		</Dialog.Root>
	</main>
</QueryClientProvider>
