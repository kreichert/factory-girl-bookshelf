  var factory = require('factory-girl'),
    Adapter = factory.Adapter;

var BookshelfAdapter = function() {};
BookshelfAdapter.prototype = new Adapter();

BookshelfAdapter.prototype.build = function(Model, props) {
  return new Model(props);
};
BookshelfAdapter.prototype.get = function(doc, attr, Model) {
  return doc.get(attr);
};
BookshelfAdapter.prototype.set = function(props, doc, Model) {
  return doc.set(props);
};
BookshelfAdapter.prototype.save = function(doc, Model, cb) {
  var that = this;
  doc.save().then(function(model){
    for(var x =0;x< that.interceptors['save'].length; x++){
      that.interceptors['save'][x].call(that,model)
    }
    cb(null,model)
  }).catch(function(err){cb(err)});
};
BookshelfAdapter.prototype.destroy = function(doc, Model, cb) {
  if (!doc.id) return process.nextTick(cb);
  var that = this;
  doc.destroy().then(function(model){
    for(var x =0;x< that.interceptors['destroy'].length; x++){
      that.interceptors['destroy'][x].call(that,model)
    }
    cb(null,model)
  }).catch(function(err){cb(err)});
};
BookshelfAdapter.prototype.addInterceptor = function(type,callback){
  this.interceptors[type].push(callback);
};
BookshelfAdapter.prototype.clearInterceptors = function(type){
  this.interceptors[type] = [];
};
var adapter = new BookshelfAdapter();
adapter.interceptors = {
  save: [],
  destroy: []
};
module.exports = function(models) {
  if (models) {
    for (var i = 0; i < models.length; i++) {
      factory.setAdapter(adapter, models[i]);
    }
  }
  else {
    factory.setAdapter(adapter);
  }
  return adapter;
};

module.exports.BookshelfAdapter = BookshelfAdapter;
