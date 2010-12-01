EditorDialog = function() {
  this.url = mysparql_path + "queries";
}

EditorDialog.prototype.preInit = function() {
  tinyMCEPopup.requireLangPack();
}

EditorDialog.prototype.submit = function(event) {
  $.ajax({type : "POST", data : event.serialize(), dataType : "json", success : this.submit_callback, url : this.url});
  return false;
};

EditorDialog.prototype.submit_callback = function(data) {
  var ed = tinyMCEPopup.editor
  var formatter = $('input:radio[name=data_formatter]:checked').val()
  ed.execCommand('mceInsertContent', false, '<a data-formatter="' + formatter + '" class="mysparql" href="'+data.mysparql_id+'">MySparql Query</a>', {skip_undo : 1});
  tinyMCEPopup.close()
};

//Dialog setup
dialog = new EditorDialog();
dialog.preInit();

//Event handler registration
$("form#mysparql").submit(function(event) {
  alert("hello");
  return dialog.submit($(this))
});

$("#preview_button").click(function() {
  mcTabs.displayTab('preview_tab', 'preview_panel');  
  var data = $(document.forms[0]).serialize();
  var url = mysparql_path + "preview"
  $.ajax({type: "POST", data: data, dataType: "json", url: url, success: function(data) {
    $("#preview_results").html(create_table(data));
  }});
  return false; 
});
