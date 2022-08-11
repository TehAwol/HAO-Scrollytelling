<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { feature } from "topojson-client";
    import { geoPath, geoMercator } from "d3-geo";

    import PointFeature from "./PointFeature.svelte";
    import PolygonFeature from "./PolygonFeature.svelte";
    import PathFeature from "./PathFeature.svelte";
    import PathFeatureCol from "./PathFeatureCol.svelte";

    import { colorSteps, constraintSteps } from "../config";

    export let geojson;
    export let accessData;
    export let index;
    export let features;

    import * as d3 from "d3";

    let width = 900;
    let height = 500;

    let mobile = false;
    let scaleMod = 1;
    if (width < height) {
        mobile = true;
        scaleMod = 1.5;
    }

    export let currentStep = {
        translate: [0, 0],
        scale: 1,
        dimension: "P0",
    };

    let displayDim;
    // Hides map legend at these steps
    let featureIndexes = [7, 10, 13];
    if (features === false) {
        featureIndexes = [];
    }

    // Reactive logic
    $: updateColor(currentStep.dimension);
    $: zoomToCountry(currentStep.code);
    $: highlightCountry(currentStep.highlight);
    $: isolateCountry(currentStep.isolate);
    $: isolateRegion(currentStep.region);

    // Projection init
    const projection = geoMercator()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);
    const path = geoPath().projection(projection);
    const worldjson = feature(geojson, geojson.objects.countries).features;

    // Map linking Access Scores to country features via ISO 3166-1 numeric
    const scores = new Map();
    const regions = new Map();
    accessData.forEach((d) => {
        scores.set(d.code, { P0: d.P0, P1: d.P1, P2: d.P2, P3: d.P3 });
        regions.set(d.code, d.region);
    });

    // Unranked countries are provided with an emptyScore for coloring purposes
    const emptyScore = { P0: "0", P1: "0", P2: "0", P3: "0" };

    // Map init
    function initMap() {
        let svg = d3
            .select("#map")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("style", "background-color:#ffffff");

        svg.append("g")
            .selectAll("path")
            .data(worldjson)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", (d) => {
                return `c${d.id}`;
            })
            .attr("stroke", "white")
            .attr("stroke-width", "1px");

        updateColor("P0");
    }

    function updateSize() {
        let x = (window.innerWidth / 100) * 75;
        let y = window.innerHeight;

        d3.select(".map-container svg").attr("viewBox", `0 0 ${x} ${y}`);
    }

    // Zoom init
    export let debug = false;

    let zoom = d3.zoom().on("zoom", handleZoom);

    function initZoom() {
        d3.select(".map-container svg").call(zoom);
    }

    function handleZoom(e) {
        d3.select("svg g").attr("transform", e.transform);
        if (debug) logTransform(e);
    }

    function logTransform(e) {
        let scale = e.transform.k;
        let translate = [e.transform.x, e.transform.y];
        console.log(`scale: ${scale}  translate: ${translate}`);
    }

    /**
     * Updates country colors to reflect given dimension
     * @param {string} dimension The dimension to show: "P0", "P1", "P2" or "P3"
     */
    function updateColor(dimension) {
        displayDim = dimension;

        let currentColor = colorSteps[dimension];

        d3.select("svg g")
            .selectAll("path")
            .transition()
            .duration(1000)
            .attr("fill", (d) => {
                d.score = scores.get(d.id) || emptyScore;
                d.region = regions.get(d.id);
                return currentColor[d.score[dimension]];
            });
    }

    /**
     * Highlights (increases border thickness) of the given country
     * @param {Array.<string>} code A ISO 3166-1 numeric country code in string format or array of string codes
     */
    function highlightCountry(code) {
        if (!code) return;
        for (let country of code) {
            let selection = d3
                .select(`#c${country}`)
                .attr("stroke-color", "white")
                .attr("stroke-width", "2px")
                .attr("fill", "white");
        }
    }

    /**
     * Isolates the colour of given countries
     * @param {Array.<string>} code A ISO 3166-1 numeric country code in string format or array of string codes
     */
    function isolateCountry(code) {
        if (!code || code[0] === "000") return;

        let currentColor = colorSteps[displayDim];

        d3.select("svg g")
            .selectAll("path")
            .transition()
            .duration(1000)
            .attr("fill", (d) => {
                if (!code.includes(d.id)) {
                    d.score = emptyScore;
                } else {
                    d.score = scores.get(d.id);
                }
                return currentColor[d.score[displayDim]];
            });
    }

    /**
     * Isolates the colors of countries in given region(s) !Only isolates countries with a score!
     * @param {Array.<string>} code An array of region string
     */
    function isolateRegion(code) {
        if (!code) return;

        let currentColor = colorSteps[displayDim];

        d3.select("svg g")
            .selectAll("path")
            .transition()
            .duration(1000)
            .attr("fill", (d) => {
                if (!code.includes(d.region)) {
                    d.score = emptyScore;
                } else {
                    d.score = scores.get(d.id);
                }
                return currentColor[d.score[displayDim]];
            });
    }

    /**
     * Transitions from current transform to given country
     * @param {string||Array.<strin>} code A ISO 3166-1 numeric country code in string format or array of string codes
     */
    function zoomToCountry(code) {
        if (!code) return;

        let translate, scale, selection;

        if (code === "000") {
            translate = [-50, 0];
            scale = 1.1;
        } else {
            if (!Array.isArray(code)) {
                selection = document.getElementById(`c${code}`).__data__;
            } else {
                let featureCollection = {
                    type: "FeatureCollection",
                    features: [],
                };

                for (let entry of code) {
                    let selection = document.getElementById(
                        `c${entry}`
                    ).__data__;
                    featureCollection.features.push(selection);
                }

                selection = featureCollection;
            }

            let bounds = getBounds(selection);

            translate = bounds.translate;
            scale = bounds.scale;
        }

        d3.select("svg g")
            .transition()
            .duration(1000)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(translate[0], translate[1])
                    .scale(scale)
            );

        // Adapts borders to current scale
        d3.selectAll("g path").attr("stroke-width", 1 / scale);
    }

    /**
     * Returns a bounds object {scale: x, translate: [x,y]} for map translation and zoom
     *
     * @param {object} featureCollection Feature collection to fit in view
     */
    function getBounds(featureCollection) {
        let translate, scale;

        let bounds = path.bounds(featureCollection),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2;

        scale = Math.max(
            1,
            Math.min(8, 0.9 / Math.max(dx / width, dy / height)) * 0.8
        );

        translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        return { scale: scale, translate: translate };
    }

    onMount(() => {
        initMap();
        if (debug) initZoom();
        // d3.select(window).on("resize.updatesvg", updateSize); // For responsive resizing
    });
