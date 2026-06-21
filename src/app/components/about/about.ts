import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, OnDestroy {
  // Array tracking your tribute slider images
  public carouselImages = [
    'https://res.cloudinary.com/dqafvuw3t/image/upload/v1781878748/Hazrat_azwj5w.jpg',
    'https://res.cloudinary.com/dqafvuw3t/image/upload/v1781879272/Hazrat_2_pr54e6.jpg',
    'https://res.cloudinary.com/dqafvuw3t/image/upload/v1781879274/Hazrat_wjdrna.jpg',
    'https://res.cloudinary.com/dqafvuw3t/image/upload/v1781879271/Hazrat_3_pwxa0m.jpg',
    'https://res.cloudinary.com/dqafvuw3t/image/upload/v1781879270/Hazrat_4_jgvobo.jpg'
  ];

  public currentSlideIndex = signal<number>(0);
  private autoCycleInterval: any;

  ngOnInit(): void {
    this.startAutoRotationTimer();
  }

  ngOnDestroy(): void {
    if (this.autoCycleInterval) {
      clearInterval(this.autoCycleInterval);
    }
  }

  nextSlide(): void {
    const nextIndex = (this.currentSlideIndex() + 1) % this.carouselImages.length;
    this.currentSlideIndex.set(nextIndex);
  }

  prevSlide(): void {
    const prevIndex = (this.currentSlideIndex() - 1 + this.carouselImages.length) % this.carouselImages.length;
    this.currentSlideIndex.set(prevIndex);
  }

  setSlide(index: number): void {
    this.currentSlideIndex.set(index);
    clearInterval(this.autoCycleInterval);
    this.startAutoRotationTimer();
  }

  private startAutoRotationTimer(): void {
    this.autoCycleInterval = setInterval(() => {
      this.nextSlide();
    }, 4500);
  }
}
