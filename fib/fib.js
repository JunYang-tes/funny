const Big = require("bn.js")
function matMul(add, mul) {
  return function (a1, a2) {
    return [[add(mul(a1[0][0], a2[0][0]), mul(a1[0][1], a2[1][0])),
    add(mul(a1[0][0], a2[0][1]), mul(a1[0][1], a2[1][1]))],
    [
      add(mul(a1[1][0], a2[0][0]), mul(a1[1][1], a2[1][0])),
      add(mul(a1[1][0], a2[0][1]), mul(a1[1][1], a2[1][1]))
    ]]
  }
}
const nMatMul = matMul((a, b) => a + b, (a, b) => a * b)
const bMatMul = matMul((a, b) => a.add(b), (a, b) => a.mul(b))


function matPow(matMul) {
  return function pow(a, n) {
    if (n === 2) {
      return matMul(a, a)
    } else if (n % 2 === 0) {
      let tmp = pow(a, n / 2)
      return matMul(tmp, tmp)
    } else {
      return matMul(a, pow(a, n - 1))
    }
  }
}

function time(n, fn) {
  let c = n
  let t1 = Date.now()
  let ret
  while (n--)
    ret = fn()
  let t2 = Date.now()
  return {
    time: (t2 - t1) / c,
    result: ret
  }
}
function matFibGen(matPow, number) {
  return function _matFib(n) {
    return matPow([[number(1), number(1)], [number(1), number(0)]], n - 1)[0][0]
  }
}

const numberMatFib = matFibGen(matPow(nMatMul), a => a)
const bigNumberMatFib = matFibGen(matPow(bMatMul), a => new Big(a))


function loopFibGen(add, number) {
  return function loopFib(n) {
    var a = number(0), b = number(1)
    let tmp = number(0)
    while (n-- > 1) {
      tmp = add(a, b)
      a = b
      b = tmp
    }
    return tmp
  }
}
const bigNumberLoopFib = loopFibGen((a, b) => a.add(b), a => new Big(a))

function TtransFibGen(num, add, mul) {
  function TtransFib(n, a, b, p, q) {
    if (n === 0) {
      return b
    } else if (n % 2 === 0) {
      return TtransFib(n / 2,
        a, b,
        add(
          mul(p, p),
          mul(q, q)),
        add(
          mul(mul(num(2), p), q),
          mul(q, q)
        )
      )
    } else {
      return TtransFib(
        n - 1,
        add(
          add(mul(b, q), mul(a, q)),
          mul(a, p)
        ),
        add(mul(b, p), mul(a, q)),
        p, q
      )
    }
  }
  return function TranFib(n) {
    return TtransFib(n, num(1), num(0), num(0), num(1))
  }
}

const bigNumberTransFib = TtransFibGen(a => new Big(a), (a, b) => a.add(b), (a, b) => a.mul(b))


function compare(ns, ...fibs) {
  for (let n of ns) {
    for (let fib of fibs) {
      let t = time(10, () => (`${fib.name}(${n})=${fib(n)}`.substr(0, 70)))
      console.error(`${t.result}... ${t.time}ms`)
    }
  }
}

function outputGnuPlotData(fib) {
  console.log(`#n time ${fib.name} `)
  let from = 100
  let to = 10000
  let step = 100
  let x = []
  let y = []
  for (let i = from; i < to; i += step) {
    let t = time(10, () => fib(from + i))
    console.log(from + i, t.time)
  }
}

const bnMethods = {
  add: (n) => {
    while (n--) {
      new Big(n).add(new Big(n))
    }
  },
  mul: (n) => {
    while (n--) {
      new Big(n).mul(new Big(n))
    }
  }
}


const fibs = {
  "num-loop": loopFibGen((a, b) => a + b, a => a),
  "big-num-loop": bigNumberLoopFib,
  "num-matrix": numberMatFib,
  "big-num-matrix": bigNumberMatFib,
  "big-num-trans": bigNumberTransFib
}

const program = require("cli-argparser").program
program({
  compare: {
    from: {
      default: 2000,
      type: "number",
    },
    to: {
      default: 10000,
      type: "number"
    },
    step: {
      default: 1000,
      type: "number"
    }
  },
  "gnu-plot-data": {
    type: {
      type: "item",
      required: true,
      range: Object.keys(fibs)
    }
  },
  "bnjs-test": {
    type: {
      type: "item",
      required: true,
      range: ["add", "mul"]
    }
  }
}, {
    compare({ from, to, step }) {
      console.error("Compare:")
      let arry = []
      for (let i = from; i < to; i += step) {
        arry.push(i)
      }
      compare(arry, bigNumberMatFib, bigNumberLoopFib, bigNumberTransFib)
    },
    "gnu-plot-data"({ type }) {
      outputGnuPlotData(fibs[type])
    },
    "bnjs-test"({ type }) {
      outputGnuPlotData(bnMethods[type])
    }
  })