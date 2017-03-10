#!/usr/bin/env node

const fs = require('fs')
const cp = require('child_process')
const assert = require('power-assert')

const solve = (command, input) => new Promise((resolve) => {
  const child = cp.exec(command)
  child.stdin.write(input)
  child.stdout.on('data', (output) => {
    child.on('close', () => {
      resolve(output)
    })
  })
  child.stdin.end()
})

const test = (command, testCases) => {
  describe(command, () => {
    testCases.map((testCase) => {
      const input = fs.readFileSync(`${testCase}.in`, 'utf8')
      const expectedOutput = fs.readFileSync(`${testCase}.out`, 'utf8')
      it(`should solve [${testCase}] correctly`, () => (
        solve(command, input).then((actualOutput) => {
          assert.equal(actualOutput, expectedOutput)
        })
      ))
    })
  })
}

const start = () => {
  const command = process.env.command
  const testCases = JSON.parse(process.env.testCases)
  test(command, testCases)
}

start()
