Ext.define('OnlineIDE.controller.toolbar.MainToolBarViewController',{
	extend : 'Ext.app.ViewController',
	alias : 'controller.mainToolBarViewController',
	requires : [
		'OnlineIDE.view.navigator.SettingsWindow'
	],
	init : function()
	{

	},
	onNewBtnClick : function()
	{
		
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