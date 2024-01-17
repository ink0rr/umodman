<script lang="ts">
	import { open } from "@tauri-apps/api/shell";
	import { toast } from "svelte-sonner";
	import { get } from "svelte/store";
	import * as Accordion from "~/components/ui/accordion";
	import { Button } from "~/components/ui/button";
	import * as Dialog from "~/components/ui/dialog";
	import * as Select from "~/components/ui/select";
	import { downloader } from "~/core/downloads";
	import { modList, type Mods } from "~/core/mods";

	export let mods: Mods;

	const { icon, description } = mods.versions[0];

	let dialogOpen = false;
	let versions = mods.versions.map(({ version_number }) => ({
		value: version_number,
		label: version_number,
	}));
	let selected = versions[0];

	const download = () => {
		const mod = mods.versions.find(({ version_number }) => version_number === selected.value);
		if (!mod) {
			toast.error(`Failed to find version ${selected.value} of ${mods.name}`);
			return;
		}
		dialogOpen = false;
		downloader.add(get(modList), mod);
	};
	const openWebsite = () => {
		open(`https://thunderstore.io/c/lethal-company/p/${mods.owner}/${mods.name}/`);
	};
</script>

<Accordion.Item value={mods.uuid4}>
	<Accordion.Trigger class="p-4">
		<div class="flex flex-row items-center gap-4">
			<img src={icon} alt={mods.full_name} width={64} height={64} />
			<span>{mods.full_name}</span>
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="flex flex-col px-4">
		<p class="mb-2">{description}</p>
		<div class="flex flex-row gap-2">
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger asChild>
					<Button
						variant="outline"
						on:click={() => {
							dialogOpen = !dialogOpen;
						}}
					>
						Download
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>
							Download {mods.name}
						</Dialog.Title>
					</Dialog.Header>
					Select a version to download:
					<Select.Root items={versions} bind:selected>
						<Select.Trigger>
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each mods.versions as v (v.version_number)}
									<Select.Item value={v.version_number}>
										{v.version_number}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					<Button variant="outline" on:click={download}>Download</Button>
				</Dialog.Content>
			</Dialog.Root>
			<Button variant="outline" on:click={openWebsite}>Website</Button>
		</div>
	</Accordion.Content>
</Accordion.Item>
