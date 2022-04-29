import {
  ViewEncapsulation,
  ViewChild,
  ViewChildren,
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import { UtilService } from '../../services/util.service';

import {
  WindowRefService,
  ICustomWindow
} from '../../services/window-ref.service';

let result = [];

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SliderComponent implements OnInit {
  // @Input('slides')
  // public slides         :Array<any>;

  @Input('items')
  public items      :Array<any>
  @Input('title')
  public title      :string
  @Input('type')
  public type       :string
  @Input('sliderType')
  public sliderType       :string
  @Output() open = new EventEmitter<object>();

  // @ViewChild('slider')
  // public slider         :any;

  // @ViewChild('slidesContent')
  // public slidesContent  :any;

  // @ViewChildren('slides')
  // public sliderSlides   :any;

  // @ViewChildren('nav')
  // public sliderNav      :any;

  // @Input('auto')
  // public auto           :boolean;

  // @Input('interval')
  // public interval       :number;

  // @Input('showBullets')
  // public showBullets    :boolean;

  // @Input('showIndex')
  // public showIndex      :boolean;

  public index          :number;
  public activeIndex    :number;
  public isContent      :boolean;
  public bullets        :Array<ElementRef>;
  public isAutoEnabled  :boolean;
  public isTouchEnabled :boolean;

  private timer         :any;
  private xPos          :number;
  private yPos          :number;
  public sliderId      :String;
  private initHeight    :boolean;
  private isMobile      :boolean;
  private window        :ICustomWindow;
  public hoveredItem: string = ''
  public hoverRank: number = 99


  constructor(
    private windowRef: WindowRefService,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    public util: UtilService
  ) {
    // this.auto           = false;
    // this.interval       = 5;
    // this.showBullets    = false;
    // this.showIndex      = false;
    this.index          = 0
    this.activeIndex    = 0
    // this.isContent      = false;
    // this.bullets        = new Array();
    // this.isAutoEnabled  = false;
    // this.isTouchEnabled = false;
    this.window         = windowRef.nativeWindow;
    // this.timer          = null;
    // this.xPos           = null;
    // this.yPos           = null;
    // this.sliderId       = null;
    // this.initHeight     = false;
    this.isMobile       = false;
  }

  public btnLeft(event, name) {
    console.log(name, 'name')
    let slider = null
    try {
      slider = document.querySelector(`div[id=${name}]`)
    } catch(e) {
      console.log(e, 'error')
    } 
        // this.initialMovie = document.getElementById("movie0")
        // this.initialMovie.remove()  
    let movieWidth = document.querySelector("a[class=item]").getBoundingClientRect()
      .width;
    let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies. TODO: make work for mobile because (4 movies/page instead of 6)
    slider.scrollBy({
      top: 0,
      left: -scrollDistance,
      behavior: "smooth",
    });
    this.activeIndex = (this.activeIndex - 1) % 3;
    console.log(this.activeIndex);
    //this.updateIndicators(this.activeIndex);
  }
  // Scroll Right button
  public btnRight(event, name) {
    let slider = null
    try {
      slider = document.querySelector(`div[id=${name}]`)
    } catch(e) {
      console.log(e, 'error')
    } 
    let movieWidth = document.querySelector("a[class=item]").getBoundingClientRect()
      .width;
    let scrollDistance = movieWidth * 7
    console.log(`movieWidth = ${movieWidth}`);
    console.log(`scrolling right ${scrollDistance}`);
    // if we're on the last page
    if (this.activeIndex == 2) {
      // duplicate all the items in the slider (this is how we make 'looping' slider)
      //populateSlider();
      slider.scrollBy({
        top: 0,
        left: +scrollDistance,
        behavior: "smooth",
      });
      this.activeIndex = 0;
      //this.updateIndicators(this.activeIndex);
    } else {
      slider.scrollBy({
        top: 0,
        left: +scrollDistance,
        behavior: "smooth",
      });
      this.activeIndex = (this.activeIndex + 1) % 3;
      console.log(this.activeIndex);
      //this.updateIndicators(activeIndex);
    }
  }

  public openTrailer(item) {
   this.open.emit({item})
   //console.log('coming soon')
  }


  public ngOnInit() {
    //this.sliderId = this.generateId();
  //  try {
  //    if (window.matchMedia('(max-width: 425px)').matches)
  //     this.isMobile = true;
  //  } catch(e) {
  //    console.log(e, 'window error');
  //  } 
  }

  // public ngAfterViewInit() {
  //   //this.updateBullets();
  // }

  // public updateBullets() {
  //   this.sliderNav.changes.subscribe(t => {
     
     
  //       this.bullets = this.sliderNav._results;
  //       this.index = 0;

  //     if (this.bullets && this.bullets.length > 0 && this.auto)
  //       this.enableAutoSliding()

  //     if (!this.isTouchEnabled)
  //     this.setMobileTouch()
  //   })

  //   this.sliderSlides.changes.subscribe(t => {
  //     this.setBackgrounds(this.sliderSlides._results);
  //   })
  // }

  // public ngAfterViewChecked() :void {
   
  //   let slides;

  //   if (this.slides && this.slides.length > 0) {
     
  //     if (!this.initHeight)
  //       //this.setSlideHeight(this.slides[this.index]);
  //     return;
  //   }

  //   this.slides
  //   ? this.isContent = false
  //   : this.isContent = true;

  //   //console.log('more changes', this.slidesContent, this.isContent, 'content?');
    

  //   this.cd.detectChanges();
    

  //   if (this.isContent) {
  //     slides = this.buildSlidesFromContent(
  //       this.slidesContent.nativeElement.parentNode.childNodes
  //     )

  //     if (slides && slides.length > 0) {
  //       this.slides = slides;
  //       //this.detectActiveSlide(this.slides[this.index], this.slidesContent.nativeElement.parentNode.childNodes);
  //     }
        
  //   }

  //   this.cd.detectChanges();
  // }

  // public ngOnChanges(changes: SimpleChanges) :void {
  //   if (changes.title != null && changes.title.currentValue != changes.title.previousValue && this.slidesContent != null) {
  //       //console.log('try to build slides again');
  //       setTimeout (() => {
  //           let slides = null;
  //           slides = this.buildSlidesFromContent(
  //             this.slidesContent.nativeElement.parentNode.childNodes
  //           )
      
  //           if (slides && slides.length > 0) {
  //             this.slides = slides;
  //            // this.detectActiveSlide(this.slides[this.index], this.slidesContent.nativeElement.parentNode.childNodes);
  //             if (this.slider != null && this.slides) {
  //               this.slider.nativeElement.style.width = this.slides.length * 100 + '%'
  //             }
  //           }
  //           this.updateBullets();
  //       },0)
      
  //   }

  //   if (this.isContent)
  //     return;

  //   if (changes.slides != null && changes.slides.currentValue)
  //     if (changes.slides.currentValue.length === 0)
  //       return;

  //   if (this.slider != null && this.slides) {
  //     this.slider.nativeElement.style.width = this.slides.length * 100 + '%'
  //   }
    
      
  // }

  // public setIndex(index:number) :void {
  //   this.index = index;
  //   this.activeIndex = index;
  //   let contents = this.slidesContent.nativeElement.parentNode.childNodes;
  //   //this.detectActiveSlide(this.slides[this.index], contents);
  // }

  // // public detectActiveSlide(slide, slides) {
  // //   slide.className += ' active';
  // //   if (this.index != 0 && this.slides[0] != null) {
  // //     this.slides[0].classList.remove('active');
  // //   }
  // //   if (this.index != 1 && this.slides[1] != null) {
  // //     this.slides[1].classList.remove('active');
  // //   }
  // //   if (this.index != 2 && this.slides[2] != null) {
  // //     this.slides[2].classList.remove('active');
  // //   }
  // //   if (this.index != 3 && this.slides[3] != null) {
  // //     this.slides[3].classList.remove('active');
  // //   }
  // // }

  // public navigate(direction:string, triggered?:boolean) :void {
  //   let contents = this.slidesContent.nativeElement.parentNode.childNodes;
  //   if (direction === 'forward')
  //     if (this.index === this.slides.length - 1) {
  //       this.bullets[this.index = 0].nativeElement.checked = true; 
  //       this.activeIndex = 0;
  //     } else {
  //       this.bullets[this.index = this.index + 1].nativeElement.checked = true;
  //       this.activeIndex = this.index;
  //     } else if (direction === 'backward') {
  //       if (this.index === 0) {

  //         this.bullets[this.index = this.slides.length - 1].nativeElement.checked = true;
  //         this.activeIndex = this.index;
  //       } else {

  //         this.bullets[this.index = this.index - 1].nativeElement.checked = true;
  //         this.activeIndex = this.index;
  //       }  
  //     }
     

  //   if (this.timer && triggered)
  //     this.timer.reset();
  //   //this.setSlideHeight(this.slides[this.index]);
  //   //this.detectActiveSlide(this.slides[this.index], contents);
  // }

  // private setSlideHeight(slide:any, padding?:any) {
  //   // let height:number = null;

  //   // if (!padding)
  //   //   padding = this.getSlidePadding(slide);

  //   // if (!this.isContentSizeConsistent(this.slides[this.index].children))
  //   //   return;

  //   // if (this.isMobile)
  //   //   isNaN(padding)
  //   //   ? height = this.slides[this.index].children[0].scrollHeight
  //   //   : height = this.slides[this.index].children[0].scrollHeight + padding
  //   // else
  //   //   isNaN(padding)
  //   //   ? height = this.slides[this.index].children[0].clientHeight
  //   //   : height = this.slides[this.index].children[0].clientHeight + padding

  //   // // if (slide =! null && slide.style.height === '' || !this.isMobile)
  //   // //   slide.style.height = 300 + 'px';

  //   // if (slide != this.el.nativeElement && !this.isMobile)
  //   //   this.setSlideHeight(slide.parentElement, padding);
  //   // else if (!this.initHeight)
  //   //   this.initHeight = true;
  // }

  // private isContentSizeConsistent(children :any) :boolean {
  //   let i           = -1;
  //   let consistent  = true;

  //   while (children[++i])
  //     if (children[i + 1])
  //       if (children[i].clientHeight != children[i + 1].clientHeight)
  //         consistent = false;

  //   return consistent;
  // }

  // private getSlidePadding(slide:any) {
  //   // let padding       = null;
  //   // let paddingTop    = null;
  //   // let paddingBottom = null;
  //   // padding = this.window
  //   //               .getComputedStyle(slide, null)
  //   //               .getPropertyValue('padding');
  //   // padding = padding.substring(0, padding.length - 2) * 2;

  //   // if (isNaN(padding) || padding === 0) {
  //   //   paddingTop    = this.window
  //   //                       .getComputedStyle(slide, null)
  //   //                       .getPropertyValue('padding-top');
  //   //   paddingTop    = paddingTop.substring(0, paddingTop.length - 2) * 1;

  //   //   paddingBottom = this.window
  //   //                       .getComputedStyle(slide, null)
  //   //                       .getPropertyValue('padding-bottom');
  //   //   paddingBottom = paddingBottom.substring(0, paddingBottom.length - 2) * 1;

  //   //   padding = paddingBottom + paddingTop;
  //   // }

  //   return 0;
  // }

  // private setBackgrounds(slides) :void {
  //   let i = -1
  //   while(++i < slides.length) {
  //     if (this.slides[i].background) {
  //       let slideStyle = slides[i].nativeElement.style;

  //       slideStyle.background     = `url(${this.slides[i].background})`;
  //       slideStyle.backgroundSize = 'cover';
  //     }
  //   }
  // }

  // public buildSlidesFromContent(s) {  
  //   result = new Array()
  //   for (let slide of s) {
  //     if (slide.nodeName !== "#comment") {
  //      // slide.className += ' slider__contents'
  //       result.push(slide);
  //     }
  //   }
  //   this.slider.nativeElement.style.width = result.length * 100 + '%'
  //   return result;
  // }

  // private enableAutoSliding() :void {
  //   setTimeout (() => {
  //     try {
  //         this.window.addEventListener('scroll', () => {
  //           let isInViewport = this.isInViewport(this.el.nativeElement);

  //           if (isInViewport && !this.isAutoEnabled) {
  //             this.isAutoEnabled = true;

  //             this.timer = new this.SliderTimer(() => {
  //               this.navigate('forward')
  //             }, this.interval * 1000, this);

  //             this.el.nativeElement.addEventListener('mouseenter', () => {
  //               this.timer.pause();
  //             })

  //             this.el.nativeElement.addEventListener('mouseleave', () => {
  //               this.timer.resume();
  //             })
  //           }

  //           else if (!isInViewport && this.timer)
  //             this.timer.pause();
  //           else if (isInViewport && this.timer)
  //             this.timer.resume();
  //         })
  //     } catch(e) {
  //       //console.log(this.window, 'error');
  //     }
  // },0)
   
  // }

  // private setMobileTouch() :void {
  //   setTimeout (() => {
  //       try {
  //         this.window.addEventListener('scroll', () => {
  //           if (this.isTouchEnabled)
  //             return;
      
  //           this.el.nativeElement.addEventListener('touchstart', (e) => {
  //             this.xPos = e.touches[0].clientX;
  //             this.yPos = e.touches[0].clientY;
  //           })
      
  //           this.el.nativeElement.addEventListener('touchend', (e) => {
  //             let currentX = e.changedTouches[0].clientX;
  //             let currentY = e.changedTouches[0].clientY;
      
  //             let diffX = this.xPos - currentX;
  //             let diffY = this.yPos - currentY;
      
  //             if (Math.abs(diffX) > Math.abs(diffY)) {
  //               if (diffX > 0) {
  //                 this.navigate('forward', true);
  //               } else {
  //                 this.navigate('backward', true);
  //               }
  //             }
  //           })
      
  //           this.isTouchEnabled = true;
  //         })
  //       } catch(e) {
  //         //console.log(this.window, 'error');
  //       }
  //   },0)
    
  // }

  // private SliderTimer = function(callback, interval, context) {
  //   let timerId, startTime, remaining = 0;
  //   let state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

  //   this.pause = () => {
  //     if (state != 1) return;

  //     remaining = interval - (new Date().getTime() - startTime);
  //     context.window.clearInterval(timerId);
  //     state = 2;
  //   };

  //   this.resume = () => {
  //     if (state != 2) return;

  //     state = 3;
  //     context.window.setTimeout(this.timeoutCallback, remaining);
  //   };

  //   this.reset = () => {
  //     this.pause()
  //     if (state != 2) return;

  //     state = 3;
  //     context.window.setTimeout(this.timeoutCallback, context.interval * 1000);
  //   }

  //   this.timeoutCallback = () => {
  //     if (state != 3)
  //       return;
  //     callback();
  //     startTime = new Date();
  //     timerId = context.window.setInterval(callback, interval);
  //     state = 1;
  //   };

  //   startTime = new Date();
  //   timerId = context.window.setInterval(callback, interval);
  //   state = 1;
  // }

  // private isInViewport(elem) :boolean {
  //   var bounding = elem.getBoundingClientRect();

  //   return (
  //       bounding.top >= 0 &&
  //       bounding.left >= 0 &&
  //       bounding.bottom <= (window.innerHeight || window.document.documentElement.clientHeight) &&
  //       bounding.right <= (window.innerWidth || window.document.documentElement.clientWidth)
  //   );
  // }

  // private generateId() :String {
  //   let result           = new String();
  //   let characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  //   let charactersLength = characters.length;
  //   let length           = 8;

  //   for ( var i = 0; i < length; i++ )
  //      result += characters.charAt(Math.floor(Math.random() * charactersLength));

  //   return result;
  // }
}
