import {Injectable, ElementRef} from "@angular/core";
import * as d3 from 'd3';

@Injectable()
export class PitchService {

  renderFieldVertically(element: ElementRef, print: boolean) {
    const children = element.nativeElement.children;
    const promise: any = d3.xml(`assets/images/hriste/hriste_vyska${print ? "_bile" : ""}.svg`);
    promise.mimeType("image/svg+xml").get(function (error, xml) {
      if (error) { throw error; }
      if (children.length == 0) {
        element.nativeElement.appendChild(xml.documentElement);
      } else {
        element.nativeElement.replaceChild(xml.documentElement, children[0]);
      }
    });
  }

  renderFieldShots(element: ElementRef, print: boolean) {
    const children = element.nativeElement.children;
    const promise: any = d3.xml(`assets/images/hriste/hriste_vyska_velke${print ? "_bile" : ""}.svg`);
    promise.mimeType("image/svg+xml").get(function (error, xml) {
      if (error) { throw error; }
      if (children.length == 0) {
        element.nativeElement.appendChild(xml.documentElement);
      } else {
        element.nativeElement.replaceChild(xml.documentElement, children[0]);
      }
    });
  }

  renderFieldHorizontally(element: ElementRef, print: boolean) {
    const children = element.nativeElement.children;
    const promise: any = d3.xml(`assets/images/hriste/hriste_sirka${print ? "_bile" : ""}.svg`);
    promise.mimeType("image/svg+xml").get(function (error, xml) {
      if (error) { throw error; }
      if (children.length == 0) {
        element.nativeElement.appendChild(xml.documentElement);
      } else {
        element.nativeElement.replaceChild(xml.documentElement, children[0]);
      }
    });
  }

  renderSmallFieldHorizontally(element: ElementRef, print: boolean) {
    const children = element.nativeElement.children;
    const promise: any = d3.xml(`assets/images/hriste/hriste_sirka_240${print ? "_bile" : ""}.svg`);
    promise.mimeType("image/svg+xml").get(function (error, xml) {
      if (error) { throw error; }
      if (children.length == 0) {
        element.nativeElement.appendChild(xml.documentElement);
      } else {
        element.nativeElement.replaceChild(xml.documentElement, children[0]);
      }
    });
  }
}
