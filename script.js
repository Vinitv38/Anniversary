let highestZ = 1;

class Paper {
  holdingPaper = false;
  startEventX = 0;
  startEventY = 0;
  moveEventX = 0;
  moveEventY = 0;
  prevEventX = 0;
  prevEventY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
    const moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
    const endEvent = isTouchDevice ? 'touchend' : 'mouseup';

    paper.addEventListener(moveEvent, (e) => {
      e.preventDefault(); // Prevent default touchmove behavior to avoid scrolling on mobile

      if (!this.rotating) {
        this.moveEventX = isTouchDevice ? e.touches[0].clientX : e.clientX;
        this.moveEventY = isTouchDevice ? e.touches[0].clientY : e.clientY;

        this.velX = this.moveEventX - this.prevEventX;
        this.velY = this.moveEventY - this.prevEventY;
      }

      const dirX = (isTouchDevice ? e.touches[0].clientX : e.clientX) - this.startEventX;
      const dirY = (isTouchDevice ? e.touches[0].clientY : e.clientY) - this.startEventY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevEventX = this.moveEventX;
        this.prevEventY = this.moveEventY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener(startEvent, (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.startEventX = isTouchDevice ? e.touches[0].clientX : e.clientX;
      this.startEventY = isTouchDevice ? e.touches[0].clientY : e.clientY;
      this.prevEventX = this.startEventX;
      this.prevEventY = this.startEventY;

      if (isTouchDevice && e.touches.length === 2) {
        this.rotating = true;
      }
    });

    paper.addEventListener(endEvent, () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

function showMore(){
  window.location.href = 'last.html'
}