<script>
    import * as d3 from "d3";
    import { filter } from "d3";
    import { feature } from "topojson-client";
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
        initFeatures();
        init = true;
    } else if (init) {
        init = false;
        removeFeatures();
    }

    function initFeatures() {
        console.log("init2");
        let svg = d3.select(".map-container svg g");

        graph = svg
            .append("g")
            .attr("class", "CO-adm-path")
            .selectAll(".CO-adm-path")
            .data(filtered)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#1A4220")
            .attr("stroke", "white")
            .attr("stroke-width", "0px");

        svg.append("g")
            .selectAll("text")
            .data(filtered)
            .enter()
            .append("text")
            .text((d) => {return d.properties.DPTO_CNM_1})
            .attr("dx", (d) => {
                return path.centroid(d)[0];
            })
            .attr("dy", (d) => {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "2pt")

        graph.transition().duration(1000).attr("stroke-width", ".25px");
    }

    function removeFeatures() {
        console.log("removed")
        graph
            .transition()
            .duration(1000)
            .attr("stroke-width", "0")
            .on("end", () => {
                graph.node().parentNode.remove();
            });
    }
</script>
