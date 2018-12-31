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
		itemcontextmenu : 'onExplorerItemRightClick',
		containercontextmenu : 'onExplorerRightClick'
	},
	border : 1,
	height : 700,
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
	/*
		Refreshes the project explorer and automatically selects and open the passed 
		in node

		TODO: nodeToSelect - one id
			  nodesToOpen - an array of node ids to open in the editor; t
	*/
	refresh : function( nodeId )
	{
		var me = this;
		var vm = me.getViewModel();
		vm.set('nodeIdToAutoSelect', Ext.isEmpty(nodeId) ? undefined : nodeId );
		vm.getStore('projectExplorerStore').load();
	}
});