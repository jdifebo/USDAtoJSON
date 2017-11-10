"use strict";
exports.__esModule = true;
var fs = require("fs");
var foodGroups = asciiToJson("./USDA/FD_GROUP.txt", function (line) {
    return {
        id: line[0],
        description: line[1]
    };
});
fs.writeFileSync("./output/foodGroups.json", JSON.stringify(foodGroups, null, 0));
var nutrientDefinitions = asciiToJson("./USDA/NUTR_DEF.txt", function (line) {
    return {
        id: line[0],
        units: line[1],
        tagname: line[2],
        description: line[3],
        decimals: line[4],
        srOrder: line[5]
    };
});
fs.writeFileSync("./output/nutrientDefinitions.json", JSON.stringify(nutrientDefinitions, null, 0));
var foodDescriptions = asciiToJson("./USDA/FOOD_DES.txt", function (line) {
    return {
        id: line[0],
        foodGroupId: line[1],
        longDescription: line[2],
        shortDescription: line[3],
        commonNames: line[4] || undefined,
        manufacturerName: line[5] || undefined,
        survey: line[6] == "Y" ? true : false,
        refuseDescription: line[7] || undefined,
        refusePercent: line[8] ? Number(line[8]) : undefined,
        scientificName: line[9] || undefined,
        nitrogenFactor: line[10] ? Number(line[10]) : undefined,
        proteinFactor: line[11] ? Number(line[11]) : undefined,
        fatFactor: line[12] ? Number(line[12]) : undefined,
        carbFactor: line[13] ? Number(line[13]) : undefined,
        nutrients: [],
        weights: []
    };
});
var nutrientDataLines = fs.readFileSync(require.resolve("./USDA/NUT_DATA.txt"), 'utf8').split("\r\n");
var nutrientDataTokenizedLines = nutrientDataLines.map(function (line) { return line.replace(/~/g, "").split(/\^/); });
nutrientDataTokenizedLines.forEach(function (line) {
    var nutrients = foodDescriptions[line[0]].nutrients;
    nutrients.push({
        nutrientId: line[1],
        value: Number(line[2]),
        dataPoints: Number(line[3]),
        standardError: line[4] ? Number(line[4]) : undefined,
        sourceCode: Number(line[5])
    });
});
var weightLines = fs.readFileSync(require.resolve("./USDA/WEIGHT.txt"), 'utf8').split("\r\n");
var weightTokenizedLines = weightLines.map(function (line) { return line.replace(/~/g, "").split(/\^/); });
weightTokenizedLines.forEach(function (line) {
    var weights = foodDescriptions[line[0]].weights;
    weights.push({
        amount: Number(line[2]),
        description: line[3],
        gramWeight: Number(line[4]),
        dataPoints: line[5] ? Number(line[5]) : undefined,
        standardDeviation: line[6] ? Number(line[6]) : undefined
    });
});
fs.writeFileSync("./output/foodDescriptions.json", JSON.stringify(foodDescriptions, null, 0));
function asciiToJson(inputFile, mapper) {
    var fileLines = fs.readFileSync(require.resolve(inputFile), 'utf8').split("\r\n");
    var tokenizedLines = fileLines.map(function (line) { return line.replace(/~/g, "").split(/\^/); });
    var jsonToReturn = {};
    tokenizedLines.forEach(function (line) {
        jsonToReturn[line[0]] = mapper(line);
    });
    return jsonToReturn;
}
