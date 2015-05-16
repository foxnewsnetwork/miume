`import Ember from 'ember'`
`import DS from 'ember-data'`

About = DS.Model.extend
  intro: DS.attr "string"
  icon: DS.attr "string"
  pic: DS.attr "string"
  headline: DS.attr "string"
  details: DS.attr "string"
  happenedAt: DS.attr "date"
  createdAt: DS.attr "date"

`export default About`