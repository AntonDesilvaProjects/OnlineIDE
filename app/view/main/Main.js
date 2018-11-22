Ext.define('OnlineIDE.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',
    requires: [
        'OnlineIDE.view.main.MainController',
        'OnlineIDE.view.main.MainModel',
        'OnlineIDE.view.editor.CodeEditor',
        'OnlineIDE.view.toolbar.MainToolBar'
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
            collapsible : true
        },
        {
            xtype : 'codeEditor',
            region : 'center',
            editorConfig : {

            }
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
