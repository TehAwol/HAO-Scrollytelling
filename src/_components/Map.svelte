<script>
    import { onMount } from "svelte";
    import { feature } from "topojson-client";
    import { geoPath, geoMercator } from "d3-geo";

    export let geojson;
    export let accessData;

    import * as d3 from "d3";

    const width = window.innerWidth;
    const height = window.innerHeight;

    let mobile = false;
    if (width < height) mobile = true;

    export let currentStep = {
        translate: [0, 0],
        scale: 1,
        dimension: "P0",
    };


    let displayDim;
    // Reactive logic
    $: nextStep(currentStep.scale, currentStep.translate);
    $: updateColor(currentStep.dimension);
    $: zoomToCountry(currentStep.code);
    $: highlightCountry(currentStep.highlight);
    $: isolateCountry(currentStep.isolate);

    // Projection init
    const projection = geoMercator()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);
    const path = geoPath().projection(projection);
    const worldjson = feature(geojson, geojson.objects.countries).features;

    // Map linking Access Scores to country features via ISO 3166-1 numeric
    const scores = new Map();
    accessData.forEach((d) => {
        scores.set(d.code, { P0: d.P0, P1: d.P1, P2: d.P2, P3: d.P3 });
    });

    // Unranked countries are provided with an emptyScore for coloring purposes
    const emptyScore = { P0: "0", P1: "0", P2: "0", P3: "0" };

    // Color gradient config
    const colorSteps = {
        P0: ["#D9D9D9", "#FFD76D", "#FEA649", "#F86C30", "#E62F21", "#991824"],
        P1: ["#D9D9D9", "#E1F2F6", "#C8DFE8", "#7FB1D4", "#3E78B3", "#133267"],
        P2: ["#D9D9D9", "#E0D3D9", "#CC9EAF", "#A3405C", "#752345", "#351229"],
        P3: ["#D9D9D9", "#E1EFD3", "#CBE8B8", "#95C987", "#4A9351", "#1A4220"],
    };

    const constraintSteps = [
        "No significant access constraints",
        "Low access constraints",
        "Moderate access constraints",
        "High access constraints",
        "Very high access constraints",
        "Extreme access constraints",
    ];

    // Map init
    function initMap() {
        let svg = d3
            .select(".map-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${width} ${(height / 100) * 95}`)
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

        // Adapt svg to mobile screens
        if (mobile) {
            svg.attr("transform", "scale(2)");
        }

        updateColor("P0");
    }

    function updateSize() {
        let x = window.innerWidth || e.clientWidth || g.clientWidth;
        let y = window.innerHeight || e.clientHeight || g.clientHeight;

        console.log(x);
        console.log(y);

        d3.select("svg").attr("viewBox", `0 0 ${width} ${height}`);
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
                return currentColor[d.score[dimension]];
            });
    }

    function highlightCountry(code) {
        if (!code) return;
        console.log("Highlighting");
        for (let country of code) {
            let selection = d3
                .select(`#c${country}`)
                .attr("stroke-color", "red")
                .attr("stroke-width", "1");
            console.log(selection);
        }
    }

    function isolateCountry(code) {
        if (!code) return;

        let currentColor = colorSteps[displayDim];

        console.log("Isolating");
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
     * Transitions from current transform to given new scale and translation
     * @param {number} scale
     * @param {Array} translate [x,y]
     */
    function nextStep(scale, translate) {
        if (!translate) return;
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
     * Transitions from current transform to given country
     * @param {string} code A ISO 3166-1 numeric country code in string format
     */
    function zoomToCountry(code) {
        if (!code) return;

        let translate, scale;

        if (code === "000") {
            translate = [0, 0];
            scale = 1;
        } else {
            let selection = document.getElementById(`c${code}`).__data__;
            let bounds = path.bounds(selection),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2;

            scale = Math.max(
                1,
                Math.min(8, 0.9 / Math.max(dx / width, dy / height))
            );

            translate = [width / 2 - scale * x, height / 2 - scale * y];
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

    onMount(() => {
        initMap();
        if (debug) initZoom();
        d3.select(window).on("resize.updatesvg", updateSize);
    });
</script>

<div class="chart-container">
    <div class="map-legend">
        {#each colorSteps[currentStep.dimension] as color, i}
            <div class="legend-item">
                <div>
                    <span class="dot" style="background-color: {color}" />
                </div>
                <p>{i}</p>
                <p class="constraint-name">: {constraintSteps[i]}</p>
            </div>
        {/each}
    </div>
    <div class="map-container" />
</div>
