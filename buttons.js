var doc = [];
var round_button_cookie = undefined;
var cookie_name = 'round-name-badge-names';

// page
var margintop = .5;
var marginsides = .5;
var gutter = .5;
var maxrows = 3;
var maxcols = 2;

// circle
// VERY IMPORTANT: design should fit in 2.25 in diameter but bleed/margin to 2.75 diameter
var circle_radius = 2.75/2;
var design_radius = 2.25/2;
var circle_margin = .28;
var bleed_factor = 1.02;
var img_radius = circle_radius * bleed_factor;

// THIS IS THE FIRST THING TO ADJUST
// to move the name up (smaller/negative) or down
var name_yoffset = .2;

var ppi = 72;

function drawButtonPDF () {
    doc = new jsPDF('portrait', 'in', 'letter');


    var names = [];
    names = $('#namefield').val().split("\n");

    // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
    var len = names.length;
    for (var i = 0; i < len; i++ ) {
        names[i] && names.push(names[i]);  // copy non-empty values to the end of the array
    }
    names.splice(0 , len);  // cut the array and leave only the non-empty values

    var pages = 0;

    var buttons_per_page = maxrows * maxcols;


    doc.setFont('Helvetica', '');


    while (names.length) {
        doc.setLineWidth(.01);
        for (var i=0; i < maxrows; i++) {
            var y = margintop + circle_radius +
                    (i * (circle_radius*2 + gutter) );

            for (var j=0; j < maxcols; j++) {
                var x = marginsides + circle_radius +
                    (j * (circle_radius*2 + gutter) );

                if (i<4) {
                    if (!logo) console.error("nothing in global `logo` var!");

                    doc.addImage(logo, 'JPEG', x - img_radius, y - img_radius,
                                 img_radius * 2, img_radius * 2);

                    // Too bad, SVG support just not there yet (2015).
//                doc.addSVG(logosvg,  x - circle_radius, y - circle_radius, 2.5, 2.5);
                }

// faint outline for cutting the circle?

//                 doc.setDrawColor(200);
//                 doc.setLineWidth(.001);
//                 doc.circle(x, y, circle_radius);
//
// //                doc.circle(x, y, design_radius);
//                 doc.setDrawColor(0);


                var n = '';
                if (n = names.shift()) {
                    drawName(x, y - .1, n);
                }
            }
        }
        if (names.length) {
            doc.addPage();
        }
    }



}


function drawName (centerx, centery, n) {

    var max_size = 26;
    var min_size = 18;
    var max_lines = 3;
    var max_3line_size = 22;

    doc.setFontSize(max_size);

    var names = n.split(/\s+/);

    var max_middle_line_width_in_pts =  (circle_radius - circle_margin * 2) * 2 * ppi;
    var max_twolines_width = max_middle_line_width_in_pts * .95;
    var max_thirdlines_width = max_middle_line_width_in_pts * .8;

    // This is cool but too simple for our needs.
    // var lines = doc.splitTextToSize(n, max_middle_line_width, {});
    // doc.text(centerx, centery, lines);

    var found_fit = false;
    var found_size = max_size;
    var lines = [];

    while (!found_fit && found_size >= min_size) {
            // Try it on one line
            lines = [n];
            if (doc.getStringUnitWidth(lines[0]) * found_size <= max_middle_line_width_in_pts) {
                found_fit = true;
                console.log('Found ', n, ' fits in one line at ', found_size, ' pts');
            break;
            }

        var hyphenbroken = [];
        // Try on two lines breaking on dashes
        if (n.indexOf('-') > -1) {
            var hyphenated = n.split(/-/);
            lines[0] = hyphenated[0] + "-";
            lines[1] = hyphenated[1];
            hyphenbroken = lines;
                if (doc.getStringUnitWidth(lines[0]) * found_size <= max_twolines_width &&
                doc.getStringUnitWidth(lines[1]) * found_size <= max_twolines_width
               ) {
                    found_fit = true;
                    // console.log('Found ', lines, ' fits in two lines at ', found_size, ' pts');
                break;
                }
        }
        else {
                // Try it on two lines breaking on spaces.
            lines[0] = names.slice(0, names.length - 1).join(' ');
            lines[1] = names[names.length - 1];
                if (doc.getStringUnitWidth(lines[0]) * found_size <= max_twolines_width &&
                doc.getStringUnitWidth(lines[1]) * found_size <= max_twolines_width
               ) {
                    found_fit = true;
                    // console.log('Found ', lines, ' fits in two lines at ', found_size, ' pts');
                break;
                }

        }


            // Try three lines
        if (found_size <= max_3line_size) {

            if (hyphenbroken.length > 0) {
                lines = hyphenbroken;
            }
            if (lines[0].indexOf(' ') > -1 ) {
                lines[2] = lines[1];
                var split_top_line = lines[0].split(/ /);

                lines[0] = split_top_line.slice(0, split_top_line.length - 1).join(' ');
                lines[1] = split_top_line[split_top_line.length - 1];
                    if (doc.getStringUnitWidth(lines[0]) * found_size <= max_thirdlines_width &&
                    doc.getStringUnitWidth(lines[1]) * found_size <= max_middle_line_width_in_pts &&
                    doc.getStringUnitWidth(lines[2]) * found_size <= max_thirdlines_width
                   ) {
                        found_fit = true;
                        // console.log('Found ', lines, ' fits in three lines at ', found_size, ' pts');
                    break;
                    }
            }
        }

            // Try making it smaller
            found_size--;
    }

    var leading_pts = found_size * 0.2;
    if (lines.length > 2) leading_pts = found_size * 0.1;
    var line_height_in = (found_size + leading_pts) / ppi;

    for (var i=0; i<lines.length; i++) {
            var xoffset = 0 - (doc.getStringUnitWidth(lines[i]) * found_size/ppi / 2);

        // .67 because the full height includes descenders which should drop below center.
        var textheight = (lines.length * found_size + (lines.length - 1) * leading_pts)/ppi;

//            var yoffset = (line_height_in * .67) * lines.length/ 2 - (lines.length - 1 - i) * line_height_in;
            var yoffset = name_yoffset + (found_size/ppi * .6) - textheight / 2 + i * line_height_in;
            doc.setFontSize(found_size);
            // console.log('offsetting ', n, ' by ', xoffset, 'in from ', centerx);
            doc.text(centerx + xoffset, centery + yoffset, lines[i]);
    }

}



$(document).ready(function() {

    round_button_cookie = $.cookie(cookie_name);
    if (round_button_cookie === undefined) {
        $.cookie(cookie_name, $('#namefield').val(), { expires: 366*2 });
    }
    else {
        $('#namefield').val(round_button_cookie);
    }


    $('.download-pdf').click(function(){
        console.log('hello download pdf click handler');
        drawButtonPDF();
        doc.save('name-buttons.pdf');
    });

    $('#namefield').bind('input propertychange', function() {
        console.log("change event");
        setTimeout(
            function() {
                console.log('rewriting cookie');
                $.removeCookie(cookie_name);
                $.cookie(cookie_name, $('#namefield').val(), { expires: 366*2 });

                drawButtonPDF();
                var PDFstring = doc.output('datauristring');
                $('.preview-pane').attr('src', PDFstring);
            }
            ,0
        );


    });


    drawButtonPDF();
    var PDFstring = doc.output('datauristring');
    $('.preview-pane').attr('src', PDFstring);


});
