let tables = []
let i = 0;

function moveElement(arr, fromIndex, toIndex) {
    return arr.map((item, index) => {
        if (index === toIndex) return arr[fromIndex];
        if (index === fromIndex) return arr[toIndex];
        return item;
    });
}

module.exports = (table) => {
  i++;

  if(Array.isArray(table)) {
    for(const elm of table) {
        tables.push(elm)
    }
  } else {
    tables.push(table)
  }
  
  if(i >= 3) {
    let v = 0
    tables.map((x) => {
        if(x.getTitle() !== "Deployed") {
            v += 1
        } else {
            return
        }
    })
    tables = moveElement(tables, v, 0)
    for(const t of tables) {
        console.log(t.toString())
    }
  }
}