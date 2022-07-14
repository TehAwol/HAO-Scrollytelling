<script>
	import { onMount } from "svelte";

	// Component imports
	import Header from "./_components/Header.svelte";
	import LandingBanner from "./_components/LandingBanner.svelte";
	import Map from "./_components/Map.svelte";
	import MapStatic from "./_components/MapStatic.svelte";
	import Scroller from "@sveltejs/svelte-scroller/Scroller.svelte";
	import LoremIpsum from "./_components/LoremIpsum.svelte";
	import Footer from "./_components/Footer.svelte";

	import geojson from "./_data/countries-110m.json";
	import data from "./_data/filtered-data.json";

	import { scrollyConfig } from './config';

	let index, offset, progress, toggleSkip;

	$: if (index > 0) toggleSkip = true;

	

	let selectedCode, selectedDimension, selectedCountry;

	$: selectedCountry = data.find((c) => c.code === selectedCode);

	function submitCode(code) {
		scrollyConfig.map[
			Object.keys(scrollyConfig.map)[
				Object.keys(scrollyConfig.map).length - 1
			]
		].code = code;
	}
	function submitDimension(dimension) {
		scrollyConfig.map[
			Object.keys(scrollyConfig.map)[
				Object.keys(scrollyConfig.map).length - 1
			]
		].dimension = dimension;
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
			ACAPS’ Humanitarian Access Overview provides an analysis on the
			state of humanitarian access globally. The primary objective of our
			analysis is to inform humanitarian decision makers by presenting a
			summary of the access situation in different countries that face
			humanitarian crises, both recent and protracted.
		</p>
		<p>
			To do so we established the ACAPS Humanitarian Access Methodology
			which groups several indicators under three key dimensions :
		</p>
		<div class="col-center">
			<ul>
				<li>
					<span class="blue">Pillar 1</span> : Access of people in need
					to humanitarian aid
				</li>
				<li>
					<span class="red">Pillar 2</span> : Access of humanitarian actors
					to affected population
				</li>
				<li>
					<span class="green">Pillar 3</span> : Security and physical constraints
				</li>
			</ul>
		</div>
		<p>
			This scoring model rates each dimension on a scale of 0-5 which
			allows us to calculate the overall access score of a country, also
			on a scale of 0-5.
		</p>
		<p>
			Keep scrolling on the map below to view some key findings from our
			report and examples of constraints in each dimension.
		</p>
	</div>
</section>
{#if toggleSkip}
	<section>
		<div class="col-center">
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
		<section id="step0">
			<div class="col-medium">
				<p>
					This map shows the severity of Humanitarian Access
					Constraints across the world as per our analysis.
				</p>
			</div>
		</section>
		<section id="step1">
			<div class="col-medium">
				<p>
					In the period of January-June 2022 Eritrea, Myanmar, Ukraine
					and Yemen faced <span class="red-extreme"
						>Extreme Access Constraints</span
					>
				</p>
			</div>
		</section>
		<section id="step2">
			<div class="col-medium">
				<p>
					When compared to the last report published in July 2021, we
					noted a deterioration in access across 11 countries, often
					as a direct consequence of a worsening in context.
				</p>
			</div>
		</section>
		<section id="step3">
			<div class="col-medium">
				<p>
					But we also noticed an improvement in overall humanitarian
					access in 22 countries mainly due to the lifting of COVID-19
					related sanctions.
				</p>
			</div>
		</section>
		<section id="step4">
			<div class="col-medium">
				<p>
					When focusing on the first pillar which analyses whether
					people in need are hindered in any way from accessing
					humanitarian aid and assistance.
				</p>
			</div>
		</section>
		<section id="step5">
			<div class="col-medium">
				<p>
					There were cases where certain groups or areas specifically
					are denied entitlement to assistance. This applies mainly in
					protracted conflict situations, particularly in the Middle
					East and Asia.
				</p>
			</div>
		</section>
		<section id="step6">
			<div class="col-medium">
				<p>
					Other areas are besieged, militarised, or have a high
					presence of security forces, making it dangerous for people
					to travel within or out of these areas. In Ukraine, since
					the Russian invasion, people in besieged areas have been
					stranded, with limited access to food, water and
					humanitarian corridors.
				</p>
			</div>
		</section>
		<section id="step7">
			<div class="col-medium">
				<p>
					When looking at the second pillar analysing the access of
					humanitarian actors to the people in need of humanitarian
					aid and assistance.
				</p>
			</div>
		</section>
		<section id="step8">
			<div class="col-medium">
				<p>
					Myanmar, Sudan and South Sudan were standout crises scoring
					5 in this dimension. These outcomes mainly resulted from the
					gradual deterioration of the conflict in Myanmar and the
					military coup in Sudan.
				</p>
			</div>
		</section>
		<section id="step9">
			<div class="col-medium">
				<p>
					At least 50 injuries of aid workers and 30 incidents of
					looting of humanitarian assets were recorded in the first
					half of this year. South Sudan recorded highest with 14 aid
					worker injuries and 18 looting incidents.
				</p>
			</div>
		</section>
		<section id="step10">
			<div class="col-medium">
				<p>
					Finally the third pillar analyses the physical,
					environmental and security constraints that restrict
					humanitarian assistance.
				</p>
			</div>
		</section>
		<section id="step11">
			<div class="col-medium">
				<p>
					In most of the African countries with active humanitarian
					crises, constraints of this type mainly include armed group
					attacks against public infrastructure and contamination with
					landmines and explosive devices.
				</p>
			</div>
		</section>
		<section id="step11">
			<div class="col-medium">
				<p>
					In Colombia for example, 88.2% of roads are unpaved making
					access to some remote regions more difficult. Municipalities
					located in rural areas are the most affected and people in
					need have difficulty accessing goods such as food and basic
					supplies.
				</p>
			</div>
		</section>
		<section id="stepFinal">
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
	<div class="col-center jump-bottom">
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

<section>
	<MapStatic debug={true} {geojson} accessData={data} />
</section>
