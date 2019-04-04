// define states
const State = Object.freeze({
  VIC: "VIC",
  NSW: "NSW",
  QLD: "QLD",
  TAS: "TAS",
  SA: "SA",
  NT: "NT",
  WA: "WA"
});

// define categories
const Category = Object.freeze({
  Materials: "materials",
  Food: "food",
  Clothing: "clothing",
  Electronics: "electronics",
  Furniture: "furniture",
  Decor: "decor",
  Misc: "misc",
});

module.exports.State = State;
module.exports.Category = Category;
