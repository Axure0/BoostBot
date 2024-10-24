let tables = []
let i = 0;

function moveElm(arr, elm) {
    let newArray = []

    if(Array.isArray(elm)) {
      for(const e of elm) {
        let i = arr.findIndex((x) => x?.getTitle() == e)

        if(i === -1) return arr

        newArray.push(arr[i])
        arr.splice(i, 1)
      }
    }
  
    for (const e of arr) {
      newArray.push(e)
    }  
  
    return newArray
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
    let newTables = moveElm(tables, ["Deployed", "Client", "Events", "Message Commands"])

    for(const t of newTables) {
        console.log(t.toString())
    }
  }
}