`import Ember from 'ember'`
`import config from './config/environment'`

Router = Ember.Router.extend
  location: config.locationType

Router.map ->
  @route "about"
  @resource "works", path: "/works", ->
    @resource "work", path: "/work/:workId", ->

  @route "contact" 

  @route "pictures"

  @route "videos"

  @route "dances"

`export default Router`
