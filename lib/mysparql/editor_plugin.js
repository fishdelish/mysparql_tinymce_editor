MySparqlSetup = function() {
  
};

MySparqlSetup.prototype.getSetupObject = function() {
  return {init: this.init, createControl: this.createControl, getInfo: this.getInfo}
}

MySparqlSetup.prototype.init = function(editor, url) {
  this.editor = editor
  this.url = url
  editor.addCommand('mceMysparql', function() {
    editor.windowManager.open( {file: url+"/dialog.htm", width:200, height:200, inline:1}, {plugin_url: url});
    },
    {plugin_url: url});
  editor.addButton('mysparql', {title : 'MySparql Query Editor', cmd : 'mceMysparql', image : url + '/img/mysparql.gif'});
};

MySparqlSetup.prototype.createControl = function(n, cm) {
  return null;
}

MySparqlSetup.prototype.getInfo = function() {
  return {author : 'Hedtek Ltd.', longname : 'TinyMCE MySparql Editor Plugin', authorurl : 'http://hedtek.com', version : '0.1', infourl : 'http://nymph.cs.man.ac.uk/projects/mysparql-tinymce'}
}

MySparqlPlugin = function(tinymce) {
  this.setup = new MySparqlSetup();
  tinymce.PluginManager.requireLangPack("mysparql");
  tinymce.create('tinymce.plugins.MysparqlPlugin', this.setup.getSetupObject());
  tinymce.PluginManager.add('mysparql', tinymce.plugins.MysparqlPlugin);
}

//Initialize the plugin
mysparql_plugin = new MySparqlPlugin(tinymce);
