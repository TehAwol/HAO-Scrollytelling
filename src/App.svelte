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
				code: "566",
			},
			4: {
				dimension: "P0",
				code: "000",
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
<Scroller top={0} bottom={1} bind:index bind:offset bind:progress>
	<div slot="background">
		<MapClean debug={false} currentStep={scrollyConfig.map[index]} />
	</div>
	<div slot="foreground">
		<section>
			<div class="col-medium">
				<p>This is Nigeria in the 2nd dimension</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is Nigeria in the 2nd dimension</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is Nigeria in the 2nd dimension</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is Nigeria in the 2nd dimension</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is Nigeria in the 2nd dimension</p>
			</div>
		</section>
	</div>
</Scroller>
<section>
	<div class="col-medium">
		<h2>Introduction</h2>
		<LoremIpsum />
	</div>
</section>

<!-- <MapClean debug={false} /> -->
<style>
	@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto&display=swap");

	body {
		font-family: "Bebas Neue", cursive;
		font-family: "Roboto", sans-serif;
	}

	h2 {
		font-family: "Bebas Neue";
	}

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

	[slot="foreground"] section div {
		padding: 12px;
		position: relative;
	}

	[slot="foreground"] section div::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		background-color: white;
		width: 100%;
		height: 100%;
		opacity: 0.8;
		z-index: -1;
		border-radius: 5px;
	}
</style>
