EditorDialog = function() {
  this.url = "/mysparql/queries"
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
}
//Dialog setup
dialog = new EditorDialog();
$("form#mysparql").submit(function(event) {
  return dialog.submit($(this))
});
dialog.grabTinyMCEData();
