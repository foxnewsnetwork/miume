`import Ember from 'ember'`

IndexRoute = Ember.Route.extend
  renderTemplate: ->
    @_super arguments...
    @render "shared/nothing",
      outlet: "top-nav"

  
`export default IndexRoute`
