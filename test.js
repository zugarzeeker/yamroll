#!/usr/bin/env node

const fs = require('fs')
const cp = require('child_process')
const assert = require('power-assert')

const solve = (command, input) => new Promise((resolve) => {
  const child = cp.execSync(command)
  child.stdin.write(input)
  child.stdout.on('data', (output) => {
    resolve(output)
  })
  child.stdin.end()
})

const test = (command, testCases) => {
  describe(command, () => {
    testCases.map((testCase, i) => {
      const input = fs.readFileSync(`${testCase}.in`)
      const expectedOutput = fs.readFileSync(`${testCase}.out`)
      solve(command, input).then((actualOutput) => {
        it(`should solve [${i + 1}][${testCase}] correctly`, () => {
          assert(actualOutput == expectedOutput)
        })
      })
    })
  })
}

const start = () => {
  const command = JSON.parse(process.env.command)
  const testCases = JSON.parse(process.env.testCases)
  test(command, testCases)
}

start()
