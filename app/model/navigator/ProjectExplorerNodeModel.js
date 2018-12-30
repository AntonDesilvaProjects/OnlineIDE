Ext.define('OnlineIDE.model.navigator.ProjectExplorerNodeModel',{
	extend : 'Ext.data.TreeModel',
	alias : 'model.projectExplorerNodeModel',
	fields : [
		{
			name : 'nodeId'
		},
		{
			name : 'nodeType'
		},
		{
			name : 'autoOpen',
			defaultValue : false
		}
	]
});