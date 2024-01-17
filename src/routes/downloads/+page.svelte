<script lang="ts">
	import { Progress } from "~/components/ui/progress";
	import { downloader } from "~/core/downloads";
	import type { ModVersion } from "~/core/mods";

	let downloading: Map<ModVersion, number> = new Map();
	let downloaded: Map<ModVersion, number> = new Map();

	$: {
		for (const [mod, progress] of $downloader) {
			if (progress < 100) {
				downloading.set(mod, progress);
			} else {
				downloaded.set(mod, progress);
				downloading.delete(mod);
			}
		}
		downloading = downloading;
		downloaded = downloaded;
	}
</script>

<div class="flex max-h-screen flex-col overflow-y-auto">
	<h1 class="mt-4 p-4 text-2xl font-bold">Downloading ({downloading.size})</h1>
	{#if downloading.size === 0}
		<div class="flex flex-col items-start p-4">
			<span class="ml-2 flex-1">No mods are currently downloading</span>
		</div>
	{:else}
		{#each downloading as [mod, progress] (mod.uuid4)}
			<div class="flex flex-col items-start border-b p-4">
				<div class="flex w-full flex-row items-center gap-2">
					<img src={mod.icon} alt={mod.name} width={64} height={64} />
					<span class="flex-1 break-words font-medium">{mod.full_name}</span>
					<Progress class="w-48" value={progress} />
					<span>{progress}%</span>
				</div>
			</div>
		{/each}
	{/if}
	{#if downloaded.size > 0}
		<h1 class="mt-4 p-4 text-2xl font-bold">Downloaded ({downloaded.size})</h1>
		{#each downloaded as [mod, progress] (mod.uuid4)}
			<div class="flex flex-col items-start border-b p-4">
				<div class="flex w-full flex-row items-center gap-2">
					<img src={mod.icon} alt={mod.name} width={64} height={64} />
					<span class="flex-1 break-words font-medium">{mod.full_name}</span>
					<Progress class="w-48" value={progress} />
					<span>{progress}%</span>
				</div>
			</div>
		{/each}
	{/if}
</div>
