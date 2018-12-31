Ext.define('OnlineIDE.controller.navigator.NewItemWindowViewController',{
	extend : 'Ext.app.ViewController',
	alias : 'controller.newItemWindowViewController',
	requires : [],
	listen : {
		controller : {
			'*' : {
			}
		}
	},
	init : function()
	{
		this.projectExplorer = Ext.ComponentQuery.query('projectExplorer')[0];
	},
	/*--------------------------------------------------------------------------
								Event Handlers
	---------------------------------------------------------------------------*/
	onNewItemWindowShow : function( newItemWindow )
	{
		newItemWindow.down('form').reset();
	},
	onItemTypeChange : function( combo, newValue, oldValue, eOpts )
	{
		if( Ext.isEmpty(newValue) )
			return;

		var record = combo.findRecordByValue( newValue );

		var itemDetailCombo = this.lookupReference('itemDetailCombo');
		var itemProjectCombo = this.lookupReference('itemProjectCombo');
		var itemPackageCombo = this.lookupReference('itemPackageCombo');

		itemDetailCombo.clearValue();
		itemDetailCombo.getStore().loadRawData( record.data.options );

		//for 'Project' disable the 'In Package' & 'In Project' drop-downs
		if( record.get('name') === 'Project' )
		{
			this.manageCombo( itemProjectCombo, true, true, true );
			this.manageCombo( itemPackageCombo, true, true, true );
		}
		else if( record.get('name') === 'Package' )
		{
			this.manageCombo( itemProjectCombo, false, false, false );
			this.manageCombo( itemPackageCombo, true, true, true );
		}
		else if( record.get('name') === 'File' )
		{
			this.manageCombo( itemProjectCombo, false, false, true );
			this.manageCombo( itemPackageCombo, false, false, true );
		}
	},
	onItemProjectChange : function( combo, newValue, oldValue, eOpts )
	{
		if( Ext.isEmpty(newValue) )
			return;

		var record = combo.findRecordByValue( newValue );		
		//load the packages under the project
		var itemPackageCombo = this.lookupReference('itemPackageCombo');
		itemPackageCombo.clearValue();
		itemPackageCombo.getStore().loadRawData( this.getView().getPackagesForProject( record.get('value') ) );
	},
	onCreateBtnClick : function( btn )
	{
		//make AJAX call to create the new item at the designated location and reload the 
		//project navigator when successful
		var me = this;
		var form = this.lookupReference('newItemForm');
		console.log( form.getValues() );

		Ext.Ajax.request({
			url : '/static_data/success.json',	
			method : 'POST',
			params : form.getValues()
		}).then( function( response ){
			var responseObj = Ext.JSON.decode( response.responseText, true );
			//reload the project navigator
			//auto select the item on the navigator
			//if file, automatically open it
			me.fireEvent('refreshProjectExplorer', responseObj.itemId );
			me.getView().close();
		}, function(){
			Ext.Msg.alert("Error", "Unable to create "+ form.getValues().itemType + " at this time. Please try again later!");
		});
	},
	/*--------------------------------------------------------------------------
								Helper functions
	---------------------------------------------------------------------------*/
	manageCombo : function( combo, hidden, disabled, allowBlank )
	{
		combo.setVisible( !hidden );
		combo.setDisabled( disabled );
		combo.allowBlank = allowBlank;
		combo.validate();
	},
	isValidItemName : function( newItemName )
	{

		console.log( 'Invoked with: ' + newItemName );

		var validationObj = {
			isValid : true,
			msg : undefined
		};

		var itemType = this.lookupReference('itemTypeCombo').getValue();
		var itemDetail = this.lookupReference('itemDetailCombo').getValue();
		var itemProject = this.lookupReference('itemProjectCombo').getValue();
		var itemPackage = this.lookupReference('itemPackageCombo').getValue();

		var projectExplorerController = this.projectExplorer.getController();

		var containsNodeWithText = function( nodeList, testStr )
		{
			var matched = false;
			Ext.each( nodeList, function( node ){
				if( node.get('text') === testStr )
				{
					matched = true;
					return false; //break the loop
				}
			});

			return matched;
		}

		if( itemType === 'Project' )
		{
			//check for other projects with the same name
			validationObj.isValid =  !containsNodeWithText( projectExplorerController.getAllProjects(), newItemName );
			validationObj.msg = (validationObj.isValid === false) ? "A project already exists with the given name!" : undefined;
		}
		else if( itemType === 'Package')
		{
			if( Ext.isEmpty(itemProject) )
			{
				validationObj.isValid = false;
				validationObj.msg = undefined;
			}
			else
			{
				//check other packages within the project for duplication
				validationObj.isValid =  !containsNodeWithText( projectExplorerController.getChildrenNodes( itemProject, 'package' ), newItemName );
				validationObj.msg = (validationObj.isValid === false) ? "A package already exists with the given name!" : undefined;
			}
		}
		else if ( itemType === 'File' )
		{
			if( !Ext.isEmpty(itemProject) && !Ext.isEmpty(itemPackage) )
			{
				//both project and package available - check for files under the package
				validationObj.isValid =  !containsNodeWithText( projectExplorerController.getChildrenNodes( itemPackage, 'file' ), newItemName );
				validationObj.msg = (validationObj.isValid === false) ? "A file already exists with the given name!" : undefined;
			}
			else
			{
				//check at the project level for both files and projects with the same name
				validationObj.isValid =  !containsNodeWithText( projectExplorerController.getChildrenNodes( null, 'file' ), newItemName );
				validationObj.msg = (validationObj.isValid === false) ? "A file already exists with the given name!" : undefined;
			}
		}
		else
		{
			validationObj.isValid = false;
			validationObj.msg = undefined;
		}

		return validationObj; 
	}
});