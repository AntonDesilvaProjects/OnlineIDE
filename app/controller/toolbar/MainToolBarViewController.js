Ext.define('OnlineIDE.controller.toolbar.MainToolBarViewController',{
	extend : 'Ext.app.ViewController',
	alias : 'controller.mainToolBarViewController',
	requires : [
		'OnlineIDE.view.navigator.SettingsWindow',
		'OnlineIDE.view.navigator.NewItemWindow'
	],
	listen : {
		controller : {
			'*' : {
				showNewItemWindow : 'onShowNewItemWindow'
			}
		}
	},
	init : function()
	{
		this.newItemWindow = undefined;
	},
	onShowNewItemWindow : function( preConfigData )
	{
		var newItemWindow = this.generateNewItemWindow();
		newItemWindow.show();
		newItemWindow.preloadData( preConfigData );
	},
	onNewBtnClick : function()
	{
		var newItemWindow = this.generateNewItemWindow();
		newItemWindow.show();
	},
	onSettingsClick : function()
	{
		Ext.widget('settingsWindow',{
			width : 700,
			height : 500,
			autoShow : true
		});
	},
	onRunClick : function()
	{

	},
	onRunFileClick : function()
	{

	},
	onRunProjectClick : function()
	{

	},
	generateNewItemWindow : function()
	{
		if( this.newItemWindow === undefined )
		{
			this.newItemWindow = Ext.widget('newItemWindow',{
				width : 600,
				height : 325
			});
		}
		return this.newItemWindow;
	}
});