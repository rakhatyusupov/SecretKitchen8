const sketch = (p) => {
  // Parameters for both swirl (unused now) and Perlin noise
  let params = {
    angle: 1,
    angleSpeed: 1,
    radius: 50,
    color: "#ff0000",
    text: "Путь к сердцу женщины",
    startX: 0,
    startY: 0,
    // New Perlin noise controls
    noiseFactor: 3,
    noiseScale: 0.01,
    shrinkRate: 0.998,
  };

  // Variables for the Perlin shape (base radius remains separate)
  let points = 100; // Number of points on the shape
  let shapeRadius = 100; // Base radius for the Perlin shape
  let time = 0; // Time variable for noise evolution
  let noiseOffsetR = 0; // Offset for red color noise
  let noiseOffsetG = 100; // Offset for green color noise
  let noiseOffsetB = 200; // Offset for blue color noise
  let noiseOffsetX = 200; // Offset for movement X
  let noiseOffsetY = 100; // Offset for movement Y
  let shrinkFactor = 1; // Factor to control shrinkage

  // Function to draw a linear gradient background (from #FF9AEE to #FF2134)
  const drawGradient = () => {
    let ctx = p.drawingContext;
    let gradient = ctx.createLinearGradient(0, 0, p.width, p.height);
    gradient.addColorStop(0, "#FF9AEE");
    gradient.addColorStop(1, "#FF2134");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, p.width, p.height);
  };

  p.setup = () => {
    const canvas = p.createCanvas(1920, 1920).canvas;
    p.pixelDensity(1);
    canvas.id = "mainCanvas";
    // Set default text alignment (other text settings can be adjusted later)
    p.textAlign(p.CENTER, p.CENTER);

    // Canvas style
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.borderRadius = "16px";
    canvas.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";

    params.startY = p.height / 20;

    // Gather all controls (existing and new Perlin controls)
    const controls = {
      angle: document.getElementById("angle"),
      angleSpeed: document.getElementById("angleSpeed"),
      radius: document.getElementById("radius"),
      color: document.getElementById("color"),
      text: document.getElementById("text"),
      noiseFactor: document.getElementById("noiseFactor"),
      noiseScale: document.getElementById("noiseScale"),
      shrinkRate: document.getElementById("shrinkRate"),
    };

    // Update params when any control changes.
    Object.entries(controls).forEach(([key, input]) => {
      input.addEventListener("input", (e) => {
        // For color and text, keep the string; otherwise convert to float.
        params[key] =
          key === "color" || key === "text"
            ? e.target.value
            : parseFloat(e.target.value);
      });
    });

    // Draw the gradient background once on setup
    drawGradient();
  };

  // --- Unused swirl function (left for reference) --- //
  /*
  const drawSwirl = () => {
    p.translate(p.width / 2, p.height / 2);
    let x = 100 * p.cos(params.angle);
    let y = 100 * p.sin(params.angle) * p.cos(params.angle);
    let z = 100 * p.sin(params.angle) * p.cos(params.angle) * 0.01;
    params.angle += p.radians(params.angleSpeed * 0.5);
    for (let x = params.startX; x < p.width; x += 2.5) {
      let yPos = params.startY + p.sin(x * 0.025 + p.frameCount * 0.01) * 100;
      p.rotate(0.009);
      p.stroke(255, 60);
      p.strokeWeight(0.5);
      p.ellipse(x - 400, yPos + 20, 50);
      p.stroke(25, 60, 255, 60);
      p.ellipse(x - 400, yPos - 20, 50);
      p.ellipse(x - 400, yPos - 200, z - 10);
      p.ellipse(x - 400, yPos - 400, z - 100);
      p.ellipse(x - 400, yPos - 600, z - 10);
    }
  };
  */

  // Function to draw the Perlin noise–based shape
  const drawShape = (offsetX, offsetY) => {
    // Set stroke color based on Perlin noise for RGB components
    let rColor = p.noise(noiseOffsetR) * 255;
    let gColor = p.noise(noiseOffsetG) * 255;
    let bColor = p.noise(noiseOffsetB) * 255;
    p.stroke(rColor, gColor, bColor);

    // Update shrink factor and compute the current radius
    shrinkFactor *= params.shrinkRate;
    let currentRadius = shapeRadius * shrinkFactor;

    p.beginShape();
    for (let i = 0; i < points; i++) {
      let angle = p.map(i, 0, points, 0, p.TWO_PI);
      let xoff = p.cos(angle) + time;
      let yoff = p.sin(angle) + time;
      let ra =
        currentRadius +
        p.noise(xoff, yoff) * params.noiseFactor * currentRadius;
      let x = ra * p.cos(angle);
      let y = ra * p.sin(angle);
      p.vertex(x + offsetX, y + offsetY);
    }
    p.endShape(p.CLOSE);
  };

  // drawPerlin uses drawShape and updates noise offsets for animation.
  const drawPerlin = () => {
    // Calculate a small translation based on Perlin noise
    let posX =
      p.noise(noiseOffsetX) * params.noiseFactor - params.noiseFactor / 4;
    let posY =
      p.noise(noiseOffsetY) * params.noiseFactor - params.noiseFactor / 4;

    p.push();
    p.translate(p.width / 2 + posX, p.height / 2 + posY);
    p.scale(4);
    drawShape(posX, posY);
    p.pop();

    // Update noise offsets and time for continuous evolution
    noiseOffsetR += 0.01;
    noiseOffsetG += 0.01;
    noiseOffsetB += 0.01;
    noiseOffsetX += params.noiseScale;
    noiseOffsetY += params.noiseScale;
    time += 0.01;

    // Reset offsets if needed (optional)
    if (posX > p.width / 2 || posY > p.height / 2) {
      noiseOffsetX = 200;
      noiseOffsetY = 100;
    }
  };

  p.draw = () => {
    // (Optional) Uncomment the next line to clear the frame on each draw:
    // p.clear();

    // Draw the animated Perlin noise shape.
    drawPerlin();

    // --- Render the text at the bottom of the sketch --- //
    p.push();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.fill(255);
    p.textSize(48);
    p.text(params.text, p.width / 2, p.height - 150);
    p.text("лежит через secret-kitchen", p.width / 2, p.height - 100);
    p.pop();
  };

  p.windowResized = () => {
    const container = document.querySelector(".canvas-parent");
    const scale = Math.min(
      container.offsetWidth / 1920,
      container.offsetHeight / 1920
    );
    const canvas = document.getElementById("mainCanvas");
    if (canvas) {
      canvas.style.transform = `scale(${scale})`;
    }
  };
};

new p5(sketch, document.querySelector(".canvas-parent"));
