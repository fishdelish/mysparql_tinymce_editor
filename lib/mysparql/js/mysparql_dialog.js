EditorDialog = function() {
  this.url = "/mysparql/queries"
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
  ed.execCommand('mceInsertContent', false, '<div data-mysparql-uri="' + data.uri + '" />', {skip_undo : 1});
  tinyMCEPopup.close()
};

//Dialog setup
dialog = new EditorDialog();
dialog.preInit();

//Event handler registration
$("form#mysparql").submit(function(event) {
  return dialog.submit($(this))
});
