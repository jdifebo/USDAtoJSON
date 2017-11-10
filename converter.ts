import * as fs from 'fs';

let foodGroups = asciiToJson("./USDA/FD_GROUP.txt", line => {
    return {
        id: line[0],
        description: line[1]
    }
});
fs.writeFileSync("./output/foodGroups.json", JSON.stringify(foodGroups, null, 0));

let nutrientDefinitions = asciiToJson("./USDA/NUTR_DEF.txt", line => {
    return {
        id: line[0],
        units: line[1],
        tagname: line[2],
        description: line[3],
        decimals: line[4],
        srOrder: line[5]
    }
});
fs.writeFileSync("./output/nutrientDefinitions.json", JSON.stringify(nutrientDefinitions, null, 0));

let foodDescriptions = asciiToJson("./USDA/FOOD_DES.txt", line => {
    return {
        id: line[0],
        foodGroupId: line[1],
        longDescription: line[2],
        shortDescription: line[3],
        commonNames: line[4] || undefined,
        manufacturerName: line[5] || undefined,
        survey: line[6] == "Y" ? true : false,
        refuseDescription: line[7] || undefined,
        refusePercent: line[8]? Number(line[8]) : undefined,
        scientificName: line[9] || undefined,
        nitrogenFactor: line[10] ? Number(line[10]) : undefined,
        proteinFactor: line[11] ? Number(line[11]) : undefined,
        fatFactor: line[12] ? Number(line[12]) : undefined,
        carbFactor: line[13] ? Number(line[13]) : undefined,
        nutrients: [],
        weights: []
    }
});

let nutrientDataLines: string[] = fs.readFileSync(require.resolve("./USDA/NUT_DATA.txt"), 'utf8').split("\r\n");
let nutrientDataTokenizedLines: string[][] = nutrientDataLines.map(line => line.replace(/~/g, "").split(/\^/));
nutrientDataTokenizedLines.forEach(line => {
    let nutrients = foodDescriptions[line[0]].nutrients;
    nutrients.push({
        nutrientId: line[1],
        value: Number(line[2]),
        dataPoints: Number(line[3]),
        standardError: line[4] ? Number(line[4]) : undefined,
        sourceCode: Number(line[5])
    })
})


let weightLines: string[] = fs.readFileSync(require.resolve("./USDA/WEIGHT.txt"), 'utf8').split("\r\n");
let weightTokenizedLines: string[][] = weightLines.map(line => line.replace(/~/g, "").split(/\^/));
weightTokenizedLines.forEach(line => {
    let weights = foodDescriptions[line[0]].weights;
    weights.push({
        amount: Number(line[2]),
        description: line[3],
        gramWeight: Number(line[4]),
        dataPoints: line[5] ? Number(line[5]) : undefined,
        standardDeviation: line[6] ? Number(line[6]) : undefined,
    })
})

fs.writeFileSync("./output/foodDescriptions.json", JSON.stringify(foodDescriptions, null, 0));

function asciiToJson(inputFile: string, mapper) {
    let fileLines: string[] = fs.readFileSync(require.resolve(inputFile), 'utf8').split("\r\n");
    let tokenizedLines: string[][] = fileLines.map(line => line.replace(/~/g, "").split(/\^/));
    let jsonToReturn = {};
    tokenizedLines.forEach(line => {
        jsonToReturn[line[0]] = mapper(line);
    });
    return jsonToReturn;
}