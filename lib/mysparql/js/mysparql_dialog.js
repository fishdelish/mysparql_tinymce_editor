EditorDialog = function() {
  this.url = mysparql_path + "queries";
}

EditorDialog.prototype.preInit = function() {
  tinyMCEPopup.requireLangPack();
  var ed = tinyMCEPopup.editor;
  var node = ed.selection.getNode();
  if (/mysparql/.test(ed.dom.getAttrib(node, 'class'))) {
    var query_id = ed.dom.getAttrib(node, 'href');
    var url = mysparql_path + "queries/" + query_id + "?tutorial"
    $.get(url, function(data) {
      var f = document.forms[0];
      f['sparql-query'].value = data['query']['query']
      f['data-source'].value = data['query']['source']
      $(f['data_formatter']).val([ed.dom.getAttrib(node, 'data-formatter')])
    }, "json");
  }
}

EditorDialog.prototype.submit = function(event) {
  $.ajax({type : "POST", data : event.serialize(), dataType : "json", success : this.submit_callback, url : this.url});
  return false;
};

EditorDialog.prototype.submit_callback = function(data) {
  var ed = tinyMCEPopup.editor
  var formatter = $('input:radio[name=data_formatter]:checked').val()
  var node = ed.selection.getNode();
  if (/mysparql/.test(ed.dom.getAttrib(node, 'class'))) {
    node.href = data.mysparql_id;
    ed.dom.setAttrib(node, 'data-formatter', formatter);
  } else {
    ed.execCommand('mceInsertContent', false, '<a data-formatter="' + formatter + '" class="mysparql" href="'+data.mysparql_id+'">MySparql Query</a>', {skip_undo : 1});
  }
  tinyMCEPopup.close()
};

//Dialog setup
dialog = new EditorDialog();
dialog.preInit();

//Event handler registration
$("form#mysparql").submit(function(event) {
  return dialog.submit($(this))
});

$("#preview_button").click(function() {
  mcTabs.displayTab('preview_tab', 'preview_panel');  
  var data = $(document.forms[0]).serialize();
  var url = mysparql_path + "preview"
  $.ajax({type: "POST", data: data, dataType: "json", url: url, success: function(data) {
    if (data.parameters) {
      var form = create_parameter_form("preview", data);
      $("#preview_results").html(form);
      $("#param-preview input[type=submit]").click(function() {
        var success_func = function(data) {
          var box = $("#param-preview .results");
          box.html("<div/>")
          $("#param-preview .results div").html(create_table(data));
        };
        var error_func = function() {
          $("#param-preview .results div").html("<span style='color:red;'>Error occured</span>")
        }
        $("#param-preview .results").html("Loading...")
        var preview_data = $(form).serialize();
        preview_data += "&" + $(document.forms[0]).serialize();
        $.ajax({type : "POST", data : preview_data, dataType : "json", success : success_func, url : url, error: error_func});
        alert(preview_data);
        return false;
      });
    } else {
      $("#preview_results").html(create_table(data));
    };
  }});
  return false; 
});
