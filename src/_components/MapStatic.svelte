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

    // Reactive logic

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
            .select(".mapstatic-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
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
        d3.select(".mapstatic-container svg").call(zoom);
    }

    function handleZoom(e) {
        d3.select(".mapstatic-container svg g").attr("transform", e.transform);
        if (debug) logTransform(e);
    }

    function logTransform(e) {
        let scale = e.transform.k;
        let translate = [e.transform.x, e.transform.y];
        console.log(projection.invert(translate));
        console.log(`scale: ${scale}  translate: ${translate}`);
    }

    /**
     * Updates country colors to reflect given dimension
     * @param {string} dimension The dimension to show: "P0", "P1", "P2" or "P3"
     */
    function updateColor(dimension) {
        let currentColor = colorSteps[dimension];

        d3.select(".mapstatic-container svg g")
            .selectAll("path")
            .transition()
            .duration(1000)
            .attr("fill", (d) => {
                d.score = scores.get(d.id) || emptyScore;
                return currentColor[d.score[dimension]];
            });
    }

    function fitCountries(codes) {
        let featureCollection = { type: "FeatureCollection", features: [] };

        for (let code of codes) {
            console.log(code);
            let selection = document.getElementById(`c${code}`).__data__;
            featureCollection.features.push(selection);
        }

        let bounds = getBounds(featureCollection);

            d3.select(".mapstatic-container svg g")
            .transition()
            .duration(1000)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(bounds.translate[0], bounds.translate[1])
                    .scale(bounds.scale)
            );
    }

    function getBounds(featureCollection) {
        let translate, scale;

        let bounds = path.bounds(featureCollection),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2;

            scale = Math.max(
                1,
                Math.min(8, 0.9 / Math.max(dx / width, dy / height))
            );

            translate = [width / 2 - scale * x, height / 2 - scale * y];

        return {scale: scale, translate: translate};
    }

    onMount(() => {
        initMap();
        if (debug) initZoom();
        d3.select(window).on("resize.updatesvg", updateSize);
        fitCountries(["756", "804", "818"])
    });
</script>

<div class="chart-container">
    <div class="mapstatic-container" />
</div>
