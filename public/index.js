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

    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('callback - particles.js config loaded');
    });
    
}, false);