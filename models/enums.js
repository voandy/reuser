// define states
const States = Object.freeze({
  VIC: "VIC",
  NSW: "NSW",
  QLD: "QLD",
  TAS: "TAS",
  SA: "SA",
  NT: "NT",
  WA: "WA"
});

// define categories
const Categories = Object.freeze({
  Materials: "materials",
  Food: "food",
  Clothing: "clothing",
  Electronics: "electronics",
  Furniture: "furniture",
  Decor: "decor",
  Misc: "misc",
});

module.exports.States = States;
module.exports.Categories = Categories;
