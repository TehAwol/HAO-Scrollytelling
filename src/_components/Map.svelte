<script>
    import { onMount } from 'svelte';
    import { feature } from 'topojson-client';
    import { geoPath, geoAlbers, geoMercator} from 'd3-geo';

    import worldTopo from '../_data/countries-50m.json';
    import accessData from '../_data/access-data.json';
    
    const projection = geoMercator().scale(120);
    const path = geoPath().projection(projection);

    const worldjson = feature(worldTopo, worldTopo.objects.countries).features;

    const colorSteps = ["#D9D9D9", "#FFD76D", "#FEA649", "#F86C30", "#E62F21", "#991824"];
    const pillarSteps = {
        SCORE: ["#D9D9D9", "#FFD76D", "#FEA649", "#F86C30", "#E62F21", "#991824"],
        P1: ["#D9D9D9", "#E1F2F6", "#C8DFE8", "#7FB1D4", "#3E78B3", "#133267"],
        P2: ["#D9D9D9", "#E1EFD3", "#CBE8B8", "#95C987", "#4A9351", "#1A4220"],
        P3: ["#D9D9D9", "#E0D3D9", "#CC9EAF", "#A3405C", "#752345", "#351229"]
    };
    

    function findColor(feature) {
        let color;
        let name = feature.properties.name;
        let score = accessData.find(el => el.Country === name);
        if (score === undefined) {
            color = "#D9D9D9";
        } else {
            color = colorSteps[score.SCORE];
        }
        return color;
    }

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

    function updateDimension(dimension) {
        let steps = pillarSteps[dimension];
        let elements = document.getElementsByClassName("Ranked");
        for (let path of elements) {
            let country = accessData.find(el => el.Country === path.id);
            let color = steps[country[dimension]];
            path.setAttribute('style', `fill: ${color}`)
        }
    }

    worldjson.forEach(el => addScoreClasses(el));

    onMount(() => {
        console.log('Map component mounted')
    }); 

</script>

<button on:click={() => updateDimension("SCORE")}>Update Access</button>
<button on:click={() => updateDimension("P1")}>Update P1</button>
<button on:click={() => updateDimension("P2")}>Update P2</button>
<button on:click={() => updateDimension("P3")}>Update P3</button>

<div class="map-container">
    <svg viewBox="0 0 975 450">
        <g fill="white" stroke="black" stroke-width=".5px">
            {#each worldjson as feature, i}
            <path 
                d={path(feature)}
                fill={findColor(feature)}
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