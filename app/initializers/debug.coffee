`import Ember from 'ember'`
# Takes two parameters: container and app
initialize = ->
  Ember.l = (x) ->
    console.log x
    x

DebugInitializer =
  name: 'debug'
  initialize: initialize

`export {initialize}`
`export default DebugInitializer`
