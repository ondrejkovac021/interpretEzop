const readline = require('readline');

function interpretEzop(code) {
  code = code.replace(/\s+/g, '');

  const validCommands = ['I', '@', 'G', 'O', '+', '-', '0', '#'];
  for (let i = 0; i < code.length; i++) {
    if (!validCommands.includes(code[i])) {
      console.error(`Syntaktická chyba: Neznámý příkaz '${code[i]}'`);
      process.exit(1);
    }
  }
  
  const commandQueue = [];
  let i = 0;
  
  while (i < code.length) {
    if (code[i] === 'I' && i + 1 < code.length && code[i + 1] === '@') {
      commandQueue.push('I@');
      i += 2;
    } else if (code[i] === 'G' && i + 1 < code.length && code[i + 1] === '@') {
      commandQueue.push('G@');
      i += 2;
    } else if (code[i] === 'O' && i + 1 < code.length && code[i + 1] === '@') {
      commandQueue.push('O@');
      i += 2;
    } else if (['+', '-', '0', '#'].includes(code[i])) {
      commandQueue.push(code[i]);
      i++;
    } else {
      console.error(`Syntaktická chyba: Neplatný příkaz v pozici ${i}`);
      process.exit(1);
    }
  }
  

  let variableAt = 0;

  const readInput = () => {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Zadejte hodnotu pro @: ', (answer) => {
        const num = parseInt(answer);
        if (isNaN(num)) {
          console.error('Chyba: Vstup musí být celé číslo');
          process.exit(1);
        }
        rl.close();
        resolve(num);
      });
    });
  };

  const processCommands = async () => {
    while (commandQueue.length > 0) {
      const command = commandQueue.shift();
      
      switch (command) {
        case 'I@':
          variableAt = await readInput();
          break;
        case 'G@':
          variableAt = Math.floor(Math.random() * 2049) - 1024;
          break;
        case 'O@':
          console.log(variableAt);
          break;
        case '+':
          variableAt++;
          break;
        case '-':
          variableAt--;
          break;
        case '0':
          variableAt = 0;
          break;
        case '#':
          console.log('Skript ukončen.');
          return;
      }
    }
  };
  
  processCommands();
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Chyba: Není zadán žádný kód k interpretaci');
  process.exit(1);
}

let code = args[0];

if (code.startsWith('"') && code.endsWith('"')) {
  code = code.substring(1, code.length - 1);
}

interpretEzop(code);
