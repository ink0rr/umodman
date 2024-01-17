<script lang="ts">
	import { mode, setMode } from "mode-watcher";
	import * as Select from "~/components/ui/select";

	const themes = [
		{ value: "system" as const, label: "System" },
		{ value: "dark" as const, label: "Dark" },
		{ value: "light" as const, label: "Light" },
	];

	let theme = themes.find(({ value }) => value === $mode) ?? themes[0];

	$: setMode(theme.value);
</script>

<div class="p-4">
	<h1 class="py-4 text-2xl font-bold">Settings</h1>
	<div class="px-2">
		<div class="flex w-full flex-row items-center justify-between">
			App Theme
			<Select.Root items={themes} bind:selected={theme}>
				<Select.Trigger class="max-w-32">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each themes as { value, label } (value)}
							<Select.Item {value}>
								{label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</div>
