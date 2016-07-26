/**
 * Created by bairnowl on 7/22/16.
 */

window.addEventListener('load', function() {

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {

            var customers = JSON.parse(req.responseText);

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
            var endTime = 9 + timeBlock;

            var counter = avgPerBlock;

            for (var i = 0; i < customers.length; i++) {

                customers[i]['ETA'] = formatTime(startTime) + ' - ' + formatTime(endTime);

                counter--;

                if (counter == 0) {
                    counter = avgPerBlock;
                    startTime = endTime;
                    endTime = startTime + timeBlock;
                }
            }

            for (var i = 0; i < customers.length; i++) {
                $('#customerTable').append('<tr id="'+ customers[i]['phoneNumber'] + '">' +
                    '<td>' + customers[i]['name'] + '</td>' +
                    '<td>' + customers[i]['address'] + '</td>' +
                    '<td>' + customers[i]['phoneNumber'] + '</td>' +
                    '<td>' + customers[i]['ETA'] + '</td>' +
                    '</tr>');
            }

            console.log(customers);

            $('#sendMessages').on('click', function() {

            });
        }
    };

    req.open('GET', '/schedule/data', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();

}, false);

function formatTime(time) {
    var meridiem = 'AM';

    if (time >= 12) {
        meridiem = 'PM';
    }

    if (time >= 13) {
        time -= 12;
    }

    var mins = Math.ceil((time - Math.floor(time)) * 60);

    if (mins < 10) {
        mins = '0' + mins;
    }

    return Math.floor(time) + ':' + mins + ' ' + meridiem;
}