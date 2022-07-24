<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	// Component imports
	import Header from "./_components/Header.svelte";
	import LandingBanner from "./_components/LandingBanner.svelte";
	import Map from "./_components/Map.svelte";
	import MapStatic from "./_components/MapStatic.svelte";
	import Scroller from "./_components/Scroller.svelte";
	import Footer from "./_components/Footer.svelte";
	import BarChart from "./_components/BarChart.svelte";

	import geojson from "./_data/countries-110m.json";
	import data from "./_data/filtered-data.json";

	import { scrollyConfig } from "./config";

	let index, offset, progress, toggleSkip;
	$: if (index > 0) toggleSkip = true;

	// Handles splitscreen mode acoording to screen ratio
	let splitscreen = window.innerHeight / window.innerWidth < 1.8;
	function handleResize() {
		splitscreen = window.innerHeight / window.innerWidth < 1.8;
	}

	window.onresize = handleResize;


	// Country selection reactivity
	let selectedCode, selectedDimension, selectedCountry;
	$: selectedCountry = data.find((c) => c.code === selectedCode);

	// Informs map component of config limits
	$: if (index < 0) index = 0;
	$: if (index > scrollyConfig.map.length)
		index = scrollyConfig.map.length - 1;

	// -fiddle- Modifies the last entry of the config to selection (isolates / highlights)
	function submitCode(code) {
		scrollyConfig.map[
			Object.keys(scrollyConfig.map)[
				Object.keys(scrollyConfig.map).length - 1
			]
		].code = code;
		scrollyConfig.map[
			Object.keys(scrollyConfig.map)[
				Object.keys(scrollyConfig.map).length - 1
			]
		].isolate = [code];

		// Push selection down for better visibility
		// window.scrollBy({
		// 	top: -300,
		// 	behavior: "smooth"
		// })
	}

	// Map buttons handler function
	function scrollTo(el) {
		let target = document.querySelector(el);
		if (!target) return;
		target.scrollIntoView({ behavior: "smooth" });
	}

	// Map keyboard handler
	function onKeyDown(evt) {
		if (evt.keyCode === 38) scrollTo(`#step${index - 1}`);
		if (evt.keyCode === 40 && progress > 0) scrollTo(`#step${index + 1}`);
	}

	onMount(() => {});
</script>

<svelte:window on:keydown={onKeyDown} />
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
					<strong
						><span class="blue">Pillar 1</span> - Access of people in
						need to humanitarian aid</strong
					>
				</li>
				<li>
					<strong
						><span class="red">Pillar 2</span> - Access of humanitarian
						actors to affected population</strong
					>
				</li>
				<li>
					<strong
						><span class="green">Pillar 3</span> - Security and physical
						constraints</strong
					>
				</li>
			</ul>
		</div>
		<p>
			This scoring model rates each dimension on a scale of 0-5 which
			allows us to calculate the overall access score of a country, also
			on a scale of 0-5.
		</p>
	</div>
</section>
<hr class="solid" />
<section>
	<div class="col-medium">
		<p>
			Keep scrolling on the map below to view some key findings from our
			report and examples of constraints in each dimension.
		</p>
		<p>
			You can also use your arrow keys to navigate between steps or skip
			the section entirely by using the "jump buttons".
		</p>
	</div>
