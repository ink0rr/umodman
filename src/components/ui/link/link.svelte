<script lang="ts">
	import { page } from "$app/stores";

	export let href: string;

	$: isActive = $page.url.pathname === href;
</script>

<a
	class="flex flex-row items-center gap-2 rounded px-2 py-1 font-medium text-gray-600 dark:text-gray-200"
	class:hover:bg-primary-foreground={!isActive}
	class:bg-slate-100={isActive}
	class:dark:bg-slate-800={isActive}
	class:text-black={isActive}
	{href}
>
	<slot />
</a>
