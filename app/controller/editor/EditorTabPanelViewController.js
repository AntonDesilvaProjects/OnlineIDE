Ext.define('OnlineIDE.controller.editor.EditorTabPanelViewController',{
	extend : 'Ext.app.ViewController',
	requires : [],
	alias : 'controller.editorTabPanelViewController',
	listen : {
		controller : {
			'*' : {
				explorerFileOpen : 'onExplorerFileOpen'
			}
		}
	},
	init : function()
	{
	},
	/*
		Handles the double click on a file in the workspace. Make
		AJAX call to fetch the file information and creates new 
		Editor instance to show the file content.
	*/
	onExplorerFileOpen : function( editorConfig )
	{
		//create editor object with initial config and add to the editor
		var newEditor = Ext.widget('codeEditor', {
			title : editorConfig.fileName,
			closable : true
		});
		this.getView().addEditor( newEditor, true );
		newEditor.mask('Loading...');

		Ext.Ajax.request({
			url : '/static_data/file.json',
			method : 'GET',
			params : {
				fileId : editorConfig.fileId
			},
			success : function( response ) {
				var responseObj = Ext.JSON.decode( response.responseText, true );
				console.log( responseObj );
				var editor = newEditor.getCodeEditor(); 
				editor.getSession().setValue( responseObj.content );
				editor.resize();
				//configure the new editor with data from server
				//unmask
				newEditor.unmask();
			},
			failure : function() {
				
			},
		});
	}
});