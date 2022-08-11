export const scrollyConfig = {
    map: {
        0: {
            code: "000",
            dimension: "P0",
        },
        1: {
            dimension: "P0",
            code: ["232", "104", "804", "887"],
            isolate: ["232", "104", "804", "887"],
        },
        2: {
            dimension: "P0",
            code: "000",
            isolate: [
                "148",
                "222",
                "356",
                "360",
                "458",
                "104",
                "516",
                "586",
                "729",
                "804",
                "887",
            ],
        },
        3: {
            dimension: "P0",
            code: "000",
            isolate: [
                "004",
                "031",
                "120",
                "140",
                "178",
                "262",
                "408",
                "748",
                "231",
                "300",
                "340",
                "426",
                "466",
                "504",
                "562",
                "566",
                "604",
                "724",
                "275",
                "760",
                "780",
                "862",
            ],
        },
        4: {
            dimension: "P0",
            code: "000",
        },
        5: {
            dimension: "P1",
            code: "000",
        },
        6: {
            dimension: "P1",
            code: ["360", "792"],
            region: ["Asia"]
        },
        7: {
            dimension: "P1",
            code: "804",
            isolate: ["001"],
        },
        8: {
            dimension: "P2",
            code: "000",
        },
        9: {
            dimension: "P2",
            code: ["104", "728", "729"],
            isolate: ["104", "728", "729"],
        },
        10: {
            dimension: "P2",
            code: "728",
            isolate: ["728"]
        },
        11: {
            dimension: "P3",
            code: "000",
        },
        12: {
            dimension: "P3",
            code: ["504", "710", "818", "450"],
            region: ["Africa"] 
        },
        13: {
            dimension: "P3",
            code: "170",
            isolate: ["170"]
        },
        14: {
            dimension: "P0",
            code: "000",
        },
    },
};

 // Color gradient config
export const colorSteps = {
    P0: ["#D9D9D9", "#FFD76D", "#FEA649", "#F86C30", "#E62F21", "#991824"],
    P1: ["#D9D9D9", "#E1F2F6", "#C8DFE8", "#7FB1D4", "#3E78B3", "#133267"],
    P2: ["#D9D9D9", "#E0D3D9", "#CC9EAF", "#A3405C", "#752345", "#351229"],
    P3: ["#D9D9D9", "#E1EFD3", "#CBE8B8", "#95C987", "#4A9351", "#1A4220"],
};

export const constraintSteps = [
    "No significant access constraints",
    "Low access constraints",
    "Moderate access constraints",
    "High access constraints",
    "Very high access constraints",
    "Extreme access constraints",
];
