`import Ember from 'ember'`
`import FunEx from '../utils/fun-ex'`

lll = (x) -> 
  console.log x
  x

LazyScrollLoadComponent = Ember.Component.extend
  classNames: ['lazy-scroll-load']
  scrollParent: 'body'
  classNameBindings: ["shouldLoadContent:visible:invisible", "isBefore:before", "isAfter:after"]
  overlap: 200
  sp$: FunEx.computed "scrollParent", ->
    $ @get 'scrollParent'

  didInsertElement: ->
    @decideRenderability()
    check = _.bind(@decideRenderability, @)
    slowly = _.throttle check, 50
    @get("sp$").on "scroll", slowly

  willDestroyElement: ->
    @get("sp$").off "scroll" if @get("sp$.off")?

  topCutoff: ->
    Ember.get( @$().position(), "top") - @get("overlap")

  scrollY: ->
    @get("sp$").scrollTop()

  botCutoff: ->
    @$().innerHeight() + @topCutoff()

  decideRenderability: ->
    if @scrollY() < @topCutoff() 
      @set "isBefore", true
      @set "isAfter", false
    if @botCutoff() < @scrollY()
      @set "isAfter", true
      @set "isBefore", false
    if (@topCutoff() < @scrollY()) and (@scrollY() < @botCutoff())
      @set("shouldLoadContent", true)
      @sendAction "action"
    else
      @set("shouldLoadContent", false)

`export default LazyScrollLoadComponent`
