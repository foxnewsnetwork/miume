`import Ember from 'ember'`

ClassNames = ["index", "about", "works", "contact"]
ApplicationController = Ember.Controller.extend
  hideAbsNav: ->
    $("#top-nav-absolute").addClass("invisible")
  hideFixNav: ->
    $("#top-nav-fixed").removeClass().addClass("invisible")
  showFixNav: (className) ->
    $("#top-nav-fixed").removeClass().addClass className
  showAbsNav: ->
    $("#top-nav-absolute").removeClass("invisible")
  actions:
    loadIndex: ->
      @transitionToRoute "index"
      @hideFixNav()
      @showAbsNav()
    loadAbout: ->
      @transitionToRoute "about"
      @hideAbsNav()
      @showFixNav "about"
    loadWorks: ->
      @transitionToRoute "works"
      @hideAbsNav()
      @showFixNav "works"
    loadContact: ->
      @transitionToRoute "contact"
      @hideAbsNav()
      @showFixNav "contact"

`export default ApplicationController`
