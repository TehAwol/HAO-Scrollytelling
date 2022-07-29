<script>
    import * as d3 from "d3";
    import { fade } from "svelte/transition";
    import { feature } from "topojson-client";
    import data from "../_data/ua-adm1.json";
    import incidents from "../_data/ua-incidents.json";

    export let index;
    export let trigger;
    export let path;

    let graph;
    let init = false;

    const geojson = feature(data, data.objects["UKR-ADM1-14850775"]).features;

    let colorRange = [
        "#D9D9D9",
        "#E1F2F6",
        "#C8DFE8",
        "#7FB1D4",
        "#3E78B3",
        "#133267",
    ];

    let domainRange = [0, 15, 30, 45, 60, 75];

    let ledger = new Map();
    for (let entry of incidents) {
        ledger.set(entry.name, entry.count);
    }

    let color = d3.scaleThreshold().domain(domainRange).range(colorRange);

    $: if (index === trigger) {
        init = true;
        initFeatures();
    } else if (init) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        let svg = d3.select(".map-container svg g");

        graph = svg
            .append("g")
            .attr("class", "ua-paths")
            .selectAll(".ua-path")
            .data(geojson)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "white")
            .attr("fill", "#D9D9D9")
            .attr("fill-opacity", "0")
            .attr("stroke-opacity", "0");

        graph
            .transition()
            .duration(1000)
            .attr("stroke", "white")
            .attr("stroke-width", ".25px")
            .attr("fill", (d) => {
                d.total = ledger.get(d.properties.shapeName) || 0;
                return color(d.total);
            })
            .attr("fill-opacity", "1")
            .attr("stroke-opacity", "1");
    }

    function removeFeatures() {
        // graph
        //     .transition()
        //     .duration(1000)
        //     .attr("fill-opacity", "0")
        //     .attr("stroke-opacity", "0")
        //     .on("end", () => {
        //         graph.node().parentNode.remove();
        //     });

        d3.select(".ua-paths").remove();
    }
</script>

{#if index === trigger}
    <div class="polygon-feature-legend" in:fade={{ duration: 500 }}>
        <div class="legend-title">
            <p>
                <span class="blue">Pillar 1</span> - Amount of recorded events relating
                to access of people in need to aid
            </p>
        </div>
        <div class="legend-items-container">
            {#each colorRange as color, i}
                <div class="legend-item">
                    <div>
                        <span class="dot" style="background-color: {color}" />
                    </div>
                    <p class="constraint-name">&lt; {domainRange[i]}</p>
                </div>
            {/each}
        </div>
        <div class="source-item">
            <p>
                Source(s) : <a href="https://ukraine-analysis-hub.acaps.org/"
                    >ACAPS</a
                >, data covers period 24.02.2022 to 20.07.2022. Exported
                21.07.2022
            </p>
        </div>
    </div>
{/if}
