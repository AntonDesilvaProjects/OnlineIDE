Ext.define('OnlineIDE.view.navigator.ProjectExplorer',{
	extend : 'Ext.tree.Panel',
	requires : [
		'OnlineIDE.model.viewmodel.ProjectExplorerViewModel'
	],
	alias : 'widget.projectExplorer',
	viewModel : 'projectExplorerViewModel',
	bind : {
		title : '{title}',
		store : '{projectStore}'
	},
	rootVisible : false,
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
	}
});