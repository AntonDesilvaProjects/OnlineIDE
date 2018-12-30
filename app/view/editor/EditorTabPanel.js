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
			{
				xtype : 'codeEditor',
				title : 'SimpleBinaryTree.java',
				editorConfig : {

				}
			}
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