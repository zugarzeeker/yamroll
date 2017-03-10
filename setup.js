#!/usr/bin/env node

const fs = require('fs')
const cp = require('child_process')
const path = require('path')

const removeQuote = (s) => (
  s.replace(/'$/, '')
  .replace(/^'/, '')
  .replace(/^"/, '')
  .replace(/"$/, '')
)

const getTestCases = () => {
  const files = fs.readdirSync('.')
  return files.filter(file => file.includes('.in')).map(name => name.replace('.in', ''))
}

const setupEnvironment = () => {
  const _argv = process.argv
  var command, testCases
  if (_argv[2] === '-r') {
    command = removeQuote(_argv[3])
  }

  if (_argv[4] === '-t') {
    testCases = [removeQuote(_argv[5])]
  }

  if (!testCases) {
    testCases = getTestCases()
  }

  process.env.testCases = JSON.stringify(testCases)
  process.env.command = command
}

const testingCommand = `${require.resolve('.bin/mocha')} ${__dirname}/test.js`
const runTest = () => {
  try {
    cp.execSync(testingCommand, { stdio: 'inherit' })
  } catch (e) {
    process.exit(1)
  }
}

setupEnvironment()
runTest()
