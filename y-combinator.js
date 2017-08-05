(() => {

    /**
     * Curry version
     *
     *
     */
    let lambda = (fn) => {
        return (...args) => {
            if (args.length < fn.length) {
                return fn.bind(this, ...args)

            }
            return fn(...args)

        }

    }
    let Y = F => {
        let f = (self) => (...args) => lambda(F)((...arg) => self(self)(...arg), ...args)
        return f(f)

    }
    let fact = Y((p, n) => n == 0 ? 1 : n * p(n - 1))
    let fib = Y((p, n) => n <= 2 ? 1 : p(n - 1) + p(n - 2))
    console.log(`5!= ${fact(5)}`)
    console.log(`fib(10)=${fib(10)}`)
})()

; (() => {
    let Y = F => {
        let f = (self) => (...args) => F((...arg) => self(self)(...arg))(...args)
        return f(f)
    }
    let factorial = Y(fact => n => n == 0 ? 1 : n * fact(n - 1))
    let fibonacci = Y(fib => n => n <= 2 ? 1 : fib(n - 1) + fib(n - 2))
    console.log(`5!=${factorial(5)}`)
    console.log(`fib(10)=${fibonacci(10)}`)
})()

