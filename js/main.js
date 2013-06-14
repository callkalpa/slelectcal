$(document).ready(function(){

	var res = null;

	$('#reset').click(function(){
		$('#previous_date').val('');
		$('#previous_reading').val('');
		$('#current_date').val('');
		$('#current_reading').val('');
		res = null;
	});

	$('#calculate').click(function(){
		calculate();
	});

});

// thousand separator
function addCommas(n){
 	var rx=  /(\d+)(\d{3})/;
	return String(n).replace(/\d+/, function(w){
   	while(rx.test(w)){
	 	w= w.replace(rx, '$1,$2');
 	}
 	return w;
 	});
}

function calculate(){
	var cat = $('#category').val();
	var p_date = (new Date($('#previous_date').val())).getTime();
	var c_date = (new Date($('#current_date').val())).getTime();
	var p_reading = parseInt($('#previous_reading').val());
	var c_reading = parseInt($('#current_reading').val());

	var date_empty = false;
	var reading_empty = false;

	var html = '';
	var errors = new Array();

	// check for errors
	if($('#previous_date').val() == ''){
		errors.push('Previous metering date is empty');
		date_empty = true;
	}
	if($('#current_date').val() == ''){
		errors.push('Current metering date is empty');
		date_empty = true;
	}
	if(p_reading == ''){
		errors.push('Previous meter reading is empty');
		reading_empty = true;
	}
	if(c_reading == ''){
		errors.push('Current meter reading is empty');
		reading_empty = true;
	}

	if(!(date_empty) && p_date > c_date){
		errors.push('Current metering date is earlier than the previous metering date');
	}
	if(!(reading_empty) && p_reading > c_reading){
		errors.push('Current meter reading is lesser than the previous meter reading');
	}

	if(errors.length != 0){
		html += 'Please correct the following errors and try again<br/>'
		html += '<ul>';

		var k=0;

		for(k; k<errors.length; k++){
			html += '<li>' + errors[k] + '</li>';
		}

		html += '</ul>';
		$('#results').html(html);
		return ;
	}

	// get calculated results
	res = calculate_bill(cat, c_date, p_date, c_reading, p_reading, false);
	html += '<table>';
	html += '<tr><td>No of days</td><td id="right">' + res.nod + '</td></tr>';
	html += '<tr><td>No of units (kWh)</td><td id="right">' + addCommas(res.nou) + '</td></tr>';
	html += '<tr><td>&nbsp;</td></tr>';
	html += '<tr><td></td><td id="right">LKR</td></tr>';
	html += '<tr><td>Usage charge</td><td id="right">' + addCommas(res.uc.toFixed(2)) + '</td></tr>';
	html += '<tr><td>Fuel adjustment charge</td><td id="right">' + addCommas(res.fac.toFixed(2)) + '</td></tr>';
	html += '<tr><td>Fixed charge</td><td id="right">' + addCommas(res.fc.toFixed(2)) + '</td></tr>';
	html += '<tr><td>&nbsp;</td></tr>';
	html += '<tr><td><strong>Total charge</strong></td><td id="right"><strong>' + addCommas(res.tot.toFixed(2)) + '</strong></td></tr>';
	html += '</table>';

	$('#results').html(html);
}

