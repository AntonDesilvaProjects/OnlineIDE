/*
	EditorTabPanel - this class will act as the container that will host the actual editors.
	For the purpose of this application, we can view this class as the 'Editor' and it will 
	be the interface with which the outside code will interact with the editor
*/
Ext.define('OnlineIDE.view.editor.EditorTabPanel',{
	extend : 'Ext.tab.Panel',
	requires : [
		'OnlineIDE.view.editor.CodeEditor',
		'OnlineIDE.controller.editor.EditorTabPanelViewController'
	],
	alias : 'widget.editorTabPanel',
	controller : 'editorTabPanelViewController',
	initComponent : function()
	{
		this.items = [
		];
		this.callParent( arguments );
	},
	addEditor : function( newEditor, autoFocus )
	{
		var me = this;
		me.add( newEditor );
		if( autoFocus )
			me.setActiveTab( newEditor );
	}
});