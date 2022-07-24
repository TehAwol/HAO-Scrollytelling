<script>
    import * as d3 from "d3";
    import { select, selectAll } from "d3";
    import { onMount } from "svelte";

    export let anchor;
    export let selection;
    let data, init;

    let margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let initData = [
        { pillar: "Access Score", value: 2 },
        { pillar: "Pillar 1", value: 3 },
        { pillar: "Pillar 2", value: 4 },
        { pillar: "Pillar 3", value: 5 },
    ];

    $: if (selection != undefined && init === true)
        (data = [
            { pillar: "Access Score", value: selection.P0 },
            { pillar: "Access of people in need to aid", value: selection.P1 },
            {
                pillar: "Access of humanitarian agencies to people in need",
                value: selection.P2,
            },
            {
                pillar: "Physical, environmental, and security constraints",
                value: selection.P3,
            },
        ]),
            updateChart();

    $: if (selection === undefined) (data = initData), updateChart();

    function initChart() {
        if (init) return;
        init = true;

        let svg = d3
            .select(anchor)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        let x = d3.scalePoint().domain([0,1,2,3,4,5]).range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        let y = d3
            .scaleBand()
            .range([0, height])
            .domain(
                initData.map(function (d) {
                    return d.pillar;
                })
            )
            .padding(0.1);
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll("myRect")
            .data(initData)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function (d) {
                return y(d.pillar);
            })
            .attr("width", function (d) {
                return x(d.value);
            })
            .attr("height", y.bandwidth())
            .attr("fill", "#0096ba");
    }

    function updateChart() {
        let svg = select(anchor);

        let x = d3.scaleLinear().domain([0, 5]).range([0, width]);
        let y = d3
            .scaleBand()
            .range([0, height])
            .domain(
                data.map(function (d) {
                    return d.pillar;
                })
            )
            .padding(0.1);

        let u = svg.selectAll("rect").data(data);

        u.enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", (d) => {
                return y(d.pillar);
            })
            .attr("width", (d) => {
                return x(d.value);
            })
            .attr("height", y.bandwidth())
            .attr("fill", "#0096ba");
    }

    onMount(() => {
        initChart();
    });
</script>
