/**
 * Created by bairnowl on 7/23/16.
 */

window.addEventListener('load', function() {
    $('#uploadButton').on('click', function(e) {
        console.log('clicked');
        e.stopImmediatePropagation();
        e.preventDefault();

        $('#dropzone').trigger('submit');
    });
    
}, false);