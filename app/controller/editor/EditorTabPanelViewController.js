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
		//create editor object with initial config and add to the editor
		var newEditor = Ext.widget('codeEditor', {
			title : editorConfig.fileName,
			closable : true,
			fileId : editorConfig.fileId
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
			url : '/static_data/success.json',
			method : 'POST',
			params : {
				fileId : fileId,
				fileContent : fileContent
			}
		}).then( function( response ) {

		}, function( response ){
			Ext.Msg.alert('Error Saving File', 'An unexpected error occurred while saving file!')
		});
	}
});