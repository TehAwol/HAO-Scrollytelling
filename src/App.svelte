<script>
	import { onMount } from "svelte";

	// Component imports
	import Map from "./_components/Map.svelte";
	import MapClean from "./_components/MapClean.svelte";
	import Scroller from "@sveltejs/svelte-scroller/Scroller.svelte";
	import LoremIpsum from "./_components/LoremIpsum.svelte";

	let index, offset, progress;

	const scrollyConfig = {
		map: {
			0: {
				translate: [0, 0],
				scale: 1,
				dimension: "P0",
			},
			1: {
				dimension: "P1",
				code: "756",
			},
			2: {
				dimension: "P3",
				code: "004",
			},
			3: {
				dimension: "P2",
				code: "566"
			},
		},
	};

	onMount(() => {});
</script>

<h1>HAO Scrollytelling</h1>
<section>
	<div class="col-medium">
		<h2>Introduction</h2>
		<LoremIpsum />
	</div>
</section>
<Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
	<div slot="background">
		<MapClean debug={true} currentStep={scrollyConfig.map[index]} />
	</div>
	<div slot="foreground">
		<section>This is a very nice world map</section>
		<section>Now it's zooming to Switzerland, where I live</section>
		<section>This is Afghanistan in 3rd dimension</section>
		<section>This is the Nigeria in 2nd dimension</section>
	</div>
</Scroller>

<!-- <MapClean debug={false} /> -->
<style>
	header,
	section,
	nav,
	footer,
	figure,
	caption {
		display: flex;
		justify-content: center;
		background-position: center;
		margin: 0;
		padding: 0;
	}

	.col-medium {
		width: 100%;
		max-width: 680px;
		margin: 0 24px;
	}

	[slot="foreground"] section {
		padding: 100vh 0 100vh 0;
		font-size: larger;
	}

</style>
