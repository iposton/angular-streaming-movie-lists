import { Inject, Injectable } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export interface ICustomWindow extends Window {
  __custom_global_stuff: string;
}

@Injectable()
export class WindowRefService {
  constructor(
    @Inject(PLATFORM_ID) public platformId: any
  ) {

  }

  getWindow (): any {
    console.log(this.platformId, 'platformId')
    if (isPlatformBrowser(this.platformId))
      return window;
    else
      return {}
  }

  get nativeWindow (): ICustomWindow {
    return this.getWindow();
  }
}