const fs = require("fs");

const file = "./db.json";

if (!fs.existsSync(file))
  fs.writeFileSync(file,"{}");

const db = JSON.parse(
  fs.readFileSync(file)
);

function save(){
  fs.writeFileSync(file,
    JSON.stringify(db,null,2)
  );
}

db.groups ??= {};


module.exports = { db, save };
