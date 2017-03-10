#!/usr/bin/env node

const fs = require('fs')
const cp = require('child_process')

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


const runTest = () => {
  try {
    cp.execSync('mocha test.js', { stdio: 'inherit' })
  } catch (e) {
    process.exit(1)
  }
}

setupEnvironment()
runTest()
