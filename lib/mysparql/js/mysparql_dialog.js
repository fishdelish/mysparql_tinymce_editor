EditorDialog = function() {
  this.url = mysparql_path + "queries";
}

EditorDialog.prototype.preInit = function() {
  tinyMCEPopup.requireLangPack();
  var ed = tinyMCEPopup.editor;
  var node = ed.selection.getNode();
  if (/mysparql/.test(ed.dom.getAttrib(node, 'class'))) {
    var query_id = ed.dom.getAttrib(node, 'href');
    var url = mysparql_path + "queries/" + query_id + "/data"
    this.url = mysparql_path + "queries/" + query_id;
    $(document.forms[0]).append($("<input type='hidden' name='_method' value='put' />"))
    $.get(url, function(data) {
      var f = document.forms[0];
      f['query[query]'].value = data['query']['query']
      f['query[source]'].value = data['query']['source']
      f['query[xslt_path]'].value = data['query']['xslt_path']
      f['query[xslt_sheet]'].value = data['query']['xslt_sheet']
      $(f['data_formatter']).val([ed.dom.getAttrib(node, 'data-formatter')])
    }, "json");
  }
  var f = document.forms[0];
  $(f['data_formatter']).change(function() {
    if ($("input:radio[name=data_formatter]:checked").val() == "xslt") {
      $("#xslt-input").show();
    } else {
      $("#xslt-input").hide();
    }
  });
  $(f['data_formatter']).change()
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

EditorDialog.prototype.toggle_xslt_box = function() {
  if ($(document.forms[0]['data_formatter']).val() == "xslt") {
    $("#xslt-input").show()    
  } else {
    $("#xslt-input").hide()
  }
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
  var url = mysparql_path + "queries/preview"
  var formatter = get_formatter($("input[name=data_formatter]:checked").val());
  $.ajax({type: "POST", data: data, dataType: formatter.dataType, url: url, success: function(data) {
    if (data.parameters) {
      var form = create_parameter_form("preview", data);
      $("#preview_results").html(form);
      $("#param-preview input[type=submit]").click(function() {
        var success_func = function(data) {
          var box = $("#param-preview .results");
          box.html("<div/>")
          formatter.func($("#param-preview .results div"), "preview", data)
        };
        var error_func = function() {
          $("#param-preview .results div").html("<span style='color:red;'>Error occured</span>")
        }
        $("#param-preview .results").html("Loading...")
        var preview_data = $(form).serialize();
        preview_data += "&" + $(document.forms[0]).serialize();
        $.ajax({type : "POST", data : preview_data, dataType : "json", success : success_func, url : url, error: error_func});
        return false;
      });
    } else {
      $("#preview_results").html($("<div/>"))
      formatter.func($("#preview_results div"), "preview", data)
    };
  }});
  return false; 
});
