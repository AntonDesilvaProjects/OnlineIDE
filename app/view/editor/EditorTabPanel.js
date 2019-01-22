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
		//map to hold editors keyed by file id
		//key=fileId, value=editor
		this.editorMap = new Ext.util.HashMap();
		this.items = [];
		this.callParent( arguments );
	},
	addEditor : function( newEditor, autoFocus )
	{
		var me = this;
		me.add( newEditor );
		me.editorMap.add( newEditor.fileId, newEditor );
		if( autoFocus )
			me.setActiveTab( newEditor );
	},
	/*
		Returns the editor associated with the file id
	*/
	getEditor : function( fileId )
	{
		/*var me = this;
		var editors = me.items.getRange();
		var editor = null;
		Ext.each( editors, function( currentEditor ){
			if( currentEditor.fileId === fileId )
			{
				editor = currentEditor;
				return false;
			}
		});
		return editor;*/
		return this.editorMap.get( fileId );
	},
	/*
		Focus the editor associated with the file id
	*/
	focusEditor : function( fileId )
	{
		this.setActiveTab( this.editorMap.get( fileId ) );
	}
});