describe 'Editor Dialog'
  before_each
    subject = new EditorDialog();
  end

  describe 'submitting the dialog'
    before_each
      test_query = "SELECT ?p ?o ?s WHERE { ?p ?s ?o }"
      mysparql_url = "/mysparql/queries"
      ajax_args = {
        type : "POST",
        dataType : "json",
        url : mysparql_url,
        success : subject.submit_callback,
        data : "sparql-query=" + test_query
      };
      mock_event = {}
      mock_event.stub("serialize").and_return(ajax_args.data)
    end

    it 'should serialize the event'
      mock_event.should_receive("serialize")
      subject.submit(mock_event)
    end

    it 'should send the query to MySparql'
      $.should_receive("ajax").with_args(ajax_args);
      subject.submit(mock_event);
    end

    it 'should return false to prevent event propagation'
      subject.submit(mock_event).should.be false
    end
  end

  describe "pre-initialization of the dialog"
    before_each
      tinyMCEPopup = {}
      tinyMCEPopup.stub("requireLangPack")
      subject.tinyMCEPopup = tinyMCEPopup
    end

    it "should load the language pack for TinyMCE"
      tinyMCEPopup.should_receive("requireLangPack")
      subject.preInit()
    end
  end

  describe "handling the mysparql response"
    before_each
      tinyMCEPopup = {}
      tinyMCEPopup.stub("close")
      subject.tinyMCEPopup = tinyMCEPopup
      data = {query_url : "http://mysparql.test.host/query/12345"}
    end

    it 'should close the dialog'
      tinyMCEPopup.should_receive("close")
      subject.submit_callback(data)
    end
  end
end
