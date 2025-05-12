import { TextEncoder, TextDecoder } from 'util'; // Node.js built-in util

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder; // Cast to make TypeScript happy