</section>
<div class="scroller-container">
	{#if progress > 0 && progress < 1}
		<div transition:fade={{ duration: 100 }} class="map-buttons-container">
			<button
				class="button-orange"
				on:click={() => scrollTo(".landing-container")}
				>Jump to top</button
			>
			<button
				class="button-orange"
				on:click={() => scrollTo(".methodology")}>Jump to bottom</button
			>
		</div>
	{/if}
	<Scroller
		top={0}
		bottom={1}
		threshold={0.5}
		bind:index
		bind:offset
		bind:progress
		{splitscreen}
	>
		<div slot="background">
			<Map
				debug={false}
				currentStep={scrollyConfig.map[index]}
				{geojson}
				accessData={data}
				{index}
				{splitscreen}
			/>
			<progress id="progress-bar" value={progress || 0} />
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
						In the period of January-June 2022 <strong
							>Eritrea, Myanmar, Ukraine and Yemen</strong
						>
						faced
						<span class="red-extreme"
							>Extreme Access Constraints</span
						>
					</p>
				</div>
			</section>
			<section id="step2">
				<div class="col-medium">
					<p>
						When compared to the last report published in December
						2021, we noted <strong
							>a deterioration in access across 11 countries</strong
						>, often as a direct consequence of a worsening in
						context.
					</p>
				</div>
			</section>
			<section id="step3">
				<div class="col-medium">
					<p>
						But we also noticed <strong
							>an improvement in overall humanitarian access in 22
							countries</strong
						> mainly due to the lifting of COVID-19 related sanctions.
					</p>
				</div>
			</section>
			<section id="step4">
				<div class="col-medium">
					<p>
						In our report we approach access through <strong
							>3 dimensions</strong
						> to better understand the type of access constraint affecting
						different humanitarian contexts.
					</p>
				</div>
			</section>
			<section id="step5">
				<div class="col-medium">
					<h3>
						<span class="blue">Pillar 1</span> - Access of people in
						need to aid
					</h3>
					<p>
						The first dimension analyses whether people in need are
						hindered in any way from accessing humanitarian aid and
						assistance. 2 indicators are used in this dimension:
					</p>
					<ul>
						<li>
							Denial of existence of humanitarian needs or
							entitlements to assistance.
						</li>
						<li>
							Restriction and obstruction of access to services
							and assistance.
						</li>
					</ul>
				</div>
			</section>
			<section id="step6">
				<div class="col-medium">
					<p>
						There were cases where certain groups or areas
						specifically are <strong>denied entitlement to assistance</strong>. This
						applies mainly in protracted conflict situations,
						particularly in the Middle East and Asia.
					</p>
				</div>
			</section>
			<section id="step7">
				<div class="col-medium">
					<p>
						Other areas are besieged, militarised, or have a high
						presence of security forces, making it dangerous for
						people to travel within or out of these areas. In
						Ukraine, since the Russian invasion, people in besieged
						areas have been stranded, with limited access to food,
						water and humanitarian corridors.
					</p>
				</div>
			</section>
			<section id="step8">
				<div class="col-medium">
					<h3>
						<span class="red">Pillar 1</span> - Access of humanitarian
						actors to affected population
					</h3>
					<p>
						The second pillar analyses the access of humanitarian
						actors to the people in need of humanitarian aid and
						assistance. 4 indicators are used in this dimension:
					</p>
					<ul>
						<li>Impediments to enter the country</li>
						<li>Restriction of movement within the country</li>
						<li>
							Interference into implementation of humanitarian
							activities
						</li>
						<li>
							Violence against humanitarian personnel, facilities,
							and assets
						</li>
					</ul>
				</div>
			</section>
			<section id="step9">
				<div class="col-medium">
					<p>
						Myanmar, Sudan and South Sudan were standout crises
						scoring 5 in this dimension. These outcomes mainly
						resulted from the gradual deterioration of the conflict
						in Myanmar and the military coup in Sudan.
					</p>
				</div>
			</section>
			<section id="step10">
				<div class="col-medium">
					<p>
						At least 50 injuries of aid workers and 30 incidents of
						looting of humanitarian assets were recorded in the
						first half of this year. South Sudan recorded highest
						with 14 aid worker injuries and 18 looting incidents.
					</p>
				</div>
			</section>
			<section id="step11">
				<div class="col-medium">
					<h3>
						<span class="green">Pillar 3</span> - Security and phyisical constraints
					</h3>
					<p>
						Fhe third pillar analyses the physical, environmental
						and security constraints that restrict humanitarian
						assistance. 3 indicators are used in this
						dimension:
					</p>
					<ul>
						<li>
							Ongoing insecurity or hostilities affecting
							humanitarian assistance
						</li>
						<li>
							Presence of landmines, improvised explosive devices
							(IEDs), explosive remnants of war (ERW), and
							unexploded ordnance (UXOs)
						</li>
						<li>Physical constraints in the environment</li>
					</ul>
				</div>
			</section>
			<section id="step12">
				<div class="col-medium">
					<p>
						In most of the African countries with active
						humanitarian crises, constraints of this type mainly
						include armed group attacks against public
						infrastructure and contamination with landmines and
						explosive devices.
					</p>
				</div>
			</section>
			<section id="step13">
				<div class="col-medium">
					<p>
						In Colombia for example, 88.2% of roads are unpaved
						making access to some remote regions more difficult.
						Municipalities located in rural areas are the most
						affected and people in need have difficulty accessing
						goods such as food and basic supplies.
					</p>
				</div>
			</section>
			<section id="step14">
				<div class="col-medium">
					<p>
						You can pick a country to view its score and dimension
						scores.
					</p>

					<select
						bind:value={selectedCode}
						on:change={submitCode(selectedCode)}
					>
						<optgroup>
							<option value="000">World View</option>
							{#each data as country}
								<option value={country.code}
									>{country.name}</option
								>
							{/each}
						</optgroup>
					</select>

					<!-- <select
					bind:value={selectedDimension}
					on:change={submitDimension(selectedDimension)}
				>
					<optgroup>
						<option value="P0">Access Score</option>
						<option value="P1">Pillar 1</option>
						<option value="P2">Pillar 2</option>
						<option value="P3">Pillar 3</option>
					</optgroup>
				</select> -->
					<div id="barChart">
						<BarChart
							selection={selectedCountry}
							anchor={"#barChart"}
						/>
					</div>

					{#if selectedCountry != undefined}
						<h3>
							{selectedCountry.name}
						</h3>
					{/if}
				</div>
			</section>
		</div>
	</Scroller>
</div>
<section>
	<div class="col-medium content-container methodology">
		<h2>Methodology</h2>
		<p>
			Our main objective is to assess the level of access for
			international humanitarian organisations using a holistic approach
			that divides humanitarian access into three core dimensions:
		</p>
		<div class="col-center">
			<ul>
				<li>
					<strong
						><span class="blue">Pillar 1</span> - Access of people in
						need to humanitarian aid</strong
					>
				</li>
				<li>
					<strong
						><span class="red">Pillar 2</span> - Access of humanitarian
						actors to affected population</strong
					>
				</li>
				<li>
					<strong
						><span class="green">Pillar 3</span> - Security and physical
						constraints</strong
					>
				</li>
			</ul>
		</div>
		<p>
			These dimensions are all scored on a scale of 1 to 5 (as shown on
			the map) and their rounded average form the overall access score for
			a country. Each dimension is composed of several indicators which
			allows us to calculate its score according to thresholds.
		</p>
		<img src="./img/methodology.png" alt="methodology chart" />
		<p>
			Indicators are given a score between 0 (no impact on access) to 3
			(blocking access). They are assessed using different methods,
			including checklists and a mixed approach combining quantitative and
			qualitative information. Sub-indicators with an assigned weight
			reflecting the impact of access for a given indicator help calculate
			its final score.
		</p>
		<h2>Sources</h2>
		<p>
			Our Access Methodology uses a range of qualitative information
			sources combined with relevant datasets in a structured way in order
			to quantify the level of humanitarian access. This data is collected
			by ACAPS analysts from a range of credible and publicly available
			sources, including UN agencies, governments, international and local
			NGOs, international and local media, and humanitarians working in
			the countries and areas analysed.
		</p>
		<p>
			For further information, please read our <a
				href="https://www.acaps.org/sites/acaps/files/resources/files/20211207_acaps_humanitarian_access_methodology_note_december_2021.pdf"
				>Methodology Note</a
			>.
		</p>
		<h3>Limitations</h3>
		<p>
			ACAPS’ Humanitarian Access Overview faces the same limitations as
			all secondary data reviews. Information might not be available
			without physical presence in the countries analysed, and information
			by third parties might come with a certain degree of delay,
			especially in very volatile contexts. When possible, analysts
			cross-check available information with humanitarians working in
			countries of operation.
		</p>
	</div>
</section>
<section />
<Footer />

<!-- <section>
	<MapStatic debug={true} {geojson} accessData={data} />
</section> -->
