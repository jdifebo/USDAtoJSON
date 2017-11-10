var foodDescriptions = require("./output/foodDescriptions.json");
var nutrientDefinitions = require("./output/nutrientDefinitions.json");

var broccoli = foodDescriptions["11090"];
var broccoliNutrients = broccoli.nutrients.forEach(nutrientValue => {
    nutrientValue.nutrientDescription = nutrientDefinitions[nutrientValue.nutrientId].description;
    nutrientValue.nutrientUnits = nutrientDefinitions[nutrientValue.nutrientId].units;
})
console.log(JSON.stringify(broccoli, null, 2))