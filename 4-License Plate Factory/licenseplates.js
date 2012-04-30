var populationBox = document.getElementById('population');
var submitButton = document.getElementById('submit');
var feedbackDiv = document.getElementById('feedback');
var resultsDiv = document.getElementById('resultsDiv');

submitButton.onclick = function(){
	var population = parseInt(populationBox.value);
	if (isNaN(population) || population <= 1){
		feedbackDiv.innerHTML = "Please enter an integer greater than 1";
	}else{
		calculatePlatePattern(population);
	};
}

function calculatePlatePattern(pop){
	//Use logs to determine the maximum possible number of each type of character
	var maxAlphaNum = Math.ceil(Math.log(pop)/Math.log(36));
	var maxAlpha = Math.ceil(Math.log(pop)/Math.log(26));
	var maxNum = Math.ceil(Math.log(pop)/Math.log(10));
	//Start with the highest possible value for minimum excess
	var minExcess = Math.pow(36, maxAlphaNum) * Math.pow(26, maxAlpha) * Math.pow(10, maxNum);
	var alphaNum = 0;
	var alpha = 0;
	var num = 0;
	
	//step through every possible combination of letters, numbers and alphanumeric characters to determine which combination covers the population
	//and produces the minimum number of excess plates. I wasn't sure if that was too inefficient, but even with the population of the
	//entire world (7 billion) it only iterates 490 times, which still runs quick enough to feel instant.
	for (var i = 0; i <= maxAlphaNum; i++){
		for (var j = 0; j <= maxAlpha; j++){
			for (var k = 0; k <= maxNum; k++){
				if (Math.pow(36, i)*Math.pow(26, j)*Math.pow(10, k) >= pop &&
				(Math.pow(36, i)*Math.pow(26, j)*Math.pow(10, k) - pop) < minExcess){
					minExcess = (Math.pow(36, i)*Math.pow(26, j)*Math.pow(10, k) - pop);
					alphaNum = i;
					alpha = j;
					num = k;
				}
			}
		}		
	}	
	
	//Compose a string to describe the pattern
	var patternString = "";	
	if (alphaNum > 0){
		patternString += alphaNum + " alphanumeric" +(alphaNum > 1 ? "s":"")+" (number or letter)" +(alpha > 0 || num > 0 ? ", " : "");
	}
	if (alpha > 0){
		patternString += alpha + " letter"+ (alpha > 1 ? "s": "") + (num > 0 ? ", " : "");
	}
	if (num > 0){
		patternString += num + " number" + (num > 1 ? "s" : "");
	}
	
	resultsDiv.innerHTML = "Population: " + pop + "<br/>"
					+"Pattern: " + patternString + "<br/>"
					+"Total plates: " + (Math.pow(36, alphaNum)*Math.pow(26, alpha)*Math.pow(10, num)) + "<br/>"
					+"Excess plates: " + ((Math.pow(36, alphaNum)*Math.pow(26, alpha)*Math.pow(10, num)) - pop);
}