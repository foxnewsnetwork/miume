`import Ember from 'ember'`
`import ApplicationRoute from './application'`

AboutRoute = ApplicationRoute.extend
  model: ->
    @store.find "about"



`export default AboutRoute`
