import React from 'react';
import { renderToFile } from '@react-pdf/renderer';
import { LiquidacionDoc } from './pdf/LiquidacionDoc.js';
import { liquidacionEjemplo } from './lib/liquidacion.js';

const out = process.argv[2] || 'C:/Users/kevin/AppData/Local/Temp/opencode/current.pdf';
const logoSrc = 'C:/PROYECTOS/PDF-GENERATOR/public/logoliquidacion.png';
await renderToFile(React.createElement(LiquidacionDoc, { values: liquidacionEjemplo, logoSrc }), out);
console.log('WROTE ' + out);
