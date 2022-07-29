<script>
    import * as d3 from 'd3';
    import { feature } from "topojson-client";
    import roads from "../_data/co-roadnetwork.json";

    export let index;
    export let trigger;
    export let path;

    let graph;
    let init = false;

    const geojson = feature(roads, roads.objects["red_vial"]).features;

    $: if (index === trigger) {
        init = true;
        initFeatures();
    } else if (init && index != trigger) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        let svg = d3.select(".map-container svg g");

        graph = svg.append("g")
            .attr("class", "co-roads")
            .selectAll(".COpath")
            .data(geojson)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#f9f871")
            .attr("fill", "black")
            .attr("fill-opacity", "0")
            .attr("stroke-width", "0px");

        graph.transition()
            .duration(1000)
            .attr("stroke-width", ".25px")

    }

    function removeFeatures() {
        graph
            .transition()
            .duration(1000)
            .attr("stroke-width", "0")
            .on("end", () => {
                graph.node().parentNode.remove()
            })
        
        d3.select(".co-roads").remove();
    }
</script>
