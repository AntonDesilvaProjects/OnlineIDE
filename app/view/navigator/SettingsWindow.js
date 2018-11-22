Ext.define('OnlineIDE.view.navigator.SettingsWindow',{
	extend : 'Ext.window.Window',
	alias : 'widget.settingsWindow',
	requires : [],
	title : 'Settings',
	initComponent : function()
	{
		this.items = [
			{
				xtype : 'tabpanel',
				width : '100%',
				height : '100%',
				items : [
					{
						xtype : 'container',
						title : 'General'
					},
					{
						xtype : 'container',
						title : 'Editor'
					}
				]
			}
		];
		this.bbar = [
			{
				xtype : 'tbfill'
			},
			{
				xtype : 'button',
				text : 'Apply',
				dock : 'bottom'
			},
			{
				xtype : 'button',
				text : 'OK',
				dock : 'bottom'
			}
		]
		this.callParent( arguments );
	}
});