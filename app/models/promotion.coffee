`import DS from 'ember-data'`

Promotion = DS.Model.extend
  title: DS.attr "string"
  message: DS.attr "string"
  createdAt: DS.attr "date"
  tags: DS.attr()
  

`export default Promotion`
