import { Directive, Input, Renderer, ElementRef, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
    selector: '[stickyHeader]'
})

export class StickyHeaderDirective implements AfterViewInit, OnDestroy, OnChanges{

    private windowScrollSubscription: ISubscription = null;
    private windowResizeSubscription: ISubscription = null;
    private header: any = null;
    private offsetTop: number = 0;
    private lastScroll: number = 0;
    private isSticky: boolean = false;
    private hasHeader: boolean = false;
    private headerTop = 0;
    @Input('stickyClass') stickyClass: string = "";
    @Input('stickyTop') stickyTop: number = 0;

    constructor(private elementRef: ElementRef, private renderer: Renderer) {

    }

    ngAfterViewInit(): void {
        setTimeout(()=>{
            this.windowScrollSubscription = Observable.fromEvent(window, 'scroll').subscribe(() => this.manageScrollEvent());
            this.windowResizeSubscription = Observable.fromEvent(window, 'resize').subscribe(() => this.updateHeaderSize());
            const headers = this.elementRef.nativeElement.getElementsByTagName('TR');
            this.hasHeader = headers.length > 0;
            if (this.hasHeader) {
                this.header = headers[0];
                this.headerTop = this.header.getBoundingClientRect()['top'];
                this._calcPosition();
            }
        }, 0);
    }

    ngOnDestroy(): void {
        if (this.windowScrollSubscription){
            this.windowScrollSubscription.unsubscribe();
            this.windowScrollSubscription = null;
        }
        if (this.windowResizeSubscription){
            this.windowResizeSubscription.unsubscribe();
            this.windowResizeSubscription = null;
        }
    }

    ngOnChanges(changes)
    {
        if (changes.stickyTop) {
            this._calcPosition();
        }
    }

    private _calcPosition(){
        if (this.hasHeader) {
            const scroll = window.pageYOffset;
            if (this.isSticky && scroll >= this.headerTop) {
                this.header.style.top =  this.stickyTop + 'px';
            }
        }
    }

    private manageScrollEvent(): void {
        const scroll = window.pageYOffset;
        if (scroll > this.lastScroll && !this.isSticky && scroll >= this.offsetTop) {
            this.setSticky();
        } else if (scroll < this.lastScroll && this.isSticky && scroll <= this.offsetTop) {
            this.unsetSticky();
        }
        this.lastScroll = scroll;
    }

    private setSticky(): void {
        this.isSticky = true;
        this.header.style.position = 'fixed';
        this.header.style.top =  this.stickyTop + 'px';
        this.header.style.display = 'table';
        this.updateHeaderSize();
        this.setClass(true);
    }

    private updateHeaderSize(){
        if (this.isSticky) {
            const tableWidth = this.elementRef.nativeElement.getBoundingClientRect()['right'] - this.elementRef.nativeElement.getBoundingClientRect()['left'];
            this.header.style.width = tableWidth + 'px';
            // update size of TH elements
            const thArray = this.elementRef.nativeElement.getElementsByTagName('TH');
            for (let i = 0; i < thArray.length; i++){
                thArray[i].style.width = tableWidth / thArray.length + "px";
            }
            
        }
    }

    private unsetSticky(): void {
        this.isSticky = false;
        this.header.style.position = 'static';
        this.header.style.width = 'auto';
        this.header.style.display = 'table-row';
        this.setClass(false);
    }

    private setStyle(key: string, value: string): void {
        this.renderer.setElementStyle(this.header, key, value);
    }

    private setClass(add: boolean): void {
        if (this.stickyClass){
            this.renderer.setElementClass(this.header, this.stickyClass, add);
        }
    }

}