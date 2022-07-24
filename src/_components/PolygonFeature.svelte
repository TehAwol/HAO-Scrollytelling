<script>
    import * as d3 from "d3";
    import { feature } from "topojson-client";
    import data from "../_data/ua-adm1.json";
    import incidents from "../_data/ua-incidents.json";

    export let index;
    export let trigger;
    export let path;

    let graph;
    let init = false;

    const geojson = feature(data, data.objects["UKR-ADM1-14850775"]).features;

    let ledger = new Map();
    for (let entry of incidents) {
        ledger.set(entry.name, entry.count);
    }

    let colorScale = d3
        .scaleThreshold()
        .domain([0, 20, 40, 60, 80, 100])
        .range([
            "#D9D9D9",
            "#E1F2F6",
            "#C8DFE8",
            "#7FB1D4",
            "#3E78B3",
            "#133267",
        ]);

    $: if (index === trigger) {
        initFeatures();
        init = true;
    } else if (init) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        let svg = d3.select(".map-container svg g");

        graph = svg.append("g")
            .selectAll(".UApath")
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
                return colorScale(d.total);
            })
            .attr("fill-opacity", "1")
            .attr("stroke-opacity", "1")
    }

    function removeFeatures() {
        graph
            .transition()
            .duration(1000)
            .attr("fill-opacity", "0")
            .attr("stroke-opacity", "0")
            .on("end", () => {
                graph.node().parentNode.remove()
            })
    }
</script>
