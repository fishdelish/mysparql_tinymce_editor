MySparqlSetup = function() {
  
};

MySparqlSetup.prototype.init = function(editor, url) {
  editor.addCommand('mceMysparql', this.addCommand);
  editor.addButton('mysparql', {title : 'mysparql.desc', cmd : 'mceMysparql', image : url + '/img/mysparql.gif'});
};

MySparqlSetup.prototype.addCommand = function() {

};

MySparqlPlugin = function(tinymce) {
  tinymce.PluginManager.requireLangPack("mysparql");
  tinymce.create('tinymce.plugins.MySparqlPlugin', new MySparqlSetup());
  tinymce.PluginManager.add('mysparql', tinymce.plugins.MySparqlPlugin);
}

//Initialize the plugin
new MySparqlPlugin(tinymce);
