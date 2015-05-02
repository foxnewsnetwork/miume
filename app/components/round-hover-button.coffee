`import Ember from 'ember'`

colors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange"
]

count = 0

RoundHoverButtonComponent = Ember.Component.extend
  tagName: "button"
  classNames: [
    'round-hover-button',
    'btn-floating',
    'btn-large',
    'waves-effect',
    'waves-light'
  ]
  classNameBindings: ["color"]

  faicon: Ember.computed "i", ->
    "fa fa-#{@get 'i'}"
  color: Ember.computed "personalNumber", ->
    k = @get "personalNumber"
    k ?= 0
    n = k % colors.length
    colors[n]
    
  didInsertElement: ->
    @set "personalNumber", count
    count += 1

  willDestroyElement: ->
    count -= 1

`export default RoundHoverButtonComponent`
