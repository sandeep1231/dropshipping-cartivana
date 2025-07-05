import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Use the Angular CLI's dynamic import context for test discovery
const context = (window as any)['__karma__'] && (window as any)['__karma__'].files;
if (context) {
  Object.keys(context)
    .filter(file => /\.spec\.ts$/.test(file))
    .forEach(file => {
      require(file);
    });
}