</script>

<div class="chart-container">
    <slot />
    <div class="map-container" id="map" />
    <div class="map-legend">
        {#if !featureIndexes.includes(index)}
            <div class="map-static-legend">
                <div class="legend-title">
                    {#if displayDim === "P0"}
                        <p in:fade={{ duration: 300 }}>Overall Access Score</p>
                    {:else if displayDim === "P1"}
                        <p in:fade={{ duration: 300 }}>
                            <span class="blue">Pillar 1</span> - Access of people
                            in need to humanitarian aid
                        </p>
                    {:else if displayDim === "P2"}
                        <p in:fade={{ duration: 300 }}>
                            <span class="red">Pillar 2</span> - Access of humanitarian
                            actors to affected population
                        </p>
                    {:else if displayDim === "P3"}
                        <p in:fade={{ duration: 300 }}>
                            <span class="green">Pillar 3</span> - Security and physical
                            constraints
                        </p>
                    {/if}
                </div>
                <div class="legend-items-container">
                    {#each colorSteps[currentStep.dimension] as color, i}
                        <div class="legend-item">
                            <div>
                                <span
                                    class="dot"
                                    style="background-color: {color}"
                                />
                            </div>
                            <p class="constraint-level">{i}</p>
                            <p class="constraint-name">: {constraintSteps[i]}</p>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
        {#if features}
            <PolygonFeature {path} {index} trigger={7} />
            <PointFeature {projection} {index} trigger={10} />
            <PathFeatureCol {path} {index} trigger={13} />
            <PathFeature {path} {index} trigger={13} />
        {/if}
    </div>
</div>
