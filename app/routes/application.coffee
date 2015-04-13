`import Ember from 'ember'`

ApplicationRoute = Ember.Route.extend
  renderTemplate: ->
    @_super arguments...
    @render "shared/navigation",
      outlet: "top-nav"
      into: "application"

      

`export default ApplicationRoute`
