import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private renderer : Renderer2) { }

  ngOnInit(): void {
    // const parent: HTMLElement = document.getElementById('cai-webchat-div');

    //     console.log("parent:",parent)

    //     const child = parent.children[0];

    //     const child2 = child.children[2];

        // console.log("Childern2 :",child2)

        // this.renderer.setStyle(child2, 'display', 'none');
  }

}
