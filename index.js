const sketch = (p) => {
  let params = {
    angle: 1,
    angleSpeed: 1,
    radius: 50,
    color: "#ff0000",
    text: "Secret Kitchen",
    startX: 0,
    startY: 0,
  };

  p.setup = () => {
    const canvas = p.createCanvas(1920, 1920).canvas;
    p.pixelDensity(1);
    canvas.id = "mainCanvas";
    p.textAlign(p.CENTER, p.CENTER);

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.borderRadius = "16px";
    canvas.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";

    params.startY = p.height / 20;

    const controls = {
      angle: document.getElementById("angle"),
      angleSpeed: document.getElementById("angleSpeed"),
      radius: document.getElementById("radius"),
      color: document.getElementById("color"),
      text: document.getElementById("text"),
    };

    Object.entries(controls).forEach(([key, input]) => {
      input.addEventListener("input", (e) => {
        params[key] =
          key === "color" ? e.target.value : parseFloat(e.target.value);
      });
    });
  };

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

  p.draw = () => {
    // p.background(0);
    p.fill(params.color);
    drawSwirl();

    // Draw text
    p.fill(255);
    p.textSize(32);
    p.text(params.text, p.width / 2, p.height / 2);
  };

  p.windowResized = () => {
    const container = document.querySelector(".canvas-parent");
    const scale = Math.min(
      container.offsetWidth / 1920,
      container.offsetHeight / 1920
    );
    canvas.style.transform = `scale(${scale})`;
  };
};

new p5(sketch, document.querySelector(".canvas-parent"));
