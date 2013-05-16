
var doc;

function drawButtonPDF () {
    doc = new jsPDF('portrait', 'in', 'letter');
    var margintop = .25;
    var marginsides = .25;
    var gutter = .15;
    var maxrows = 4;
    var maxcols = 3;
    
    var circle_radius = 2.5/2;
    var circle_margin = .25;
    
    
    var names = $('#namefield').val().split("\n");

    // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
    var len = names.length;
    for (var i = 0; i < len; i++ ) {
	names[i] && names.push(names[i]);  // copy non-empty values to the end of the array
    }
    names.splice(0 , len);  // cut the array and leave only the non-empty values
    
    var pages = 0;

    var buttons_per_page = maxrows * maxcols;

    doc.setFontSize(24);

    while (names.length) {
	doc.setLineWidth(.01);
	for (var i=0; i < maxrows; i++) {
	    var y = margintop + circle_radius +
		(i * (circle_radius*2 + gutter) );
	    for (var j=0; j < maxcols; j++) {
		var x = marginsides + circle_radius +
		    (j * (circle_radius*2 + gutter) );
	
		// if (i==0) {
		if (!logo) console.error("nothing in global `logo` var!");
	//	doc.addImage(logo, 'JPEG', x - circle_radius, y - circle_radius, 2.5, 2.5); 
//		doc.addSVG(logosvg,  x - circle_radius, y - circle_radius, 2.5, 2.5); 
		// }
		doc.circle(x, y, circle_radius);
		var n = '';
		if (n = names.shift()) {
		    drawName(x - circle_radius + circle_margin,  y,n);
		}
	    }
	}
	if (names.length) {
	    doc.addPage();
	}
    }



}


function drawName (centerx, centery, n) {
    doc.text(centerx, centery, n);
}


drawButtonPDF();
var PDFstring = doc.output('datauristring');
$('.preview-pane').attr('src', PDFstring);

// doc.save('rawrr');

// var initDownloadPDF = function() {
//     $('.download-pdf').click(function(){
// 	// eval(editor.getValue());

// 	// var file = demos[$('#template').val()];
// 	// if (file === undefined) {
// 	//     file = 'demo';
// 	// }
// 	var file = 'buttons';
// 	doc.save(file + '.pdf');
//     });
//     return false;
// };

$(document).ready(function() {
    $('.download-pdf').click(function(){
	console.log('hello download pdf click handler');
	drawButtonPDF();
	doc.save('name-buttons.pdf');
    });

    $('#namefield').bind('input propertychange', function() {
	console.log("change event");
			setTimeout(function() {

	drawButtonPDF();
	var PDFstring = doc.output('datauristring');
	$('.preview-pane').attr('src', PDFstring);
			}
				   ,0);

	
    });

});
