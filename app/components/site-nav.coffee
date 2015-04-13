`import Ember from 'ember'`

SiteNavComponent = Ember.Component.extend
  classNames: ["z-depth-2"]
  didInsertElement: ->
    @$(".button-collapse").sideNav()

`export default SiteNavComponent`
