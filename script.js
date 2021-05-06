	
	let psuedoOperand = []; // array to keep digits before making into operands
	let numberPressed;
	let operation;
	let operand1;
	let operand2;
	let result;
	let nodeForKeyboard; // for keyboard support
	let positive = 1; // 1 or -1 for true or false

	
	const digitButton = document.querySelectorAll('.digitButton');
	const operatorButton = document.querySelectorAll('.operatorButton');

	const clearButton = document.querySelector('#clear');
	const negativeButton = document.querySelector('#negative');
	const display = document.querySelector('#display');
	
	display.textContent = 0;
	let startCondition = true;
	
	
	listener();
	
	
	
	// prepares the equation for execution for every case. determines operands.
	function preOperator (p) {
	
		selectIndicator(p);
			
		if (operand1 === undefined) { 
																				
			if (result!==undefined) {
			
				if (psuedoOperand[0]) {					
					result = undefined; 
					operand1 = parseFloat(psuedoOperand.toString().replaceAll(',', ''));  									
				} else {			
					operand1 = result; 					
				}		  
			} else if (startCondition === true) {		
				operand1 = 0;			
			} else {							
				operand1 = parseFloat(psuedoOperand.toString().replaceAll(',', '')); 	
			}		
			psuedoOperand = [];
			operation = p.getAttribute('data-value');
				if (operation === 'eql') {
					result = operand1;	
					operand1 = undefined;
				}
				
		} else if (!psuedoOperand[0]) {	
		
			operation = p.getAttribute('data-value');
			
		} else {
		
			operand2 = parseFloat(psuedoOperand.toString().replaceAll(',', ''));
			psuedoOperand = [];
		
			operator(operand1, operand2);
			operation = p.getAttribute('data-value');
				if (operation === 'eql') {
					operator(operand1, operand2);					
				}
		}		
	}
	
	
	
	// changing background color of selected operator button
	function selectIndicator (p) {	
	
		let id = p.getAttribute('id');
		let selected = document.querySelector('.selected');	
		if (selected !== null) {
			selected.classList.remove('selected');
		}	
		if (id === 'a13') {return;} 
		p.classList.add('selected');	
	}
	
	
	// chooses which operation is going to take place
	function operator(a,b) {	
		switch (operation) {
		
			case 'add':
				add(a,b);
				break;
			
			case 'sub':
				subtract(a,b);
				break;
						
			case 'mul':
				multiply(a,b);
				break;
			
			case 'div':
				divide(a,b);
				break;
				
			case 'eql':
				result = operand1;
				operand1 = undefined;
				operand2 = undefined;	
				break;						
		}	
	}
	
	
	

	// for all the listening events
	function listener () {	
	
		// listening for digit buttons
		digitButton.forEach(function (item) {
			item.addEventListener('click', function(){operandSetter(item);});			
		} );

		// listener for operator buttons
		operatorButton.forEach(function (item) {
			item.addEventListener('click', function(){preOperator(item);})
		});	

		clearButton.addEventListener('click', cleanAll);
		
		negativeButton.addEventListener('click', negative);
		
		
		// keyboard support listener (except for clean and negate)
		window.addEventListener('keydown', keyboard);
	}
	
	
	// keyboard listener
	function keyboard(event) {
		let code = event.keyCode;
		code = 'a' + code;
		
		nodeForKeyboard = document.querySelector(`#${code}`);
		nodeClass = nodeForKeyboard.getAttribute('class');

		if (nodeClass === 'digitButton') {
			operandSetter(nodeForKeyboard);
			} else {
			preOperator(nodeForKeyboard);		
			}
	}
	
	
	// function for negative/positive button
	function negative () {	
		positive = positive*(-1);
		
		if (startCondition) {		
			let p = (positive===1) ? '0' : '-';
			display.textContent = p;		
		} else if (result && operation==='eql') {		
			result = result*(-1);
			display.textContent = precisionSetter(result);
			positive = positive*(-1);		
		} else {		
			if (psuedoOperand[0] === '-') {			
				psuedoOperand.shift();
				display.textContent = psuedoOperand.toString().replaceAll(',', '');				
			} else {			
				psuedoOperand.unshift('-');
				display.textContent = psuedoOperand.toString().replaceAll(',', '');			
			}
			positive = positive*(-1);		
		}
	}
	
	
	
	function cleanAll () {
		operand1 = undefined;
		operand2 = undefined;
		operation = undefined;
		result = undefined;
		psuedoOperand = [];
		display.textContent = '0';
		startCondition = true;		
	}
	
	
	// management of digit buttons for forming operands
	function operandSetter (p) {	
				
		startCondition = false;		
		numberPressed = p.getAttribute('data-value');
		
		if (psuedoOperand.includes('.') && numberPressed === '.') 
		{return;}
		
		if (psuedoOperand[0] === '0' && numberPressed !== '.' && psuedoOperand.length === 1) 
		{psuedoOperand.pop();}
		
		if (psuedoOperand[0] === '-' && psuedoOperand[1] === '0' && numberPressed !== '.' && psuedoOperand.length === 2)
		{psuedoOperand.pop();}
		
		if (psuedoOperand.length === 10) 
		{return;} 
				
		if (positive === -1) {		
			psuedoOperand.unshift('-');			
			positive = positive*(-1);		
		}
		
		if (numberPressed === 'bs') {		
			if (psuedoOperand[1]) {	
				psuedoOperand.pop();			
			} else {			
				cleanAll();				
				return;			
			}		
		} else {
			psuedoOperand.push(numberPressed);	
		}
		display.textContent = psuedoOperand.toString().replaceAll(',', '');
	}
	
		
	
	// operation executer functions
	function add (op1, op2) {	
		
		display.textContent = precisionSetter(op1+op2);	
		operand1=(op1+op2);	
	}
	
	
	function subtract (op1, op2) {
		
		display.textContent = precisionSetter(op1-op2);	
		operand1=(op1-op2);	
	}
	
	
	function multiply (op1, op2) {
		
		display.textContent = precisionSetter(op1*op2);	
		operand1=(op1*op2);	
	}
	
	
	function divide (op1, op2) {
	
		if (op2 == '0') {					
			cleanAll();
			display.textContent = 'math error';
			return;		
		} else {			
			display.textContent = precisionSetter(op1/op2);	
			operand1=(op1/op2);
		}
	}
	
	
	// digit overflow preventing function
	function precisionSetter (num) {
	
		numstr = String(num);
		
		if (numstr.length<11) {		
			return num;		
		} else {						
			num = num.toPrecision(9);			
			return num;			
		}		
	}
	