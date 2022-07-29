<script>
    import * as d3 from "d3";
    import { feature } from "topojson-client";
    import { fade } from "svelte/transition";
    import topojson from "../_data/co-adm1.json";

    export let index;
    export let trigger;
    export let path;

    let graph;
    let init = false;

    let display = ["Chocó", "Arauca"];

    const geojson = feature(topojson, topojson.objects["col-hires"]).features;
    const filtered = geojson.filter((d) =>
        display.includes(d.properties.DPTO_CNM_1) ? d : null
    );

    $: if (index === trigger) {
        init = true;
        initFeatures();
    } else if (init) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        console.log("init2");
        let svg = d3.select(".map-container svg g");

        graph = svg
            .append("g")
            .attr("class", "co-adm-path")
            .selectAll(".co-adm-path")
            .data(filtered)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#a0afa0")
            .attr("stroke", "#9c383e")
            .attr("stroke-width", ".25px")

        d3.select(".co-adm-path")
            .selectAll("co-label")
            .data(filtered)
            .enter()
            .append("text")
            .attr("id", (d) => {return d.properties.DPTO_CNM_1})
            .each((d) => {
                if (d.properties.DPTO_CNM_1 === "Chocó") {
                    console.log(d3.select("#Chocó"))
                    d3.select("#Chocó")
                    .attr("x", (d) => {return path.centroid(d)[0]-10})
                    .attr("y", (d) => {return path.centroid(d)[1]})
                    .attr("fill", "black")
                    .text("Chocó")
                    .attr("text-anchor", "start")
                    .attr("class", "test")
                    .attr("font-size", "2pt")
                } else if (d.properties.DPTO_CNM_1 === "Arauca") {
                    d3.select("#Arauca")
                    .attr("x", (d) => {return path.centroid(d)[0]-2})
                    .attr("y", (d) => {return path.centroid(d)[1]-3})
                    .attr("fill", "black")
                    .text("Arauca")
                    .attr("text-anchor", "start")
                    .attr("class", "test")
                    .attr("font-size", "2pt")
                }

            });

        // .append("text")
        // .text((d) => {return d.properties.DPTO_CNM_1})
        // .attr("x", (d) => {
        //     return path.centroid(d)[0];
        // })
        // .attr("y", (d) => {
        //     return path.centroid(d)[1];
        // })
        // .attr("text-anchor", "middle")
        // .attr("font-size", "2pt")

        graph.transition().duration(1000).attr("stroke-width", ".25px");
    }

    function removeFeatures() {
        d3.select(".co-adm-path").remove();

        // graph
        //     .transition()
        //     .duration(1000)
        //     .attr("stroke-width", "0")
        //     .on("end", () => {
        //         graph.node().parentNode.remove();
        //     });
    }
</script>

{#if index === trigger}
    <div class="polygon-feature-legend" in:fade={{ duration: 500 }}>
        <div class="legend-title">
            <p>
                <span class="green">Pillar 3</span> - Road network and affected departments
            </p>
        </div>
        <div class="legend-items-container">
            <div class="legend-item">
                <div>
                    <span class="dot" style="background-color: #005b94; border: 2px solid #9c383e" />
                </div>
                <p class="constraint-name">Affected departments</p>
            </div>
            <div class="legend-item">
                <div>
                    <span class="vl" style="border-color: #f9f871;"/>
                </div>
                <p class="constraint-name">Road network</p>
            </div>
        </div>
        <div class="source-item">
            <p>
                Source(s) : <a
                    href="https://data.humdata.org/organization/15942bd7-524a-40d6-8a60-09bd78110d2d"
                    >OCHA Colombia.</a
                > Exported 21.07.2022
            </p>
        </div>
    </div>
{/if}
