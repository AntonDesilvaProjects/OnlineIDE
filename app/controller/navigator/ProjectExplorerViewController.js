Ext.define('OnlineIDE.controller.navigator.ProjectExplorerViewController',{
	extend : 'Ext.app.ViewController',
	requires : [],
	alias : 'controller.projectExplorerViewController',
	listen : {
		controller : {
			'*' : {
				refreshProjectExplorer : 'onProjectExplorerRefresh'
			}
		}
	},
	init : function()
	{

	},
	onProjectExplorerRefresh : function( nodeId )
	{
		this.getView().refresh( nodeId );
	},
	onExplorerItemClick : function( explorer, record, item, index, e, eOpts )
	{
		console.log( record );
		//preview mode - once a file is clicked once, show a preview of the file
	},
	onExplorerItemDblClick : function( explorer, record, item, index, e, eOpts )
	{
		this.openFile( record );
	},
	onExplorerItemRightClick : function( explorer, record, item, index, e, eOpts)
	{
		console.log( record );
		e.stopEvent();
	},
	onProjectExplorerStoreLoad : function( store, records )
	{
		//debugger;
		var me = this;
		var vm = me.getViewModel();
		var view = me.getView();
		var nodeId = vm.get('nodeIdToAutoSelect');
		if(!Ext.isEmpty(nodeId))
		{
			var node = store.findNode( 'nodeId', nodeId, true, true, true );
			if(!Ext.isEmpty(node))
			{
				view.setSelection(node);
				me.openFile(node);
				view.expandPath( node.getPath() );
			}
			vm.set('nodeIdToAutoSelect', undefined );
		}
	},
	openFile : function( fileNode )
	{
		if( fileNode.get('nodeType') === 'file')
		{
			var editorConfig = {};
			editorConfig['fileName'] = fileNode.get('text');
			editorConfig['fileId'] = fileNode.get('nodeId');

			this.fireEvent('explorerFileOpen', editorConfig );
		}
	},
	/*
		Returns a list of all project nodes that are currently in the navigator

		@param excludeCollapsed - true to exclude collapsed projects. Defaults to false
		@param excludeHidden - true to exclude user hidden projects. Defaults to false
	*/
	getAllProjects : function( excludeCollapsed, excludeHidden )
	{
		//Ext.StoreManager.lookup('projectExplorerStore').root.childNodes
		var projectNodes = [];
		var nodes = this.getChildrenNodes( null, 'project' );
		Ext.each( nodes, function( node ) {
			if( (excludeCollapsed === true && !node.isExpanded()) /* || ( excludeHidden === true && !node.isVisible() ) */ )
				return;
			projectNodes.push( node );
		});
		return projectNodes;
	},
	/*
		Returns a list of all immediate nodes under the node with the supplied id.

		@param nodeId - node id to use as the root; if node id is omitted, then all nodes under the root node are returned
		@param nodeType - include nodes of only this type; if omitted, all nodes are returned
	*/
	getChildrenNodes : function( nodeId, nodeType )
	{
		var me = this;
		var store = me.getView().getStore();
		//find the node with supplied id
		var rootNode = Ext.isEmpty(nodeId) ? store.root : store.findNode( 'nodeId', nodeId, true, true, true );
		//return all its children
		var result = [];
		if( !Ext.isEmpty( rootNode ) )
			result = Ext.isEmpty( nodeType ) ? rootNode.childNodes : Ext.Array.filter( rootNode.childNodes, function( childNode, idx ) { return childNode.get('nodeType') === nodeType; });
		return result;
	}
});