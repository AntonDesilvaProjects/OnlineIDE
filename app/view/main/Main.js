Ext.define('OnlineIDE.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',
    requires: [
        'OnlineIDE.view.main.MainController',
        'OnlineIDE.view.main.MainModel',
        'OnlineIDE.view.toolbar.MainToolBar',
        'OnlineIDE.view.navigator.ProjectExplorer',
        'OnlineIDE.view.editor.EditorTabPanel'
    ],
    controller: 'main',
    viewModel: 'main',
    layout : {
        type : 'border'
    },
    items: [
        {
            xtype : 'mainToolBar',
            region : 'north'
        },
        {
            xtype : 'panel',
            region : 'west',
            width : 300,
            title : 'Navigator',
            collapsible : true,
            border : 1,
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            items : [
                {
                    xtype : 'projectExplorer'
                }
            ]
        },
        {
            xtype : 'editorTabPanel',
            region : 'center'
        },
        {
            xtype : 'panel',
            region : 'south',
            height : 300,
            title : 'Output',
            collapsible : true
        }
    ]
});
