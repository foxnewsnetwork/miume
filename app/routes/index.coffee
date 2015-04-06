`import Ember from 'ember'`

IndexRoute = Ember.Route.extend
  afterModel: ->
    $('#top-nav-fixed').addClass "index"

  actions:
    willTransition: ->
      $('#top-nav-fixed').removeClass "index"

`export default IndexRoute`
