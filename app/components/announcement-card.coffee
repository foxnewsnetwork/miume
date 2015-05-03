`import Ember from 'ember'`
count = 0

AnnouncementCardComponent = Ember.Component.extend
  classNames: ['announcement-card', 'card', 'medium']
  isFullTweet: false
  didInsertElement: ->
    @set "personalNumber", count
    count += 1

  willDestroyElement: ->
    count -= 1

  actions:
    toggleTweet: ->
      @toggleProperty "isFullTweet"

`export default AnnouncementCardComponent`
