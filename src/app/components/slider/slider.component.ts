import {
  ViewEncapsulation,
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SliderComponent implements OnInit {

  @Input('items')
  public items      :Array<any>
  @Input('title')
  public title      :string
  @Input('type')
  public type       :string
  @Input('sliderType')
  public sliderType       :string
  @Output() open = new EventEmitter<object>()

  public index          :number;
  public activeIndex    :number;
  public isContent      :boolean;
  public bullets        :Array<ElementRef>;
  public isAutoEnabled  :boolean;
  public isTouchEnabled :boolean;
  public sliderId      :String;
  private isMobile      :boolean;
  public hoveredItem: string = ''
  public hoverRank: number = 99


  constructor(public util: UtilService) {
    this.index          = 0
    this.activeIndex    = 0
    this.isMobile       = false;
  }

  public btnLeft(name) {
    //console.log(name, 'name')
    let slider = document.querySelector(`div[id=${name}]`) 
    let movieWidth = document.querySelector("a[class=item]").getBoundingClientRect().width
    let scrollDistance = movieWidth * 7
    //TODO: make work for mobile because (4 movies/page instead of 6)
    slider.scrollBy({
      top: 0,
      left: -scrollDistance,
      behavior: "smooth",
    })
  }

  public btnRight(name) {
    let slider = document.querySelector(`div[id=${name}]`)
    let movieWidth = document.querySelector("a[class=item]").getBoundingClientRect().width
    let scrollDistance = movieWidth * 7

    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    })
  }

  public openTrailer(item) {
   this.open.emit({item})
  }

  public ngOnInit() {
  }

}
