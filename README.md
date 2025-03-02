# Interpret jazyka ezop

Tento program je interpret pro jednoduchý ezoterický programovací jazyk "ezop". Umožňuje vykonávat jednoduché příkazy pro manipulaci s hodnotou proměnné `@`.

## spuštění

1. Uložte soubor jako `ezop.js`
2. Spusťte příkazem:
   ```
   node ezop.js "..."
   ```
   nebo
   ```
   node ezop.js ...
   ```

## Popis kódu a jeho funkcí

### Kontrola příkazů

```javascript
const validCommands = ['I', '@', 'G', 'O', '+', '-', '0', '#'];
for (let i = 0; i < code.length; i++) {
  if (!validCommands.includes(code[i])) {
    console.error(`Syntaktická chyba: Neznámý příkaz '${code[i]}'`);
    process.exit(1);
  }
}
```

Tato část kontroluje, zda všechny znaky v kódu jsou povolené. Pokud najde neznámý příkaz, vypíše chybu a ukončí program.

### Vytvoření fronty příkazů

```javascript
while (i < code.length) {
  if (code[i] === 'I' && i + 1 < code.length && code[i + 1] === '@') {
    commandQueue.push('I@');
    i += 2;
  }
}
```

Program čte kód znak po znaku a vytváří frontu příkazů. Speciální příkazy složené ze dvou znaků (I@, G@, O@) jsou rozpoznány a zpracovány společně.

### Zpracování vstupu od uživatele

```javascript
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
```

Tato funkce slouží k načtení hodnoty od uživatele, když program narazí na příkaz `I@`. Zobrazí výzvu, přečte hodnotu a zkontroluje, zda je to číslo.

### Vykonávání příkazů

```javascript
switch (command) {
  case 'I@':
    variableAt = await readInput();
    break;
  case 'G@':
    variableAt = Math.floor(Math.random() * 2049) - 1024;
    break;
}
```

Tato část spouští jednotlivé příkazy z fronty. Každý příkaz má svoji vlastní akci, která mění hodnotu proměnné `@` nebo s ní jinak pracuje.

## Podporované příkazy

- `I@` - Načte celé číslo od uživatele
- `G@` - Vygeneruje náhodné číslo mezi -1024 a 1024
- `O@` - Vypíše hodnotu proměnné `@`
- `+` - Zvýší hodnotu proměnné `@` o 1
- `-` - Sníží hodnotu proměnné `@` o 1
- `0` - Nastaví hodnotu proměnné `@` na 0
- `#` - Ukončí program a vypíše zprávu "Skript ukončen."

## Příklad použití

```
node ezop.js "I@++O@-O@#"
```

### Vysvětlení příkladu
1. `I@` - Načte číslo od uživatele
2. `++` - Dvakrát zvýší hodnotu o 1
3. `O@` - Vypíše hodnotu
4. `-` - Sníží hodnotu o 1
5. `O@` - Vypíše hodnotu
6. `#` - Ukončí program

### Ukázka výstupu (při zadání hodnoty 5)
```
Zadejte hodnotu pro @: 5
7
6
Skript ukončen.
```
