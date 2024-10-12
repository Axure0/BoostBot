let tables = []
let i = 0;

module.exports = (table) => {
  i++;

  if(Array.isArray(table)) {
    for(const elm of table) {
        tables.push(elm)
    }
  } else {
    tables.push(table)
  }
  
  if(i >= 2) {
    for(const t of tables) {
        console.log(t.toString())
    }
  }
}