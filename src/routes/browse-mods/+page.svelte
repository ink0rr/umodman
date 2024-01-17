<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import * as Accordion from "~/components/ui/accordion";
	import { Input } from "~/components/ui/input";
	import * as Pagination from "~/components/ui/pagination";
	import { modList, type Mods } from "~/core/mods";
	import ModsItem from "./ModItem.svelte";

	const query = createQuery<Mods[]>({
		queryKey: ["mods"],
		initialData: [],
		async queryFn() {
			// TODO: Support multiple games
			const res = await fetch("https://thunderstore.io/c/lethal-company/api/v1/package/");
			return res.json();
		},
		select(data) {
			for (const m of data) {
				m.versions = m.versions.filter((v) => v.is_active);
			}
			const [, pinned, ...rest] = data;
			rest.sort(
				(a, b) =>
					b.versions.reduce((acc, curr) => acc + curr.downloads, 0) -
					a.versions.reduce((acc, curr) => acc + curr.downloads, 0),
			);
			return [pinned].concat(rest);
		},
	});

	let page = 1;
	let search = "";

	$: if ($query.isFetched) {
		$modList = $query.data;
	}
	$: filtered = $modList.filter(({ full_name }) => full_name.match(new RegExp(search, "i")));
	$: paginated = filtered.slice((page - 1) * 50, page * 50);
	$: paginationCount = Math.floor(filtered.length / 50) || 1;
	$: {
		page = 1;
		paginationCount;
	}
</script>

{#if $query.isFetched}
	<div class="flex max-h-screen flex-col">
		<div class="flex flex-row items-center justify-between p-4">
			<h1 class="py-4 text-2xl font-bold">All mods ({$modList.length})</h1>
			<Input class="max-w-64" placeholder="Search" bind:value={search} />
		</div>
		<div class="overflow-y-scroll">
			<Accordion.Root multiple>
				{#each paginated as mods (mods.uuid4)}
					<ModsItem {mods} />
				{/each}
			</Accordion.Root>
		</div>
		<div class="border-t py-1">
			<Pagination.Root
				count={paginationCount}
				perPage={3}
				siblingCount={1}
				let:pages
				let:currentPage
				bind:page
			>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="h-4 w-4" />
							<span class="hidden sm:block">Previous</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === "ellipsis"}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage == page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton>
							<span class="hidden sm:block">Next</span>
							<ChevronRight class="h-4 w-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<span class="text-xl">Loading...</span>
	</div>
{/if}
