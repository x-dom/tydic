(function($) {
	// 表格默认
	if ($.fn.datagrid) {
		// $.fn.datagrid.defaults.rownumbers = true;
		$.fn.datagrid.defaults.remoteFilter = true;
		$.fn.datagrid.defaults.filterDelay = 2000;
		$.fn.datagrid.defaults.resizeHandle = 'both';
		$.fn.datagrid.defaults.singleSelect = true;
		$.fn.datagrid.defaults.fitColumns = true;
		// $.fn.datagrid.defaults.pagination = true;
		$.fn.datagrid.defaults.pageNumber = 1;
		$.fn.datagrid.defaults.multiSort = false;
		$.fn.datagrid.defaults.remoteSort = false;
		$.fn.datagrid.defaults.rowStyler = function(index, row) {
			// 表格TR样式，在皮肤文件夹下easyui.css line 1455
			return index % 2 == 0 ? null : {
				'class' : 'datagrid-row-double'
			};
		};
		$.fn.datagrid.defaults.onSelect = function(index, row) {
			$(this).datagrid('unselectRow', index);
		};
	}
	// 下拉清除
//	if ($.fn.combobox) {
//		$.fn.combobox.defaults.icons = [ {
//		    iconCls : 'icon-clear',
//		    handler : function(e) {
//			    $(e.data.target).combobox('clear');
//		    }
//		} ];
//	}
	if ($.fn.combotree) {
		$.fn.combotree.defaults.icons = [ {
		    iconCls : 'icon-clear',
		    handler : function(e) {
			    $(e.data.target).combotree('clear');
		    }
		} ];
	}
})(jQuery);
