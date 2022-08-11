<script>
    import * as d3 from "d3";
    import { fade } from "svelte/transition";
    import data from "../_data/ssd-data.json";

    export let projection;
    export let index;
    export let trigger;

    let feature;
    let init = false;

    $: if (index === trigger) {
        init = true;
        initFeatures();
    } else if (init) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        let svg = d3.select(".map-container svg g");

        feature = svg
            .append("g")
            .attr("class", "ss-incidents")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => {
                return projection(d.coords)[0];
            })
            .attr("cy", (d) => {
                return projection(d.coords)[1];
            })
            .attr("r", "0px");

        feature
            .transition()
            .duration(1000)
            .attr("r", ".75px")
            .attr("fill", (d) => {
                if (d.type === "Bodily assault") return "#F86C30";
                if (d.type === "Shooting") return "#0096ba";
                if (d.type === "Unknown") return "blue";
            })
            .attr("stroke-width", ".25px")
            .attr("stroke", "white");
    }

    function removeFeatures() {
        feature
            .transition()
            .duration(1000)
            .attr("r", "0px")
            .on("end", () => {
                feature.node().parentNode.remove();
            });
    }
</script>

{#if index === trigger}
    <div class="polygon-feature-legend" in:fade={{ duration: 500 }}>
        <div class="legend-title">
            <p>
                <span class="red">Pillar 2</span> - Recorded aid worker security
                incidents
            </p>
        </div>
        <div class="legend-items-container">
            <div class="legend-item">
                <div>
                    <span class="dot" style="background-color: #0096ba" />
                </div>
                <p class="constraint-name">Shooting</p>
            </div>
            <div class="legend-item">
                <div>
                    <span class="dot" style="background-color: #F86C30" />
                </div>
                <p class="constraint-name">Bodily assault</p>
            </div>
            <div class="legend-item">
                <div>
                    <span class="dot" style="background-color: green" />
                </div>
                <p class="constraint-name">Unknown</p>
            </div>
        </div>
        <div class="source-item">
            <p>
                Source(s) : <a href="https://ukraine-analysis-hub.acaps.org/"
                    >Aid Worker Security Database</a
                >, data covers period 01.01.2022 to 15.07.2022. Exported
                15.07.2022
            </p>
        </div>
    </div>
{/if}
