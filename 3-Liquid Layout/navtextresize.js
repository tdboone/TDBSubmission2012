//This javascript file sizes the fonts in the left and right columns in the liquid layout
//according to the screen size. An event handler is added to dynamically adjust the font
//size if the window size changes.

var navDiv = document.getElementsByClassName('navigation')[0];
var sidebarDiv = document.getElementsByClassName('sidebar')[0];

function resizeOuterColumns(){
	var width = window.innerWidth;
	if (!width){
		width = document.body.offsetWidth;
	}
	if (width > 1400){
		navDiv.style.fontSize = "1.5em";
		sidebarDiv.style.fontSize = "1.3em";
	}else if (width > 1200){
		navDiv.style.fontSize = "1.3em";
		sidebarDiv.style.fontSize = "1.2em";
	}else if (width > 975){
		navDiv.style.fontSize = "1.1em";
		sidebarDiv.style.fontSize = "1.0em";
	}else{
		navDiv.style.fontSize = "0.95em";
		sidebarDiv.style.fontSize = "0.9em";
	}
}


resizeOuterColumns();
window.onresize = resizeOuterColumns;

