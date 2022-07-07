<script>
	import { onMount } from "svelte";

	// Component imports
	import Header from "./_components/Header.svelte";
	import LandingBanner from "./_components/LandingBanner.svelte";
	import Map from "./_components/Map.svelte";
	import Scroller from "@sveltejs/svelte-scroller/Scroller.svelte";
	import LoremIpsum from "./_components/LoremIpsum.svelte";
	import Footer from "./_components/Footer.svelte";

	import geojson from "./_data/countries-110m.json";
	import data from "./_data/filtered-data.json";

	let index, offset, progress;

	const scrollyConfig = {
		map: {
			0: {
				code: "000",
				dimension: "P0",
			},
			1: {
				dimension: "P1",
				code: "000",
			},
			2: {
				dimension: "P3",
				code: "004",
			},
			3: {
				dimension: "P2",
				code: "804",
			},
			4: {
				dimension: "P0",
				code: "000",
			},
		},
	};

	onMount(() => {});
</script>

<Header />
<LandingBanner />
<section>
	<div class="col-medium content-container">
		<h2>Introduction</h2>
		<p>
			Humanitarian Access is fundamental to humanitarian action. Without
			it, the broader goal of improving humanitarian conditions of people
			in need of assistance and protection would be impossible.
		</p>
		<p>
			While there is no agreed-upon definition of “humanitarian access”,
			many humanitarian actors use and promote a general definition of :
			<strong
				>Access of people in need to goods and services, and access by
				humanitarian actors to people in need of assistance and
				protection.</strong
			>
		</p>
		<p>
			ACAPS’ Humanitarian Access Overview provides an analysis on the
			state of humanitarian access globally. The primary objective of our
			analysis is to inform humanitarian decision makers by presenting a
			summary of the access situation in different countries that face
			humanitarian crises, both recent and protracted.
		</p>
	</div>
</section>
<Scroller top={0} bottom={1} bind:index bind:offset bind:progress>
	<div slot="background">
		<Map
			debug={false}
			currentStep={scrollyConfig.map[index]}
			{geojson}
			accessData={data}
		/>
	</div>
	<div class="foreground-container" slot="foreground">
		<section>
			<div class="col-medium">
				<p>
					Over the past six months we’ve been collecting information
					to produce the current Humanitarian Access Overview. Each
					country is ranked on a scale from 0 to 5, with 5
					representing extreme constraints,1 being low constraints and
					0 none. We structure our data around 3 pillars or
					dimensions.
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					The first pillar analyses whether people in need are
					hindered in any way from accessing humanitarian aid and
					assistance. This dimension is divided into two main
					indicators;<br><span style="background-color: #3E78B3; color: white;">Denial of existence of humanitarian needs</span><br>
					<span style="background-color: #3E78B3; color: white">Restriction and obstruction of access to services and
						assistance.</span>
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					There are cases where certain groups or areas specifically
					are denied entitlement to assistance. This applies mainly in
					protracted conflict situations, particularly in the Middle
					East and Asia, and in other regions but to a lesser extent.
					For instance, in Afghanistan, girls have been excluded from
					secondary education at schools by the authorities,
					significantly limiting their access to education.
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					Some areas are besieged, militarised, or have a high
					presence of security forces, making it dangerous for people
					to travel within or out of these areas. This is the case
					across regions, for several conflict-affected countries.
					Since the Russian invasion of Ukraine in February 2022,
					people in besieged areas have been stranded, with limited
					access to food, water and humanitarian corridors.
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					The second pillar analyses the access of humanitarian actors
					to the people in need of humanitarian aid and assistance.
					This dimension is based on 4 indicators; Impediments to
					entry into the country Restriction of movement within the
					country Interference into implementation of humanitarian
					activities, Violence against personnel, facilities and
					assets.
				</p>
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

<Footer />
<!-- <Map debug={false} /> -->
