(function() {
  tinymce.PluginManager.requireLangPack('mysparql');
  
  tinymce.create('tinymce.plugins.MySparqlPlugin', {
    init : function(ed, url) {
      ed.addCommand('mceMysparql', function() {
        ed.windowManager.open(
          {
            file : url + '/dialog.htm',
            width : 400,
            height : 400,
            inline : 1
          }, 
          {
            plugin_url : url,
          });
      });
      ed.addButton('mysparql', {
          title : 'mysparql.desc',
          cmd : 'mceMysparql',
          image : url + "/img/mysparql.git"
      });
      
      }
    },

    createControl : function(n, cm) {
      return null;
    },

    getInfo : function() {
      return {
        longname : "MySparql plugin",
        author : "David Workman",
        authorurl : "http://www.hedtek.com",
        infourl : "http://nymph.cs.man.ac.uk/projects/mysparql-tinymce",
        version : "0.1" 
      };
    }
  });
  tinymce.PluginManager.add('mysparql', tinymce.plugins.MySparqlPlugin);
})();
