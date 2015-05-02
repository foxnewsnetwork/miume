`import Ember from 'ember'`

every = (time, cb) -> window.setInterval cb, time

IframeBlockComponent = Ember.Component.extend
  tagName: 'iframe'
  classNames: ['iframe-block']
  attributeBindings: [
    'horizontalscrolling',
    'verticalscrolling',
    'frameborder',
    'scrolling',
    'title',
    'src',
    'seamless',
    'width'
  ]
  width: '100%'
  horizontalscrolling: 'no'
  verticalscrolling: 'no'
  scrolling: 'no'
  frameborder: 0
  seamless: 'seamless'
  src: 'disqus.html'
  didInsertElement: ->
    @heightWatchInterval = every 1000, =>
      @$().css "height", @getContentBodyHeight()
  willDestroyElement: ->
    window.clearInterval @heightWatchInterval

  getContentBodyHeight: ->
    obj = @$()[0]
    obj.contentWindow.document.body.scrollHeight

`export default IframeBlockComponent`
