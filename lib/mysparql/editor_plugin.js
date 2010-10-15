MySparqlSetup = function() {
  
};

MySparqlSetup.prototype.init = function(editor, url) {
  this.editor = editor
  this.url = url
  editor.addCommand('mceMysparql', this.addCommand);
  editor.addButton('mysparql', {title : 'mysparql.desc', cmd : 'mceMysparql', image : url + '/img/mysparql.gif'});
};

MySparqlSetup.prototype.addCommand = function() {
  this.editor.windowManager.open( { file: this.url + "/dialog.htm", width: 100, height: 100, inline: 1 }, { plugin_url: this.url } );
};

MySparqlSetup.prototype.createControl = function(n, cm) {
  return null;
}

MySparqlSetup.prototype.getInfo = function() {
  return {author : 'Hedtek Ltd.', longname : 'TinyMCE MySparql Editor Plugin', authorurl : 'http://hedtek.com', version : '0.1', infourl : 'http://nymph.cs.man.ac.uk/projects/mysparql-tinymce'}
}

MySparqlPlugin = function(tinymce) {
  tinymce.PluginManager.requireLangPack("mysparql");
  tinymce.create('tinymce.plugins.MySparqlPlugin', new MySparqlSetup());
  tinymce.PluginManager.add('mysparql', tinymce.plugins.MySparqlPlugin);
}

//Initialize the plugin
new MySparqlPlugin(tinymce);
