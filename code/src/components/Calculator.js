import React, { useState } from 'react';
import Button from './Button';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [formula, setFormula] = useState('');
  const [error, setError] = useState(null);
  const [displayAnimation, setDisplayAnimation] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      updateDisplayWithAnimation(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      updateDisplayWithAnimation(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const newValue = calculate(currentValue, inputValue, operator);

      setDisplay(String(newValue));
      setFirstOperand(newValue);
      setFormula(`${currentValue} ${operator} ${inputValue} =`);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    try {
      let result;
      switch (operator) {
        case '+':
          result = firstOperand + secondOperand;
          break;
        case '-':
          result = firstOperand - secondOperand;
          break;
        case '*':
          result = firstOperand * secondOperand;
          break;
        case '/':
          if (secondOperand === 0) {
            throw new Error("Cannot divide by zero");
          }
          result = firstOperand / secondOperand;
          break;
        default:
          return secondOperand;
      }

      return Number(result.toFixed(8));
    } catch (err) {
      setError(err.message);
      return 0;
    }
  };

  const calculatePercentage = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handleKeyboardInput = (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      inputDigit(parseInt(key));
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 'Enter' || key === '=') {
      performOperation('=');
    } else if (['+', '-', '*', '/'].includes(key)) {
      performOperation(key);
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clearDisplay();
    } else if (key === 'Backspace') {
      handleBackspace();
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const updateDisplayWithAnimation = (value) => {
    setDisplayAnimation(true);
    setDisplay(value);
    setTimeout(() => setDisplayAnimation(false), 300);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleButtonClick = (e, callback) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    
    // Call the original callback
    callback();
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-display">
          <div className="calculator-formula">{formula}</div>
          {display}
        </div>
        <div className="calculator-keypad">
          <Button label="C" onClick={clearDisplay} className="key-clear" />
          <Button label="±" onClick={toggleSign} className="key-function" />
          <Button label="÷" onClick={() => performOperation('/')} className="key-operator" />
          
          <Button label="7" onClick={(e) => handleButtonClick(e, () => inputDigit(7))} />
          <Button label="8" onClick={(e) => handleButtonClick(e, () => inputDigit(8))} />
          <Button label="9" onClick={(e) => handleButtonClick(e, () => inputDigit(9))} />
          <Button label="×" onClick={(e) => handleButtonClick(e, () => performOperation('*'))} className="key-operator" />
          
          <Button label="4" onClick={(e) => handleButtonClick(e, () => inputDigit(4))} />
          <Button label="5" onClick={(e) => handleButtonClick(e, () => inputDigit(5))} />
          <Button label="6" onClick={(e) => handleButtonClick(e, () => inputDigit(6))} />
          <Button label="-" onClick={(e) => handleButtonClick(e, () => performOperation('-'))} className="key-operator" />
          
          <Button label="1" onClick={(e) => handleButtonClick(e, () => inputDigit(1))} />
          <Button label="2" onClick={(e) => handleButtonClick(e, () => inputDigit(2))} />
          <Button label="3" onClick={(e) => handleButtonClick(e, () => inputDigit(3))} />
          <Button label="+" onClick={(e) => handleButtonClick(e, () => performOperation('+'))} className="key-operator" />
          
          <Button label="0" onClick={(e) => handleButtonClick(e, () => inputDigit(0))} />
          <Button label="." onClick={inputDecimal} />
          <Button label="⌫" onClick={handleBackspace} className="key-function" />
          <Button label="=" onClick={(e) => handleButtonClick(e, () => performOperation('='))} className="key-operator" />
        </div>
      </div>
    </div>
  );
};

export default Calculator; 