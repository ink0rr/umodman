<script lang="ts">
	import * as Accordion from "~/components/ui/accordion";
	import { Input } from "~/components/ui/input";
	import { modList, type ModVersion } from "~/core/mods";
	import { profile } from "~/core/profile";
	import InstalledMod from "./InstalledMod.svelte";

	let search = "";
	let installed: ModVersion[];
	$: {
		installed = [];
		for (const [identifier, version_number] of Object.entries($profile)) {
			const [owner, name] = identifier.split("-");
			const mod = $modList
				.find((mod) => mod.owner === owner && mod.name === name)
				?.versions.find((mod) => mod.version_number === version_number);
			if (mod) {
				installed.push(mod);
			}
		}
	}
	$: filtered = installed.filter(({ full_name }) => full_name.match(new RegExp(search, "i")));
</script>

<div class="flex max-h-screen flex-col">
	<div class="flex flex-row items-center justify-between p-4">
		<h1 class="py-4 text-2xl font-bold">Installed mods ({installed.length})</h1>
		<Input class="max-w-64" placeholder="Search" bind:value={search} />
	</div>
	<div class="overflow-y-scroll">
		<Accordion.Root multiple>
			{#each filtered as mod (mod.uuid4)}
				<InstalledMod {mod} />
			{/each}
		</Accordion.Root>
	</div>
</div>
