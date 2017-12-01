fs = require('fs')

let usdaVitaminNames = {
    1: "Vitamin A, RAE",
    2: "Vitamin C, total ascorbic acid",
    3: "Vitamin D (D2 + D3)",
    4: "Vitamin E (alpha-tocopherol)",
    5: "Vitamin K (phylloquinone)",
    6: "Thiamin",
    7: "Riboflavin",
    8: "Niacin",
    9: "Vitamin B-6",
    10: "Folate, DFE",
    11: "Vitamin B-12",
}

let usdaMacronutrientNames = {
    2: "Carbohydrate, by difference",
    3: "Fiber, total dietary",
    4: "Total lipid (fat)",
    7: "Protein",
}

let usdaMineralNames = {
    1: "Calcium, Ca",
    3: "Copper, Cu",
    6: "Iron, Fe",
    7: "Magnesium, Mg",
    8: "Manganese, Mn",
    10: "Phosphorus, P",
    11: "Selenium, Se",
    12: "Zinc, Zn",
    13: "Potassium, K",
    14: "Sodium, Na",
}

let result = {
    "Infants": { "0–6 mo": {}, "6–12 mo": {} }, 
    "Children": { "1–3 y": {}, "4–8 y": {} }, 
    "Males": { "9–13 y": {}, "14–18 y": {}, "19–30 y": {}, "31–50 y": {}, "51–70 y": {}, "> 70 y": {} },
    "Females": { "9–13 y": {}, "14–18 y": {}, "19–30 y": {}, "31–50 y": {}, "51–70 y": {}, "> 70 y": {} }, 
    "Pregnancy": { "14–18 y": {}, "19–30 y": {}, "31–50 y": {} }, 
    "Lactation": { "14–18 y": {}, "19–30 y": {}, "31–50 y": {} }
};

function readNutrientsFromFile(filename, usdaNames){
    fs.readFile('data/NIH/' + filename, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let lines = data.split("\r\n").map(line => line.trim());
        let currentCategory = "";
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            if (!line.includes("\t")) {
                currentCategory = line;
            }
            else {
                values = line.split("\t");
                // console.log(values);
                for (let key in usdaNames) {
                    // console.log(currentCategory, values[0]);
                    // console.log(result[currentCategory][values[0]]);
                    result[currentCategory][values[0]][usdaNames[key]] = {min : (parseFloat(values[key].replace(",", "")) || 0)};
                }
            }
        }
        console.log(JSON.stringify(result.Males["19–30 y"]));
    });
}


readNutrientsFromFile("vitamins.tsv", usdaVitaminNames);
readNutrientsFromFile("macronutrients.tsv", usdaMacronutrientNames);
readNutrientsFromFile("elements.tsv", usdaMineralNames);
