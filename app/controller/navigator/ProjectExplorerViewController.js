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
	/*----------------------------------------------------------------
							Event Handlers
	------------------------------------------------------------------*/
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
		this.openFiles( record );
	},
	onExplorerItemRightClick : function( explorer, record, item, index, e, eOpts)
	{
		e.stopEvent();
		console.log( record );
		this.generateContextMenu( record, e.getXY() );
	},
	onExplorerRightClick : function( explorer, e, eOpts )
	{
		e.stopEvent();
		this.generateContextMenu( null, e.getXY() );
	},
	onProjectExplorerStoreLoad : function( store, records )
	{
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
				me.openFiles(node);
				view.expandPath( node.getPath() );
			}
			vm.set('nodeIdToAutoSelect', undefined );
		}
	},
	/*
		This is a generic event handler that gets called when any context menu within
		the project explorer is clicked
	*/
	onExplorerContextMenuClick : function( menu, item, e, eOpts )
	{
		var record = menu.clickedRecord;
		console.log( this.getAncestorNodes( record ) );
		var recordType = Ext.isEmpty( record ) ? 'explorer' : record.get('nodeType');

		//handle menu options for creating new items
		if( ['newProject', 'newPackage', 'newFile'].includes( item.action ) )
		{
			//based on the context, generate a data object to pass into the new item window
			//this info will be used to pre-populate the window
			var preconfigData = {};
			if( recordType === 'project' )
				preconfigData['inProject'] = record.get('nodeId');
			else if ( recordType === 'package' )
			{
				preconfigData['inProject'] = record.parentNode.get('nodeId');
				preconfigData['inPackage'] = record.get('nodeId');
			}

			//TODO: we can also figure out the item detail based on the clicked on project or package
			//but the node should have the item detail infor available

			if( item.action === 'newFile' )
			{
				preconfigData['itemType'] = 'File';
				preconfigData['itemName'] = 'NewFile-' + Math.floor(Math.random() * 1000000) + 1; 
				preconfigData['itemDetail'] = 'Java';
			}
			else if( item.action === 'newProject' )
				preconfigData['itemType'] = 'Project';
			else if( item.action === 'newPackage' )
				preconfigData['itemType'] = 'Package';

			console.log( preconfigData );
			//launch the new item dialog by firing event
			this.fireEvent( 'showNewItemWindow', preconfigData );
		}
	},
	/*----------------------------------------------------------------
							Helper Functions
	------------------------------------------------------------------*/
	generateContextMenu : function( record, position )
	{
		var me = this;
		var menuItems = this.getContextMenuItems( record );
		if( !this.explorerContextMenu)
			this.explorerContextMenu = Ext.widget('menu', {
				listeners : {
					click : me.onExplorerContextMenuClick,
					scope : me
				}
			});
		else
			this.explorerContextMenu.removeAll();

		this.explorerContextMenu.clickedRecord = record;
		this.explorerContextMenu.add(menuItems);
		this.explorerContextMenu.showAt( position );
		
		return this.explorerContextMenu;
	},
	getContextMenuItems : function( record )
	{
		var itemType = record ? record.get('nodeType') : null;
		var menuItems = [];

		if( itemType === 'file' )
		{
			menuItems.push( 
				{ text : 'Rename', action : 'rename' },
				{ text : 'Remove', action : 'delete' },
				{ text : 'About', action : 'about'}
			);
		}
		else if( itemType === 'project' )
		{
			menuItems.push( 
				{ text : 'Rename', action : 'rename' },
				{ text : 'Remove', action : 'delete' },
				{ text : 'New Package', action : 'newPackage'},
				{ text : 'New File', action : 'newFile'},
				{ text : 'About', action : 'about'}
			);
		}
		else if( itemType === 'package' )
		{
			menuItems.push(
				{ text : 'Rename', action : 'rename' },
				{ text : 'Remove', action : 'delete' }, 
				{ text : 'New File', action : 'newFile'},
				{ text : 'About', action : 'about'}
			);
		}
		else //click on the explorer itself
		{
			menuItems.push(
				{ text : 'New Package', action : 'newPackage'},
				{ text : 'New File', action : 'newFile'}
			);
		}
		return menuItems;
	},
	openFiles : function( fileNode )
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
	},
	/*
		Returns a list of all ancestor nodes to a supplied node. First node of the list will be the parent followed by
		the grandparent, then the great-grandparent and so on. The last element would always be the root node

		@return array of Node objects; an empty list would indicate that a valid node is the root
	*/
	getAncestorNodes : function( node )
	{
		console.log( 'Node plugged into getAncestorNodes', node );
		var me = this;
		var ancestorList = [];
		if( !Ext.isEmpty(node) )
		{
			var currentAncestor = node.parentNode;
			while( !Ext.isEmpty(currentAncestor) )
			{
				ancestorList.push( currentAncestor );
				currentAncestor = currentAncestor.parentNode;
			}
		}
		return ancestorList;
	}
});