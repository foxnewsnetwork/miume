`import Ember from 'ember'`
`import DS from 'ember-data'`

map = Ember.EnumerableUtils.map
lll = (x) ->
  console.log x
  x

getMeta = ({meta, total_posts}) ->
  meta.totalPosts = total_posts
  meta

getContent = ({response: {posts: [post, ...]}}) ->
  parsePost post

getContents = ({response: {posts}}) ->
  map posts, parsePost

camelizeKeys = (hash) ->
  for key, value of hash
    camelKey = Ember.String.camelize key
    if key isnt camelKey
      hash[camelKey] = value
      delete hash[key]
  hash

cleanString = (string) ->
  string
  .replace /“/gi, '"'
  .replace /”/gi, '"'

parsePost = ({id, date, tags, title, body}) ->
  hash = camelizeKeys JSON.parse cleanString body
  hash.id = id
  hash.createdAt = date
  hash.tags = tags
  hash.title = title
  hash

TumblrSerializer = DS.RESTSerializer.extend
  extract: (store, type, payload, id, requestType) ->
    reformedPayload = 
      meta: getMeta payload
    if Ember.isPresent id
      reformedPayload[type.typeKey] = getContent payload
    else
      reformedPayload[Ember.String.pluralize type.typeKey] = getContents payload
    @_super store, type, reformedPayload, id, requestType

`export default TumblrSerializer`
