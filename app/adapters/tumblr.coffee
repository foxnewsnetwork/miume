`import Ember from 'ember'`
`import DS from 'ember-data'`

get = Ember.get

lll = (x) ->
  console.log x
  x

TumblrAdapter = DS.RESTAdapter.extend
  host: 'http://api.tumblr.com'
  namespace: 'v2/blog/blogsqlapi.tumblr.com'
  defaultSerializer: '-tumblr'
  apiKey: "wIP0ELJ0hXhmi11b1cgrY5t5z4JxFa8qSZzWNobtwgv98Q150X"

  ajaxOptions: ->
    hash = @_super arguments...
    hash.crossDomain = true
    hash.dataType = "jsonp"
    hash
    
  buildURL: ->
    uri = @urlPrefix()
    [uri, "posts"].join('/')

  find: (store, type, id, snapshot) ->
    data = @buildUrlOptions
      typeKey: type.typeKey
      id: id
      snapshot: snapshot
    uri = @buildURL()
    @ajax uri, 'GET', data: data

  findAll: (store, type, sinceToken) ->
    data = @buildUrlOptions
      typeKey: type.typeKey
      sinceToken: sinceToken
    uri = @buildURL()
    @ajax uri, 'GET', data: data

  findQuery: (store, type, query) ->
    data = @buildUrlOptions
      typeKey: type.typeKey
      hash: query
    uri = @buildURL()
    @ajax uri, 'GET', data: data

  buildUrlOptions: ({typeKey, id, snapshot, sinceToken, hash}) ->
    hash ?= {}
    hash.api_key = get(@, 'apiKey')
    hash.filter = 'text'
    hash.tag = typeKey
    hash.id = id if Ember.isPresent id
    hash.since = sinceToken if Ember.isPresent sinceToken
    hash

`export default TumblrAdapter`
