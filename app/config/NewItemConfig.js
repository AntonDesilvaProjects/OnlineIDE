Ext.define('OnlineIDE.config.NewItemConfig',{
	singleton: true,
	newItems : [
		{
			name : 'Project',
			value : 'Project',
			id : 1000,
			options : [
				{
					name : 'Java',
					value : 'Java',
					id : 1001
				},
				{
					name : 'General',
					value : 'General',
					id : 1002
				}
			]
		},
		{
			name : 'Package',
			value : 'Package',
			id : 2000,
			options : [
				{
					name : 'Java',
					value : 'Java',
					id : 2001
				},
				{
					name : 'General',
					value : 'General',
					id : 2002
				}
			]
		},
		{
			name : 'File',
			value : 'File',
			id : 3000,
			options : [
			]
		}
	],
	getNewItemOptions : function()
	{
		var me = this;
		//enrich the config with external data
		Ext.each( me.newItems, function( config ){
			if( config.name === 'File' )
			{
				config.options.push(
					{
						name : 'Java',
						value : '/ace/mode/java'
					},
					{
						name : 'JavaScript',
						value : '/ace/mode/javascript'
					},
					{
						name : 'SQL',
						value : '/ace/mode/sql'
					},
					{
						name : 'TEXT',
						value : '/ace/mode/txt'
					}
				)
			}
		});
		return me.newItems;
	}
});