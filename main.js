import { go } from './ui.js';
import { viewHome } from './views/home.js';
import { syncNow } from './net.js';
import './update.js';
import { applyTheme } from './theme.js';
import { watchStyles } from './inline.js';

applyTheme();
watchStyles();

go(viewHome);
syncNow();
