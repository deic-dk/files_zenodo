/*                                                                                                                                
 * files_zenodo, ownCloud integration to Zenodo (zenodo.org)
 *                                                                                                                                 
 * This library is free software; you can redistribute it and/or                                                                    
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE                                                               
 * License as published by the Free Software Foundation; either                                                                     
 * version 3 of the License, or any later version.                                                                                  
 *                                                                                                                                  
 * This library is distributed in the hope that it will be useful,                                                                  
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                                                   
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                                                    
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.                                                                              
 *                                                                                                                                  
 * You should have received a copy of the GNU Lesser General Public                                                                 
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.                                                    
 *                                                                                                                                  
 */  

        function files_zenodo_send (filename, context) {
            var dir = context.dir || context.fileList.getCurrentDirectory();
            $.ajax(OC.linkTo('files_zenodo', 'ajax/send.php'), {
                type: 'POST',
                data: {
                    filename: filename,
                    dir: dir
                },
                dataType: 'json',
                success: function(s) {
                   alert(JSON.stringify(s));

                },
                error: function(s) {
                   alert('error ' + JSON.stringify(s));
                }
        });
}

$(document).ready(function() {
    if (typeof FileActions !== 'undefined') {

        FileActions.register('all', t('files_zenodo','to Zenodo'), OC.PERMISSION_READ, '',
function(filename) {
				if(scanFiles.scanning) { return; } // Workaround to prevent additional http request block scanning feedback
				if($('#dropdown').length==0){
					var tr = FileList.findFileEl(filename);
					var itemType = 'file';
					var itemSource = $(tr).data('id');
					var html = '<div id="dropdown" class="drop" data-item-type="'+itemType+'" data-item-source="'+itemSource+'"><b>Send to Zenodo sandbox</b></div>';
					$(html).appendTo( $(tr).find('td.filename') );
					$(tr).addClass('mouseOver');
					addNewDropDown(itemSource);
				}
				else {
					$("#dropdown").slideUp(200, function(){ $(this).remove();});
					$('tr').removeClass('mouseOver');
				}
			}
//            function(filename, context) { files_zenodo_send(filename, context) }
);
            
    }
});

