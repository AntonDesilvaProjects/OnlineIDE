/*
	NewItemWindow - allows for the creation of new items inside the OnlineIDE

	a) Item Type - the type of item created: Project, Package, or File
	b) Item Detail - specifies further details about the created item.

			For files, specify the type of file(i.e. Java, Python, TXT, etc )
			For Project, specify the type of project(i.e. Java, General)

		Note that General project type shouldn't be compileable - it can be used for simply
		organizing set of unrelated files together(individual files can be compiled where applicable)

	c) Item Project - specifies the project under which the newly created item will be added. Only applicable
	   for packages[mandatory] and files[optional]
	d) Item Package - specifies the package under which the newly created file will be added. Optional.
	e) Item Name - specifies the name of the newly created item. Duplicates are NOT allowed with the same parent folder.

	This window will be auto-populated with any relevant data if launched via a right click context menu. 
*/
Ext.define('OnlineIDE.view.navigator.NewItemWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.newItemWindow',
	requires : [
		'OnlineIDE.model.viewmodel.navigator.NewItemViewModel',
		'OnlineIDE.controller.navigator.NewItemWindowViewController'
	],
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	padding : 10,
	modal : true,
	autoShow : false,
	closeAction : 'hide',
	viewModel : 'newItemViewModel',
	controller : 'newItemWindowViewController',
	referenceHolder : true,
	resizable : false,
	title : 'Create New Item',
	initComponent : function()
	{
		var me = this;

		var itemTypeCombo = Ext.widget('combo',{
			fieldLabel : 'Item',
			name : 'itemType',
			editable : false,
			queryMode : 'local',
			displayField : 'name',
			valueField : 'value',
			allowBlank : false,
			reference : 'itemTypeCombo',
			store : {
				data : OnlineIDE.config.NewItemConfig.getNewItemOptions(),
				proxy : {
					type : 'memory',
					reader : {
						type : 'json'
					}
				}
			},
			bind : {
				value : '{item}'
			},
			listeners : {
				change : 'onItemTypeChange'
			}
		});

		var itemDetailCombo = Ext.widget('combo',{
			editable : false,
			name : 'itemDetail',
			queryMode : 'local',
			displayField : 'name',
			valueField : 'value',
			allowBlank : false,
			reference : 'itemDetailCombo',
			bind : {
				fieldLabel : '{item} Type',
				hidden : '{!item}'
			},
			store : {
				proxy : {
					type : 'memory',
					reader : {
						type : 'json'
					}
				}
			},
		});

		//this dropdown is only applicable if a file or package is selected 
		var itemProjectCombo = Ext.widget('combo',{
			fieldLabel : 'In Project',
			name : 'inProject',
			displayField : 'name',
			valueField : 'value',
			queryMode : 'local', //this is needed with a memory proxy
			editable : false,
			reference : 'itemProjectCombo',
			store : {
				fields : [ 'name', 'value'],
				data : me.getProjects(),
				proxy : {
					type : 'memory',
					reader : {
						type : 'json',
						rootProperty : 'projects'
					}
				},
				autoLoad : true
			},
			listeners : {
				change : 'onItemProjectChange'
			}
		});
		
		//this dropdown is only applicable if a file is selected and project is selected
		var itemPackageCombo = Ext.widget('combo',{
			fieldLabel : 'In Package',
			name : 'inPackage',
			displayField : 'name',
			valueField : 'value',
			reference : 'itemPackageCombo',
			queryMode : 'local',
			editable : false,
			store : {
				fields : [ 'name', 'value'],
				proxy : {
					type : 'memory',
					reader : {
						type : 'json',
						rootProperty : 'packages'
					}
				},
				autoLoad : false
			}
		});

		var itemName = Ext.widget('textfield',{
			allowBlank : false,
			name : 'itemName',
			bind : {
				fieldLabel : '{item} Name'
			},
			reference : 'itemName',
			enableKeyEvents : true,
			validator : function( val )
			{
				var validationRes = me.getController().isValidItemName( val );
				return validationRes.isValid === true ? true : validationRes.msg;
			}
		});

		me.items = [
			{
				xtype : 'form',
				reference : 'newItemForm',
				defaults : {
					width : '90%'
				},
				items : [
					itemTypeCombo, 
					itemDetailCombo, 
					itemProjectCombo,
					itemPackageCombo,
					itemName
				],
				buttons : [
					{
						text : 'Reset',
						handler : function(btn)
						{
							btn.up('form').reset();
						}
					},
					{
						bind: {
							text : 'Create {item}',
						},
						formBind : true,
						handler : 'onCreateBtnClick'
					}
				]
			} 
		];
		me.callParent( arguments );
	},
	preloadData : function( data )
	{
		var record = {
			getData : function()
			{
				return data;
			}
		};
		this.down('form').loadRecord( record );
	},
	getProjects : function()
	{
		var projectExplorer = Ext.ComponentQuery.query('projectExplorer')[0]; 
		var projects = projectExplorer ? projectExplorer.getController().getAllProjects() : [];
		projects = this.getNameValueMappedArray( projects, 'text', 'nodeId');
		return { projects : projects };
	},
	getPackagesForProject : function( projectId )
	{
		var projectExplorer = Ext.ComponentQuery.query('projectExplorer')[0]; 
		var packages = projectExplorer ? projectExplorer.getController().getChildrenNodes( projectId, 'package' ) : [];
		packages = this.getNameValueMappedArray( packages, 'text', 'nodeId');
		return { packages : packages };
	},
	getNameValueMappedArray : function( array, nameField, valueField )
	{
		var mappedArray = Ext.Array.map( array, function( project, idx){
			var mappedObj = {};
			mappedObj['name'] = project.get( nameField );
			mappedObj['value'] = project.get( valueField );
			return mappedObj;
		});
		return mappedArray;
	}
});