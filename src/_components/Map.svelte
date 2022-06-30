<script>
    import { onMount } from 'svelte';
    import { feature } from 'topojson-client';
    import { geoPath, geoMercator} from 'd3-geo';

    import worldTopo from '../_data/countries-50m.json';
    import accessData from '../_data/access-data.json';

    import * as d3 from 'd3';

    export let nextStep = {
        translate: [0,0],
        scale: 1
    };

    // Updates map whenever a newStep is received
    $: tweenSteps(nextStep.scale, nextStep.translate);
    // Updates dimension whenever a newStep is received
    $: updateDimension(nextStep.dimension)
    
    const projection = geoMercator().scale(120);
    const path = geoPath().projection(projection);

    const worldjson = feature(worldTopo, worldTopo.objects.countries).features;

    const pillarSteps = {
        SCORE: ["#FFFFFF", "#FFD76D", "#FEA649", "#F86C30", "#E62F21", "#991824"],
        P1: ["#FFFFFF", "#E1F2F6", "#C8DFE8", "#7FB1D4", "#3E78B3", "#133267"],
        P2: ["#FFFFFF", "#E1EFD3", "#CBE8B8", "#95C987", "#4A9351", "#1A4220"],
        P3: ["#FFFFFF", "#E0D3D9", "#CC9EAF", "#A3405C", "#752345", "#351229"]
    };

    function addScoreClasses(feature) {
        let className;
        let name = feature.properties.name;
        let country = accessData.find(el => el.Country === name);
        if (country === undefined) {
            className = '';
        } else {
            let score = country.SCORE;
            let P1 = country.P1;         
            let P2 = country.P2;         
            let P3 = country.P3;
            className = `Ranked ${country.Country} Score-${score} P1-${P1} P2-${P2} P3-${P3}`          
        }
        return className;
    }

    // Applies accessData country name to country path
    function addCountryID(feature) {
        let id;
        let name = feature.properties.name;
        let country = accessData.find(el => el.Country === name);
        if (country === undefined) {
            id="";
        } else {
            id = country.Country;
        }
        return id;
    }

    /**
     * Updates ranked countries to given dimension colour gradient
     * @param {string} dimension
     */
    export function updateDimension(dimension) {
        let steps = pillarSteps[dimension];
        let elements = document.getElementsByClassName("Ranked");
        for (let path of elements) {
            let country = accessData.find(el => el.Country === path.id);
            let color = steps[country[dimension]];
            path.setAttribute('style', `fill: ${color}`)
        }
    }

    // Zoom init
    export let debug = false;

    let zoom = d3.zoom().on('zoom', handleZoom);

    function initZoom() {
        d3.select('.map-container svg').call(zoom);
    }

    function handleZoom(e) {
    d3.select("svg g")
    .attr('transform', e.transform);
    }

    /**
     * Transitions from current transform to given new scale and translation
     * @param {number} scale 
     * @param {Array} translate [x,y]
     */
    export function tweenSteps(scale, translate) {
        d3.select("svg g")
         .transition()
         .duration(1000)
         .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    onMount(() => {
        console.log('Map component mounted');
        worldjson.forEach(el => addScoreClasses(el));
        updateDimension("SCORE");
        if (debug) initZoom();
    });

    let tweenTranslate = [-6462.515760714943,-1449.3224019238412];
    let tweenScale = 12.746241540569306;
    
</script>

<button on:click={() => updateDimension("SCORE")}>Update Access</button>
<button on:click={() => updateDimension("P1")}>Update P1</button>
<button on:click={() => updateDimension("P2")}>Update P2</button>
<button on:click={() => updateDimension("P3")}>Update P3</button>
<button on:click={() => tweenSteps(tweenScale, tweenTranslate)}>tweenStep</button>
<button on:click={() => tweenSteps(12.74624154056931, [-7425.200238124638,-2003.7844077329937])}>tweenStep</button>

<div class="map-container">
    <svg viewBox="0 0 975 450">
        <g fill="white" stroke="black" stroke-width=".25px">
            {#each worldjson as feature, i}
            <path 
                d={path(feature)}
                class={addScoreClasses(feature)}
                id={addCountryID(feature)}
            />
            {/each}
        </g>
    </svg>
</div>

<style>
    svg {
        background-color: #eeeeee;
    }
</style>