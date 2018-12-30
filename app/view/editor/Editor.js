Ext.define('OnlineIDE.view.editor.CodeEditor',{
	extend : 'Ext.Component',
	requires : [],
	alias : 'widget.codeEditor',
	config : {
		//all configs are defined at https://github.com/ajaxorg/ace/wiki/Configuring-Ace
		editorConfig : {
			fontSize : '16px',
			theme : 'ace/theme/eclipse',
			mode : 'ace/mode/java',
			enableLiveAutocompletion : true,
			readOnly : false
		},
		initialValue : ''
	},
	constructor : function( config )
	{
		var me = this;
		Ext.applyIf( config, me.config );
		Ext.applyIf( config.editorConfig, me.config.editorConfig ); //applyIf is not recursive so call again on editorConfig object
		me.callParent( [config] );
	},
	initComponent : function()
	{
		var me = this;
		me.setHtml( me.generateCodeEditorHtml() );
		me.callParent( arguments );
	},
	afterRender : function()
	{
		var me = this;
		me.callParent(arguments); //do normal post rendering activities
		//configure the editor
		me.configureCodeEditor( me.config );
	},
	configureCodeEditor : function( config )
	{
		var me = this;
		var editor = me.getCodeEditor();
		var editorNode = Ext.getDom( me.getCodeEditorId() ); 
		editor.setOptions( config.editorConfig );
		editor.getSession().setValue( config.initialValue );
	},
	getCodeEditor: function()
	{
		var me = this;
		console.log( me.getCodeEditorId() );
		return ace.edit( me.getCodeEditorId() );
	},
	getCodeEditorId : function()
	{
		var me = this;
		if( Ext.isEmpty(me.editorId) )
			me.editorId = Ext.id().replace('ext', 'code_editor');
		return me.editorId;
	},
	generateCodeEditorHtml : function()
	{
		var me = this;
		var htmlStr = '<div id="{0}" style="margin: 0;position: absolute;top: 0; bottom: 0;left: 0;right: 0;"></div>';
		htmlStr = Ext.String.format( htmlStr, me.getCodeEditorId() );
		return htmlStr;
	}
});