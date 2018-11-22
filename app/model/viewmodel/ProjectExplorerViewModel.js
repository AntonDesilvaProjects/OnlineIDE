Ext.define('OnlineIDE.model.viewmodel.ProjectExplorerViewModel', {
	extend : 'Ext.app.ViewModel',
	requires : [],
	alias : 'viewmodel.projectExplorerViewModel',
	data : {
		title : 'Project Explorer'
	},
	stores : {
		projectStore : {
			type : 'tree',
			storeId : 'projectStore',
			proxy : {
				type : 'ajax',
				url : '/static_data/projectExplorer.json',
				reader : {
					type : 'json',
					rootProperty : 'children'
				}
			}
			/*root : {
			    expanded: false,
			    children: [
			    	{
			    		text: 'AlgorithmCompendium', 
			    		expanded : true,
				        children : [
				        	{ 
				        		text: 'com.algorithms.tree', 
				        		leaf: true 
				        	},
				        	{ 
				        		text: 'com.algorithms.array', 
				        		expanded: true, 
				        		children: [
				            		{ text: 'RotatingArray.java', leaf: true },
				            		{ text: 'SumArray.java', leaf: true}
				        		] 
				        	},
				        	{ 
				        		text: 'com.algorithms.trie', 
				        		leaf: false 
				        	}
				        ]
				    }
			    ]
			}*/
		}
	}
});