<script>
	import { onMount } from 'svelte';
	import Map from './_components/Map.svelte';
	import Scroller from '@sveltejs/svelte-scroller/Scroller.svelte';

	let index, offset, progress;

	let mapComponent;
	function handleClick() {
		console.log(index)
		console.log(scrollyConfig.map[index])
	}

	const scrollyConfig = {
		map: {
			0: {
				translate: [0, 0],
				scale: 1,
				dimension: "SCORE"
			},
			1: {
				translate: [-7425.200238124638,-2003.7844077329937],
				scale: 12.74624154056931,
				dimension: "P1"
			},
			2: {
				translate: [-6462.515760714943,-1449.3224019238412],
				scale: 12.746241540569306,
				dimension: "P3"
			},
			3: {
				translate: [-7425.200238124638,-2003.7844077329937],
				scale: 12.74624154056931,
				dimension: "P2"
			},
		}
	}

	onMount(() => {
		console.log(mapComponent)
	})

	// $: mapComponent.tweenSteps(scrollyConfig.map[index].scale, scrollyConfig.map[index].translate);

</script>

<h1>HAO Scrollytelling</h1>
<button on:click={handleClick}>Test</button>
<Scroller top="{0.2}" bottom="{0.8}" bind:index bind:offset bind:progress>
	<div slot="background">
		<Map bind:this={mapComponent} debug={false} nextStep={scrollyConfig.map[index]}/>
	</div>
	<div slot="foreground">
		<section>First section</section>
		<section>Second section</section>
		<section>Third s ection</section>
		<section>Third s ection</section>
	</div>

</Scroller>

<style>
	section {
		height: 80vh;
		background-color: rgba(0,0,0,0.2);
		color: white;
		padding: 1em;
		margin: 0 0 2em 0;
	}
</style>
