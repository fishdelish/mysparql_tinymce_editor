EditorDialog = function() {
  this.url = mysparql_path + "queries";
}

var set_options = function(options) {
  $("#google-opts input").each(function(index, ele) {
    $(ele).val(options[$(ele).attr("name")])
  });
}

EditorDialog.prototype.preInit = function() {
  tinyMCEPopup.requireLangPack();
  var ed = tinyMCEPopup.editor;
  var node = ed.selection.getNode().parentNode;
  if (/mysparql/.test(ed.dom.getAttrib(node, 'class'))) {
    var query_id = ed.dom.getAttrib(node, 'data-mysparql-id');
    var url = mysparql_path + "queries/" + query_id + "/data?ignore_parameters"
    this.url = mysparql_path + "queries/" + query_id;
    $(document.forms[0]).append($("<input type='hidden' name='_method' value='put' />"))
    $.get(url, function(data) {
      var f = document.forms[0];
      f['query[query]'].value = data['query']['query']
      f['query[source]'].value = data['query']['source']
      f['query[xslt_path]'].value = data['query']['xslt_path']
      f['query[xslt_sheet]'].value = data['query']['xslt_sheet']
      f['query[xslt_type]'].value = data['query']['xslt_type']
      $(f['data_formatter']).val([ed.dom.getAttrib(node, 'data-formatter')])
      $(f['data_formatter']).change();
      $(f['google-viz']).val([ed.dom.getAttrib(node, 'data-google-viz')])
      $(f['tutorial_mode']).attr("checked", ed.dom.getAttrib(node, 'data-tutorial') == "true")
      set_options($.parseJSON(ed.dom.getAttrib(node, 'data-google-opts')));
    }, "json");
  }
  var f = document.forms[0];
  $(f['data_formatter']).change(function() {
    var formatter = $("input:radio[name=data_formatter]:checked").val()
    if (formatter == "xslt") {
      $("#xslt-input").show();
      $("#google-viz").hide();
    } else if (formatter == "google") {
      setup_google_form();
      $("#xslt-input").hide();
      $("#google-viz").show();
    } else {
      $("#xslt-input").hide();
      $("#google-viz").hide();
    }
  });
  $(f['data_formatter']).change()
}

EditorDialog.prototype.submit = function(event) {
  $.ajax({type : "POST", data : event.serialize(), dataType : "json", success : this.submit_callback, error : this.handle_errors, url : this.url});
  return false;
};

EditorDialog.prototype.handle_errors = function(request, status, error) {
  var data = $.parseJSON(request.responseText);
  var error_block = $(".errors")
  error_block.text("Errors:")
  $.each(data.error, function(index, item) {
    error_block.append($("<br/>"))
    var span = $("<span/>")
    span.text(item)
    error_block.append(span)
  });
}

var build_html_link = function(mysparql_id, formatter, xslt_type, parameterised, tutorial, viz, viz_opts) {
  var mysparql_string = '<div class="mysparql" data-formatter="' + formatter + '" data-mysparql-id="' + mysparql_id + '" data-google-viz="' + viz + "' " 
  mysparql_string += 'data-google-opts="' + viz_opts + '" data-xslt-type="' + xslt_type + '" data-parameterised="' + parameterised + '" data-tutorial="' + tutorial + '">'
  mysparql_string += '<a href="' + mysparql_path + 'queries/' + mysparql_id + '">MySparql Query - ' + formatter + '</a></div>'
  return mysparql_string;
};

var update_html_link = function(node, link, mysparql_id, formatter, xslt_type, parameterised, tutorial, viz, viz_opts) {
  var ed = tinyMCEPopup.editor
  ed.dom.setAttrib(node, 'data-mysparql-id', mysparql_id)
  ed.dom.setAttrib(node, 'data-formatter', formatter)
  ed.dom.setAttrib(node, 'data-xslt-type', xslt_type)
  ed.dom.setAttrib(node, 'data-parameterised', parameterised)
  ed.dom.setAttrib(node, 'data-tutorial', tutorial)
  ed.dom.setAttrib(node, 'data-google-viz', viz)
  ed.dom.setAttrib(node, 'data-google-opts', viz_opts)
  ed.dom.setAttrib(link, 'href', mysparql_path + 'queries/' + mysparql_id);
  link.textContent = "MySparql Query - " + formatter;
};

var create_option_string = function() {
  var options = {}
  $("#google-opts input").each(function(index, ele) {
    ele = $(ele)
    if (ele.attr("data-type") == "number") {
      options[$(ele).attr("name")] = parseFloat($(ele).val())
    } else {
      options[$(ele).attr("name")] = $(ele).val()
    }
  });
  return $.toJSON(options)
}

EditorDialog.prototype.submit_callback = function(data) {
  var ed = tinyMCEPopup.editor
  var f = document.forms[0]
  var formatter = $('input:radio[name=data_formatter]:checked').val()
  if (formatter == undefined) {
    formatter = "table"
  }
  var xslt_type = $('select#xslt_type option:selected').val()
  var viz = $('select#google_viz option:selected').val()
  var viz_opts = create_option_string();
  var tutorial = ($('input[name=tutorial_mode]:checked').val() != undefined);
  var parameterised = (/=[0-9a-zA-Z_]+=/.test(f['query[query]'].value))
  var link = ed.selection.getNode();
  var node = link.parentNode;
  if (/mysparql/.test(ed.dom.getAttrib(node, 'class'))) {
    update_html_link(node, link, data.mysparql_id, formatter, xslt_type, parameterised, tutorial, viz, viz_opts);
  } else {
    ed.execCommand('mceInsertContent', false, build_html_link(data.mysparql_id, formatter, xslt_type, parameterised, tutorial, viz, viz_opts), {skip_undo:1});
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

var setup_google_form = function() {
  var f = document.forms[0];
  f['query[xslt_path]'].value = "http://data-gov.tw.rpi.edu/ws/sparqlxml2googlejson.xsl"
  f['query[xslt_sheet]'].value = ""
  f['query[xslt_type]'].value = "json"
}
