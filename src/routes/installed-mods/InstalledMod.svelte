<script lang="ts">
	import { open } from "@tauri-apps/api/shell";
	import * as Accordion from "~/components/ui/accordion";
	import { Button } from "~/components/ui/button";
	import * as Dialog from "~/components/ui/dialog";
	import type { ModVersion } from "~/core/mods";
	import { profile } from "~/core/profile";

	export let mod: ModVersion;

	const [owner, name] = mod.full_name.split("-");

	let dialogOpen = false;

	const uninstall = () => {
		profile.uninstall(`${owner}-${name}`);
	};
	const openWebsite = () => {
		open(`https://thunderstore.io/c/lethal-company/p/${owner}/${name}/`);
	};
</script>

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
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger asChild>
					<Button
						variant="outline"
						on:click={() => {
							dialogOpen = true;
						}}
					>
						Uninstall
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Confirmation</Dialog.Title>
					</Dialog.Header>
					<span>Are you sure you want to uninstall {mod.name}?</span>
					<Button variant="destructive" on:click={uninstall}>Uninstall</Button>
				</Dialog.Content>
			</Dialog.Root>
			<Button variant="outline" on:click={openWebsite}>Website</Button>
		</div>
	</Accordion.Content>
</Accordion.Item>
