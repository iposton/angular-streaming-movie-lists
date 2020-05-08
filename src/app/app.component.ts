import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isOpen: boolean = false;
  title = 'streaming-lists';

  public navigate(link) {
    window.location.href = link;
  }
}
