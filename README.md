# EchoWorld

A simple Node.js utility package that provides echo functionality.

## Installation

```bash
npm install echoworld
```

## Usage

```javascript
const { echoWorld, echo } = require('echoworld');

// Echo with "World" appended
console.log(echoWorld('Hello')); // Output: "Hello World"

// Simple echo
console.log(echo('Hello')); // Output: "Hello"
```

## API

### echoWorld(input)

Returns the input string with " World" appended.

- `input` (string): The string to echo (optional, defaults to empty string)
- Returns: string

### echo(input)

Returns the input string as-is.

- `input` (string): The string to echo (optional, defaults to empty string)
- Returns: string

## License

MIT
