`import Ember from 'ember'`
`import FunEx from '../utils/fun-ex'`

ScrollSpyComponent = Ember.Component.extend
  classNames: ["scroll-spy"]
  classNameBindings: ["pastCutoff:after-cutoff:before-cutoff"]
  scrollParent: 'body'
  overlap: 0
  pastCutoff: false

  sp$: FunEx.computed "scrollParent", ->
    $ @get 'scrollParent'

  didInsertElement: ->
    @decideRazorsEdge()
    check = _.bind(@decideRazorsEdge, @)
    slowly = _.throttle check, 50
    @get("sp$").on "scroll", slowly

  willDestroyElement: ->
    @get("sp$").off "scroll" if @get("sp$.off")?

  scrollY: ->
    @get("sp$").scrollTop()

  cutoff: ->
    Ember.get( @$().position(), "top") - @get("overlap")

  decideRazorsEdge: ->
    if @scrollY() >= @cutoff()
      @set("pastCutoff", true)
    # else
    #   @set("pastCutoff", false)




`export default ScrollSpyComponent`
