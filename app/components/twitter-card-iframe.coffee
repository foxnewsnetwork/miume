`import Ember from 'ember'`

TwitterCardIframeComponent = Ember.Component.extend
  tagName: 'iframe'
  classNames: ['twitter-card-iframe']
  attributeBindings: [
    'horizontalscrolling',
    'verticalscrolling',
    'frameborder',
    'scrolling',
    'title',
    'src',
    'seamless',
    'width',
    'height'
  ]
  width: '100%'
  horizontalscrolling: 'no'
  verticalscrolling: 'no'
  scrolling: 'no'
  frameborder: 0
  seamless: 'seamless'
  src: 'twitter.html'
  didInsertElement: ->
    @scrollInterval = window.setInterval @ensureCorrectScrollPosition.bind(@), 1000
    
  willDestroyElement: ->
    window.clearInterval @scrollInterval if Ember.isPresent @scrollInterval

  ensureCorrectScrollPosition: ->
    return if @nthTopOffset() is "twitter not ready"
    @set 'height', @actualHeight()
    @scrollIframeTo @nthTopOffset()  

  scrollIframeTo: (offset) ->
    try
      obj = @$()[0]
      obj.contentWindow.scrollTo 0, offset
    catch error
      console.log "unable to scroll to #{offset}"

  actualHeight: ->
    return 330 if @nthHeight() is 'twitter not ready'
    return 330 if @nthHeight() > 330
    @nthHeight()
  nthHeight: ->
    try
      obj = @$()[0]
      timeline = $(obj.contentWindow.document.body).find("iframe.twitter-timeline")[0]
      tweet = $(timeline.contentWindow.document.body).find("li.h-entry.tweet")[@get 'n']
      $(tweet).height()
    catch error
      "twitter not ready"
  nthTopOffset: ->
    try
      obj = @$()[0]
      timeline = $(obj.contentWindow.document.body).find("iframe.twitter-timeline")[0]
      tweet = $(timeline.contentWindow.document.body).find("li.h-entry.tweet")[@get 'n']
      tweet.offsetTop
    catch error
      "twitter not ready"

`export default TwitterCardIframeComponent`
