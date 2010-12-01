EditorDialog = function() {
  this.url = mysparql_url
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
  return dialog.submit($(this))
});
