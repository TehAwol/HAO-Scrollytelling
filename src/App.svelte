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

	let index, offset, progress, toggleSkip;

	$: if (index > 0) toggleSkip = true;

	const scrollyConfig = {
		map: {
			0: {
				code: "000",
				dimension: "P0",
			},
			1: {
				dimension: "P0",
				code: "000",
				isolate: ["232", "104", "804", "887"],
			},
			2: {
				dimension: "P0",
				code: "000",
				isolate: ["148", "222", "356", "360", "458", "104", "516", "586", "729", "804", "887"]
			},
			3: {
				dimension: "P1",
				code: "804",
				highlight: ["804"],
			},
			4: {
				dimension: "P2",
				code: "000",
			},
			5: {
				dimension: "P0",
				code: "000",
			},
		},
	};

	let selectedCode, selectedDimension, selectedCountry;

	$: selectedCountry = data.find((c) => c.code === selectedCode);

	function submitCode(code) {
		scrollyConfig.map[5].code = code;
	}
	function submitDimension(dimension) {
		scrollyConfig.map[5].dimension = dimension;
	}

	function scrollTo(el) {
		let target = document.querySelector(el);
		target.scrollIntoView({ behavior: "smooth" });
	}

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
{#if toggleSkip}
	<section>
		<div class="col-medium col-center">
			<button
				class="button-orange"
				on:click={() => scrollTo(".jump-bottom")}
				>Scroll to bottom</button
			>
		</div>
	</section>
{/if}
<Scroller
	top={0}
	bottom={1}
	threshold={0.5}
	bind:index
	bind:offset
	bind:progress
>
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
					This map shows the severity of Humanitarian Access
					Constraints across the world on a country level.
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					In the period of January-June 2022 Eritrea, Myanmar, Ukraine
					and Yemen faced <span class="red-extreme"
						>Extreme Access Constraints</span
					>
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					When compared to the last report published in July 2021, we
					noted a deterioration in access across 11 countries, often
					as a direct consequence of a worsening in context.
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
				<h3>
					<span class="red">Pillar 2</span> - Access of Humanitarian Agencies
					to People in Need
				</h3>
				<p>
					The second pillar analyses the access of humanitarian actors
					to the people in need of humanitarian aid and assistance.
					This dimension is based on 4 indicators; Impediments to
					entry into the country, Restriction of movement within the
					country, Interference into implementation of humanitarian
					activities, and Violence against personnel, facilities and
					assets.
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					Feel free to pick a country or dimension to get more
					information
				</p>

				<select
					bind:value={selectedCode}
					on:change={submitCode(selectedCode)}
				>
					<optgroup>
						<option value="000">None</option>
						{#each data as country}
							<option value={country.code}>{country.name}</option>
						{/each}
					</optgroup>
				</select>

				<select
					bind:value={selectedDimension}
					on:change={submitDimension(selectedDimension)}
				>
					<optgroup>
						<option value="P0">Access Score</option>
						<option value="P1">Pillar 1</option>
						<option value="P2">Pillar 2</option>
						<option value="P3">Pillar 3</option>
					</optgroup>
				</select>
				{#if selectedCountry != undefined}
					<h3>
						{selectedCountry.name}
					</h3>
					<div class="table-container">
						<table>
							<tr>
								<td>Overall</td>
								<td>Access Score</td>
								<td>{selectedCountry.P0}</td>
							</tr>
							<tr>
								<td><span class="blue">Pillar 1</span></td>
								<td>Access of people in need to aid</td>
								<td>{selectedCountry.P1}</td>
							</tr>
							<tr>
								<td><span class="green">Pillar 2</span></td>
								<td
									>Access of humanitarian agencies to people
									in need</td
								>
								<td>{selectedCountry.P2}</td>
							</tr>
							<tr>
								<td><span class="red">Pillar 3</span></td>
								<td
									>Physical, environmental, and security
									constraints</td
								>
								<td>{selectedCountry.P3}</td>
							</tr>
						</table>
					</div>
				{/if}
			</div>
		</section>
	</div>
</Scroller>
<section>
	<div class="col-medium col-center jump-bottom">
		<button
			class="button-orange"
			on:click={() => scrollTo(".landing-container")}
			>Scroll to top</button
		>
	</div>
</section>
<section>
	<div class="col-medium">
		<h2>Introduction</h2>
		<LoremIpsum />
	</div>
</section>

<Footer />
<!-- <Map debug={false} /> -->
