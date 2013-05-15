
var doc = new jsPDF('portrait', 'in', 'letter');
var margintop = .25;
var marginsides = .25;
var gutter = .15;
var maxrows = 4;
var maxcols = 3;
 
var circle_radius = 2.5/2;
 
doc.setLineWidth(.01);
 
for (var i=0; i < maxrows; i++) {
    var y = margintop + circle_radius +
        (i * (circle_radius*2 + gutter) );
    for (var j=0; j < maxcols; j++) {
        var x = marginsides + circle_radius +
            (j * (circle_radius*2 + gutter) );
 
        doc.circle(x, y, circle_radius, '');
    }
}
 
 
/* doc.setFillColor(0,0,255);
doc.ellipse(80, 20, 10, 5, 'F');
 
doc.setLineWidth(1);
doc.setDrawColor(0);
doc.setFillColor(255,0,0);
*/
 