<?php
/*
Plugin Name: MySparql Editor
Description: Allows the creation and editing of MySparql queries in wordpress
Version: 0.1
Author: David Workman
*/

class FD_MySparql_Editor {
   function FD_MySparql_Editor(){
    if(is_admin()){
        if ( current_user_can('edit_posts') && current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')
        {
           add_filter('tiny_mce_version', array(&$this, 'tiny_mce_version') );
           add_filter("mce_external_plugins", array(&$this, "mce_external_plugins"));
           add_filter('mce_buttons_2', array(&$this, 'mce_buttons'));
           add_filter('tiny_mce_before_init', array(&$this, 'mce_options'));
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
   function mce_options($init) {
     // Command separated string of extended elements
     $ext = 'div[class|data-formatter|data-mysparql-id|data-xslt-type|class|data-parameterised|data-tutorial|data-google-viz|data-google-opts]';

     // Add to extended_valid_elements if it alreay exists
     if ( isset( $init['extended_valid_elements'] ) ) {
       $init['extended_valid_elements'] .= ',' . $ext;
     } else {
       $init['extended_valid_elements'] = $ext;
     }

     // Super important: return $init!
     return $init;
   }
}
 
add_action('init', 'FD_MySparql_Editor');
function FD_MySparql_Editor(){
   global $FD_MySparql_Editor;
   $FD_MySparql_Editor = new FD_MySparql_Editor();
}

?>
