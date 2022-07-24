<script>
    import * as d3 from 'd3';
    import data from '../_data/ssd-data.json';

    export let projection;
    export let index;
    export let trigger;

    let feature;
    let init = false;

    $: if (index === trigger) {
        initFeatures();
        init = true;
    } else if(init) {
        init = false;
        removeFeatures();        
    }

    function initFeatures() {
        let svg = d3.select(".map-container svg g");

        feature = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => { return projection(d.coords)[0]})
            .attr("cy", d => { return projection(d.coords)[1]})
            .attr("r", "0px");
        
        feature.transition()
            .duration(1000)
            .attr("r", ".5px")
            .attr("fill", "red")
            .attr("stroke-width", ".25px")
            .attr("stroke", "white")
    }

    function removeFeatures() {
        let circles = d3.selectAll(".map-container circle");
            
        feature.transition()
            .duration(1000)
            .attr("r", "0px")
            .on("end", () => {
                feature.node().parentNode.remove()
            })

    }

</script>