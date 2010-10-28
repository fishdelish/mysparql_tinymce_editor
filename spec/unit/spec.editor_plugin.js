describe 'Editor Plugin'
  before_each
    tinymce = {PluginManager : {}, plugins : {MysparqlPlugin : {}}}
    tinymce.stub('create')
    tinymce.PluginManager.stub("requireLangPack")
    tinymce.PluginManager.stub("add")
  end
 
  describe 'plugin creation'
    it 'should create a TinyMCE plugin'
      args = {init : new MySparqlSetup().init, createControl : new MySparqlSetup().createControl, getInfo : new MySparqlSetup().getInfo}
      tinymce.should_receive("create").with_args('tinymce.plugins.MysparqlPlugin', args);
      subject = new MySparqlPlugin(tinymce);
    end
    
    it 'should load the language pack'
      tinymce.PluginManager.should_receive("requireLangPack").with_args("mysparql")
      subject = new MySparqlPlugin(tinymce);
    end
 
    it 'should register the plugin'
      tinymce.PluginManager.should_receive("add").with_args("mysparql", tinymce.plugins.MysparqlPlugin)
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

      it 'should store the editor details'
        subject.init(editor, url)
        subject.editor.should.be editor
      end

      it 'should store the url details'
        subject.init(editor, url)
        subject.url.should.be url
      end

      it 'should add a button to the editor'
        editor.should_receive("addButton").with_args("mysparql", button_options)
        subject.init(editor, url);
      end

      describe 'command initialization'
        before_each
          editor.windowManager = {}
          editor.windowManager.stub("open")
          subject.editor = editor
          subject.url = url
        end

        it 'should open a window'
          window_properties = {file : url + '/dialog.htm', width : 100, height : 100, inline : 1}
          plugin_url = {plugin_url : url}
          editor.windowManager.should_receive("open").with_args(window_properties, plugin_url);
          subject.addCommand()
        end
      end
    end
  end

  describe 'control creation'
    it 'should return null'
      subject.createControl().should.be null
    end
  end

  describe 'plugin info'
    it 'should return an author'
      subject.getInfo().author.should.be 'Hedtek Ltd.'
    end

    it 'should return the full plugin name'
      subject.getInfo().longname.should.be 'TinyMCE MySparql Editor Plugin'
    end

    it 'should return the authors website url'
      subject.getInfo().authorurl.should.be 'http://hedtek.com'
    end

    it 'should return a version'
      subject.getInfo().version.should.be '0.1'
    end

    it 'should return a url for more info on the plugin'
      subject.getInfo().infourl.should.be 'http://nymph.cs.man.ac.uk/projects/mysparql-tinymce'
    end
  end
end
