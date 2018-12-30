Ext.define('OnlineIDE.controller.toolbar.MainToolBarViewController',{
	extend : 'Ext.app.ViewController',
	alias : 'controller.mainToolBarViewController',
	requires : [
		'OnlineIDE.view.navigator.SettingsWindow',
		'OnlineIDE.view.navigator.NewItemWindow'
	],
	init : function()
	{
		this.newItemWindow = undefined;
	},
	onNewBtnClick : function()
	{
		if( this.newItemWindow === undefined )
		{
			this.newItemWindow = Ext.widget('newItemWindow',{
				width : 600,
				height : 325
			});
		}
		this.newItemWindow.show();
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

	}
});