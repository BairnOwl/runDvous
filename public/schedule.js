/**
 * Created by bairnowl on 7/22/16.
 */

window.addEventListener('load', function() {

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {

            var customers = JSON.parse(req.responseText);
            
            console.log(customers);

            var timeBlock = 0.5;
            var avgPerBlock;
            var extra = 0;

            if (customers.length >= 16) {
                avgPerBlock = customers.length / 16;
                extra = customers.length % 16;
            } else {
                avgPerBlock = 1;
                timeBlock = 8 / customers.length;
            }

            var startTime = 9;
        }
    };

    req.open('GET', '/schedule/data', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();

}, false);