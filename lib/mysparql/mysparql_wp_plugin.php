class FD_MySparql_Editor {
   function FD_MySparql_Editor(){
    if(is_admin()){
        if ( current_user_can('edit_posts') && current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')
        {
           add_filter('tiny_mce_version', array(&$this, 'tiny_mce_version') );
           add_filter("mce_external_plugins", array(&$this, "mce_external_plugins"));
           add_filter('mce_buttons_2', array(&$this, 'mce_buttons'));
        }
    }
   }
   function mce_buttons($buttons) {
    array_push($buttons, "separator", "mysparql" );
    return $buttons;
   }
   function mce_external_plugins($plugin_array) {
    $plugin_array['mysparql']  =  plugins_url('/mysparql/editor_plugin.js');
    return $plugin_array;
   }
   function tiny_mce_version($version) {
    return ++$version;
   }
}
 
add_action('init', 'FD_MySparql_Editor');
function FD_MySparql_Editor(){
   global $FD_MySparql_Editor;
   $FD_MySparql_Editor = new FD_MySparql_Editor();
}
