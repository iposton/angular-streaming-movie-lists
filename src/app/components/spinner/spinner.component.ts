import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SpinnerComponent implements OnInit {
  @Input('size')
  public size         :string;
  @Input('color')
  public color         :string;
  @Input('title')
  public title         :string;

  constructor() { }

  ngOnInit(): void {
  }

}
