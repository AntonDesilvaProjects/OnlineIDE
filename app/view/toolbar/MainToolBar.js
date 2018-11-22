Ext.define('OnlineIDE.view.toolbar.MainToolBar',{
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.mainToolBar',
	requires : [
		'OnlineIDE.controller.toolbar.MainToolBarViewController'
	],
	controller : 'mainToolBarViewController',
	initComponent : function()
	{
		this.items = [
			{
                iconCls : 'fa fa-plus fa-lg',
                handler : 'onNewBtnClick'
            },
            {
                xtype : 'splitbutton',
                iconCls : 'fa fa-play fa-lg',
                handler : 'onRunClick',
                menu : new Ext.menu.Menu({
                	items : [
                		{
                			text : 'Run File',
                			handler : 'onRunFileClick'
                		},
                		{
                			text : 'Run Project',
                			handler : 'onRunProjectClick'
                		}
                	]
                })

            },
            {
                xtype : 'tbfill'
            },
            {
                iconCls : 'fa fa-cog fa-lg',
                tooltip : 'Settings',
                handler : 'onSettingsClick'
            }
		];
		this.callParent( arguments );
	}
});