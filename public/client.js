/**
 * Created by bairnowl on 7/22/16.
 */

var timeBlock = 0.5;
var avgPerBlock;
var extra = 0;

if (array.length >= 16) {
    avgPerBlock = array.length / 16;
    extra = array.length % 16;
} else {
    avgPerBlock = 1;
    timeBlock = 8 / array.length;
}

var startTime = 9;