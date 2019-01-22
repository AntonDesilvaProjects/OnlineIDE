Ext.define('OnlineIDE.controller.editor.EditorTabPanelViewController',{
	extend : 'Ext.app.ViewController',
	requires : [],
	alias : 'controller.editorTabPanelViewController',
	listen : {
		controller : {
			'*' : {
				explorerFileOpen : 'onExplorerFileOpen'
			}
		},
		component : {
			'codeEditor' : {
				change : {
					fn : 'onCodeEditorChange',
					buffer : 1500 //only fire this handler ONCE 1.5 seconds after the latest event
				}
			}
		}
	},
	init : function()
	{
	},
	/*
		Handles the double click on a file in the workspace. Make AJAX call to fetch the 
		file information and creates new Editor instance to show the file content.
	*/
	onExplorerFileOpen : function( editorConfig )
	{
		var codeEditorPanel = this.getView();
		var newEditor = null;
		//if file is already open, refresh the content, and auto focus on that
		//tab; otherwise, create new editor
		newEditor = codeEditorPanel.getEditor( editorConfig.fileId );
		var maskText = null;
		if(newEditor)
		{
			codeEditorPanel.focusEditor( editorConfig.fileId );
			maskText = 'Refreshing...';
		}
		else
		{
			newEditor = Ext.widget('codeEditor', {
				title : editorConfig.fileName,
				closable : true,
				fileId : editorConfig.fileId
			});
			codeEditorPanel.addEditor( newEditor, true );
			maskText = 'Loading...';
		}
		newEditor.mask( maskText);

		Ext.Ajax.request({
			url : 'http://localhost:3000/rest/editor',
			method : 'GET',
			params : {
				fileId : editorConfig.fileId
			},
			success : function( response ) {
				var responseObj = Ext.JSON.decode( response.responseText, true );
				console.log( responseObj );
				if( responseObj )
				{
					var editor = newEditor.getCodeEditor(); 
					editor.getSession().setValue( responseObj.response.fileContent || '' );
					editor.resize();
					//configure the new editor with data from server
					//unmask
					newEditor.unmask();
				}
			},
			failure : function() {
				newEditor.unmask();	
			},
		});
	},
	/*
		Event handler for the code editor 'change' event. Unlike standard event handler that gets executed
		immediately when its event fires, this handler only executes ONCE for series of events delayed by 1.5 
		seconds. Since the change event fires every time user makes a change to the editor, we wait 1.5 seconds
		after the last change to POST the file content to be saved
	*/
	onCodeEditorChange : function( codeEditor, delta, eOpts )
	{
		this.saveEditorContent( codeEditor.fileId, codeEditor.getEditorContent() );
	},
	saveEditorContent : function( fileId, fileContent )
	{
		Ext.Ajax.request({
			url : 'http://localhost:3000/rest/editor',
			method : 'POST',
			jsonData : {
				fileId : fileId,
				fileContent : fileContent
			}
		}).then( function( response ) {

		}, function( response ){
			Ext.Msg.alert('Error Saving File', 'An unexpected error occurred while saving file!')
		});
	}
});