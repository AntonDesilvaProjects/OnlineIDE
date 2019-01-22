Ext.define('OnlineIDE.model.viewmodel.navigator.ProjectExplorerViewModel', {
	extend : 'Ext.app.ViewModel',
	requires : [
		'OnlineIDE.model.navigator.ProjectExplorerNodeModel'
	],
	alias : 'viewmodel.projectExplorerViewModel',
	data : {
		title : 'Project Explorer',
		nodeIdToAutoSelect : undefined
	},
	stores : {
		projectExplorerStore : {
			type : 'tree',
			storeId : 'projectExplorerStore',
			model : 'OnlineIDE.model.navigator.ProjectExplorerNodeModel',
			proxy : {
				type : 'ajax',
				//url : '/static_data/projectExplorer.json',
				url : 'http://localhost:3000/rest/projectExplorer',
				reader : {
					type : 'json',
					rootProperty : 'children'
				}
			},
			listeners : {
				load : 'onProjectExplorerStoreLoad'
			}
		}
	}
});