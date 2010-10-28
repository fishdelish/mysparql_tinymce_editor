EditorDialog = function() {
  this.url = "/mysparql/queries"
}

EditorDialog.prototype.preInit = function() {
  this.tinyMCEPopup.requireLangPack();
}

EditorDialog.prototype.submit = function(event) {
  $.ajax({type : "POST", data : event.serialize(), dataType : "json", success : this.submit_callback, url : this.url});
  return false;
};

EditorDialog.prototype.submit_callback = function(data) {
  this.tinyMCEPopup.close()
};

EditorDialog.prototype.grabTinyMCEData = function() {
  this.tinyMCEPopup = tinyMCEPopup;
  this.tinyMCEEditor = tinyMCEPopup.editor;
  
}


//Dialog setup
dialog = new EditorDialog();
dialog.grabTinyMCEData();
dialog.preInit();

//Event handler registration
$("form#mysparql").submit(function(event) {
  return dialog.submit($(this))
});
