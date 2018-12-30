Ext.define('OnlineIDE.view.navigator.ProjectExplorer',{
	extend : 'Ext.tree.Panel',
	requires : [
		'OnlineIDE.model.viewmodel.navigator.ProjectExplorerViewModel',
		'OnlineIDE.controller.navigator.ProjectExplorerViewController'
	],
	alias : 'widget.projectExplorer',
	viewModel : 'projectExplorerViewModel',
	controller : 'projectExplorerViewController',
	bind : {
		title : '{title}',
		store : '{projectExplorerStore}'
	},
	rootVisible : false,
	listeners : {
		itemclick : 'onExplorerItemClick',
		itemdblclick : 'onExplorerItemDblClick',
		itemcontextmenu : 'onExplorerItemRightClick'
	},
	initComponent : function()
	{
		var me = this;
		me.columns = [
			{
				xtype : 'treecolumn',
				dataIndex : 'text',
				flex : 1,
				align : 'left'
			}
		];
		me.callParent( arguments );
	},
	refresh : function( nodeId )
	{
		var me = this;
		var vm = me.getViewModel();
		vm.set('nodeIdToAutoSelect', Ext.isEmpty(nodeId) ? undefined : nodeId );
		vm.getStore('projectExplorerStore').load();
	}
});