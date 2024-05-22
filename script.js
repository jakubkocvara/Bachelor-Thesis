$(document).ready(function () {
    $('#cube').mousedown(function () {
        this.style.cursor = '-webkit-grabbing';
    });

    $('#cube').mouseup(function () {
        this.style.cursor = '-webkit-grab';
    });

    $('.scramble').click(function () {
        document.getElementById('cube').virtualrubik.cube.scramble2();
    });

    $('.solve').click(function () {
        if (typeof (playback) !== 'undefined') {
            playback.stop();
        }
        document.getElementById('cube').virtualrubik.cube.solveExec();
    });

    $('.stats').click(function () {
        $('#infoWrapper').hide();
        $('#statsWrapper').show();
    });

    $('.back').click(function () {
        $('#statsWrapper').hide();
        $('#infoWrapper').show();
    });

    $('.testCross').click(function () {
        $('.computing').fadeIn(function () {
            document.getElementById('cube').virtualrubik.cube.testCross();
            drawCrossChart();
            $('.computing').fadeOut();
        });
    });

    $('.testF2L').click(function () {
        $('.computing').fadeIn(function () {
            document.getElementById('cube').virtualrubik.cube.testF2L();
            drawF2LChart();
            $('.computing').fadeOut();
        });
    });

    $('.playpause').click(function () {
        var c = document.getElementById('cube').virtualrubik.cube
        if (typeof (playback) !== 'undefined') {
            if (playback.stopped) {
                if (moveIndex === c.moves.length) {
                    c.setTo(c.before);
                    moveIndex = 0;
                }
                playback.start();
            }
            else {
                playback.stop();
            }
        }
    });

    $('#moves').on('click', '.heading', function () {
        var moves = ['crossMoves', 'f2lMoves', 'ollMoves', 'pllMoves'];
        var c = document.getElementById('cube').virtualrubik.cube;
        var heading = $(this);

        var delay = playback.stopped ? 0 : playback.interval;
        playback.stop();

        setTimeout(function () {
            c.setTo(c.before);

            moveIndex = 0;
            for (var i = 0; i < moves.indexOf(heading.parent().attr('id')) ; i++) {
                moveIndex += c[moves[i]].length;
                c.animate = false;
                c.executeMoves(c[moves[i]]);
                c.animate = true;
            }

            highlightMove(moveIndex);
        }, delay);
    });

    $('#download').click(function () {
        var url = document.getElementById('cube').toDataURL('image/png');
        $('body').append('<img src=' + url + '></img>');
    })
});

window.setVariableInterval = function (callbackFunc, timing) {
    var variableInterval = {
        interval: timing,
        callback: callbackFunc,
        stopped: false,
        runLoop: function () {
            if (variableInterval.stopped) return;
            var result = variableInterval.callback.call(variableInterval);
            if (typeof result == 'number') {
                if (result === 0) return;
                variableInterval.interval = result;
            }
            variableInterval.loop();
        },
        stop: function () {
            $('.playpause').html('Play').removeClass('red').addClass('green');
            this.stopped = true;
            window.clearTimeout(this.timeout);
        },
        start: function () {
            $('.playpause').html('Stop').removeClass('green').addClass('red');
            this.stopped = false;
            return this.loop();
        },
        loop: function () {
            this.timeout = window.setTimeout(this.runLoop, this.interval);
            return this;
        }
    };

    return variableInterval.start();
};

function showMoves(crossMoves, f2lMoves, ollMoves, pllMoves) {
    var moves = ['crossMoves', 'f2lMoves', 'ollMoves', 'pllMoves'];
    var labels = ['Cross', 'F2L', 'OLL', 'PLL'];
    var nocount = '';
    var html = '';
    var moves_html = '';

    for (var i = 0; i < 4; i++) {
        moves_html = '';
        var count = 0;
        for (var j = 0; j < eval(moves[i]).length; j++) {
            if (eval(moves[i])[j].match(/[xyz]/)) {
                nocount = ' nocount';
            }
            else {
                nocount = '';
                count++;
            }
            moves_html += '<span class="move' + nocount + '">' + eval(moves[i])[j] + '</span>';
        }
        html += '<div id="' + moves[i] + '">'
        html += '<div class="heading">' + labels[i] + ' - ' + count + ' moves</div>';
        html += moves_html;
        html += '</div>'
        html+='<div style="clear:both;"></div>'
    }

    $('#moves').html(html);
}

function highlightMove(index) {
    var moves = $('#moves').find('.move');
    moves.removeClass('highlight');
    moves.eq(index).addClass('highlight');
}

function drawCrossChart() {
    var data = {};
    var keys = Object.keys(histogram);
    var values = [];
    var val = 0;
    for (var i = 0; i < keys.length; i++) {
        val = histogram[keys[i]];
        if (val !== 0) {
            values.push(val);
        } else {
            keys.splice(i, 1);
            i--;
        }
    }
    data.labels = keys;
    data.datasets = [];
    data.datasets.push({
        fillColor: "rgba(0,191,255,0.5)",
        strokeColor: "rgba(0,191,255,1)",
        data: values
    });
    var ctx = document.getElementById("chart").getContext("2d");
    var options = { scaleLabel: "<%=Math.floor(value / 10000 * 100)%>%", animationSteps: 300 };
    new Chart(ctx).Bar(data, options);
}

function drawF2LChart() {
    var data = {};
    var keys = Object.keys(histogram);
    var values = [];
    var val = 0;
    for (var i = 0; i < keys.length; i++) {
        val = histogram[keys[i]];
        if (val !== 0) {
            values.push(val);
        } else {
            keys.splice(i, 1);
            i--;
        }
    }
    data.labels = keys;
    data.datasets = [];
    data.datasets.push({
        fillColor: "rgba(0,191,255,0.5)",
        strokeColor: "rgba(0,191,255,1)",
        data: values
    });
    var ctx = document.getElementById("chart").getContext("2d");
    var options = { scaleLabel: "<%=Math.floor(value / 10000 * 100)%>%", animationSteps: 300, pointDot: false };
    new Chart(ctx).Line(data, options);
}