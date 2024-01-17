<script lang="ts">
	import * as Accordion from "~/components/ui/accordion";
	import { Button } from "~/components/ui/button";
	import { Input } from "~/components/ui/input";
	import { modList, type ModVersion } from "~/core/mods";
	import { profile } from "~/core/profile";

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

	const uninstall = (mod: ModVersion) => {
		// TODO
	};
</script>

<div class="flex max-h-screen flex-col">
	<div class="flex flex-row items-center justify-between p-4">
		<h1 class="py-4 text-2xl font-bold">Installed mods ({installed.length})</h1>
		<Input class="max-w-64" placeholder="Search" bind:value={search} />
	</div>
	<div class="overflow-y-scroll">
		<Accordion.Root multiple>
			{#each filtered as mod (mod.uuid4)}
				<Accordion.Item value={mod.uuid4}>
					<Accordion.Trigger class="p-4">
						<div class="flex flex-row items-center gap-4">
							<img src={mod.icon} alt={mod.full_name} width={64} height={64} />
							<span>{mod.full_name}</span>
						</div>
					</Accordion.Trigger>
					<Accordion.Content class="flex flex-col px-4">
						<p class="mb-2">{mod.description}</p>
						<div class="flex flex-row gap-2">
							<Button
								variant="outline"
								on:click={() => {
									uninstall(mod);
								}}
							>
								Uninstall
							</Button>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</div>
