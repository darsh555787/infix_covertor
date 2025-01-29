function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    if (op === '^') return 3;
    return 0;
}

function infixToPostfix(expression) {
    let stack = [];
    let output = "";
    let steps = [];

    for (let char of expression) {
        if (/[a-zA-Z0-9]/.test(char)) {  
            output += char;
            steps.push(`Operand '${char}' added to output: ${output}`);
        } else if (char === '(') {  
            stack.push(char);
            steps.push(`Pushed '(' to stack: [${stack.join(', ')}]`);
        } else if (char === ')') {  
            while (stack.length && stack[stack.length - 1] !== '(') {
                output += stack.pop();
                steps.push(`Popped from stack: ${output}`);
            }
            stack.pop();
            steps.push(`Removed '('`);
        } else {  
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(char)) {
                output += stack.pop();
                steps.push(`Popped higher precedence operator: ${output}`);
            }
            stack.push(char);
            steps.push(`Pushed operator '${char}' to stack: [${stack.join(', ')}]`);
        }
    }

    while (stack.length) {  
        output += stack.pop();
        steps.push(`Popped remaining operator: ${output}`);
    }

    return { postfix: output, steps };
}

function infixToPrefix(expression) {
    let reversed = expression.split("").reverse().join("");
    let steps = [`Reversed Expression: ${reversed}`];

    reversed = reversed.replace(/\(/g, "#").replace(/\)/g, "(").replace(/#/g, ")");
    steps.push(`Swapped brackets: ${reversed}`);

    let { postfix, steps: postfixSteps } = infixToPostfix(reversed);
    steps.push(...postfixSteps);

    let prefix = postfix.split("").reverse().join("");
    steps.push(`Reversed Postfix to get Prefix: ${prefix}`);

    return { prefix, steps };
}

function displaySteps(stepArray, elementId) {
    let listElement = document.getElementById(elementId);
    listElement.innerHTML = ""; 

    stepArray.forEach(step => {
        let li = document.createElement("li");
        li.textContent = step;
        listElement.appendChild(li);
    });
}

function convertExpression() {
    let infix = document.getElementById("infixInput").value;
    
    if (infix === "") {
        alert("Please enter an infix expression!");
        return;
    }

    let { postfix, steps: postfixSteps } = infixToPostfix(infix);
    let { prefix, steps: prefixSteps } = infixToPrefix(infix);

    document.getElementById("postfixResult").textContent = postfix;
    document.getElementById("prefixResult").textContent = prefix;

    displaySteps(postfixSteps, "postfixSteps");
    displaySteps(prefixSteps, "prefixSteps");
}
