describe 'Editor Plugin'
  before_each
    tinymce = {PluginManager : {}, plugins : {MySparqlPlugin : {}}}
    tinymce.stub('create')
    tinymce.PluginManager.stub("requireLangPack")
    tinymce.PluginManager.stub("add")
  end
 
  describe 'plugin creation'
    it 'should create a TinyMCE plugin'
      tinymce.should_receive("create").with_args('tinymce.plugins.MySparqlPlugin', an_instance_of(MySparqlSetup));
      subject = new MySparqlPlugin(tinymce);
    end
    
    it 'should load the language pack'
      tinymce.PluginManager.should_receive("requireLangPack").with_args("mysparql")
      subject = new MySparqlPlugin(tinymce);
    end
 
    it 'should register the plugin'
      tinymce.PluginManager.should_receive("add").with_args("mysparql", tinymce.plugins.MySparqlPlugin)
      subject = new MySparqlPlugin(tinymce);
    end
  end

  describe 'plugin setup'
    before_each
      subject = new MySparqlSetup();
    end

    describe 'initialization'
      before_each
        editor = {}
        editor.stub("addCommand")
        editor.stub("addButton")
        url = "http://test.host/"
        button_options = { title : 'mysparql.desc', cmd : 'mceMysparql', image : url + "/img/mysparql.gif" }
      end

      it 'should add a command to the editor' 
        editor.should_receive("addCommand").with_args('mceMysparql', MySparqlSetup.prototype.addCommand)
        subject.init(editor, url);
      end

      it 'should add a button to the editor'
        editor.should_receive("addButton").with_args("mysparql", button_options)
        subject.init(editor, url);
      end
    end
  end
end
