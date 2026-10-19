import { go } from './ui.js';
import { viewHome } from './views/home.js';
import { syncNow } from './net.js';
import './update.js';

go(viewHome);
syncNow();
