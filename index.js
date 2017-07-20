'use strict'


/**
 * Dependencies
 */

const Alexa = require('alexa-app')
const Router = require('alexa-app-router')
const express = require('express')
const axios = require('axios')


/**
 * Setup
 */

const PROD = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 8080
const alexaApp = new Alexa.app('urban-dictionary')
const app = express()

alexaApp.express({
  expressApp: app,
  checkCert: PROD ? true : false,
  debug: !PROD ? true : false
})

if (!PROD) {
  module.change_code = 1
  app.set('view engine', 'ejs')
}

const api = axios.create({
  baseURL: 'http://api.urbandictionary.com/v0/'
})

const config = {
  defaultRoute: '/',
  launch: launchHandler
}


/**
 * Intents
 */

const intents = {
  RandomWordIntent: {
    utterances: ['random {word|definition}']
  }
}


/**
 * Routes
 */

const routes = {
  '/': {
    RandomWordIntent: randomWordHandler
  }
}

Router.addRouter(alexaApp, config, intents, routes)


/**
 * Handler Functions
 */

function launchHandler(req, res) {
  res.say(`
    Welcome to Urban Dictionary.
    You can ask me to:
      - Get the word of the day <break time='0.5s'/>
      - Get a random word <break time='0.5s'/>
      - Search for a word <break time='0.5s'/>
  `)
}

async function randomWordHandler(req, res) {
  const { data } = await api.get('random')
  const { word, definition } = data.list[0]
  return res.say(`
    The word is ${word}. <break time='0.5s'/>
    The definition is ${definition}.
  `)
}


/**
 * Start!
 */

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
