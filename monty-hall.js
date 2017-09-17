/**
 * Monty Hall problem
 * 
 *
 * */



function randint(min, max) {
  return ~~(Math.random() * (max - min) + min)
}
function genDoors() {
  return [
    "car",
    "sheep",
    "sheep"
  ]
}
function showSheep(doors, opened) {
  return ["car", "sheep"]
}

function exp(reselect = false, n = 10000) {
  let hit = 0
  for (let i = 0; i < n; i++) {
    let doors = genDoors()
    let select = randint(0, doors.length)
    let door = doors[randint(0, doors.length)]
    doors = showSheep(doors, select)
    if (reselect) {
      if (door === "car") {
        door = "sheep"
      } else {
        door = "car"
      }
    }
    if (door === "car") {
      hit++
    }
  }
  return hit / n
}
console.log("不重选的中奖概率:", exp())
console.log("重选的中奖概率:", exp(true))