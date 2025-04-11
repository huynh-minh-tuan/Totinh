document.addEventListener("DOMContentLoaded", () => {
    // Hiệu ứng gõ chữ cho tiêu đề
    const title = document.getElementById("title");
    const text = title.innerText;
    title.innerText = "";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            title.innerText += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // Đọc dữ liệu từ timeline.json
    fetch("timeline.json")
        .then(response => response.json())
        .then(data => {
            const timeline = document.getElementById("timeline");
            data.forEach(item => {
                const timelineItem = document.createElement("div");
                timelineItem.classList.add("timeline-item", item.side);
                timelineItem.innerHTML = `
                    <div class="content">
                        <h2>${item.title} - ${item.date}</h2>
                        <p>${item.description}</p>
                        <img src="${item.image}" alt="${item.title}" style="width: ${item.imageWidth}; height: ${item.imageHeight}; object-fit: cover;">
                    </div>
                `;
                timeline.appendChild(timelineItem);
            });

            // Hiệu ứng fade-in khi cuộn trang
            const items = document.querySelectorAll(".timeline-item");
            const checkVisibility = () => {
                items.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.8) {
                        item.classList.add("visible");
                    }
                });
            };
            window.addEventListener("scroll", checkVisibility);
            checkVisibility();
        })
        .catch(error => console.error("Lỗi khi đọc file JSON:", error));

    // Hiệu ứng trái tim rơi
    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = [];
    const heartCount = 20;

    class Heart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 20 + 10;
            this.speed = Math.random() * 2 + 1;
            this.angle = Math.random() * 360;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = "#ff4d6d";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 2, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 2, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.y += this.speed;
            this.angle += 1;
            if (this.y > canvas.height + this.size) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    for (let i = 0; i < heartCount; i++) {
        hearts.push(new Heart());
    }

    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animateHearts);
    }

    animateHearts();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Icon functionality
    document.getElementById("darkModeIcon").addEventListener("click", () => {
        document.body.classList.remove("snow-theme");
        document.body.classList.add("dark-theme");
        startFallingObjects("dark"); // Stars, moon, fireflies
    });

    document.getElementById("snowModeIcon").addEventListener("click", () => {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("snow-theme");
        startFallingObjects("snow"); // Snowflakes
    });

    document.getElementById("infoIcon").addEventListener("click", () => {
        const modal = document.getElementById("infoModal");
        modal.style.display = "flex";
        modal.querySelector(".modal-content").classList.add("show");
    });

    document.getElementById("infoModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("infoModal")) {
            document.getElementById("infoModal").style.display = "none";
        }
    });

    // Falling objects logic
    function startFallingObjects(mode) {
        const objects = [];
        const objectCount = 50;

        class FallingObject {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 10 + 5;
                this.speed = Math.random() * 2 + 1;
                this.type = mode === "dark" ? ["🌟", "🌙", "✨"][Math.floor(Math.random() * 3)] : "❄️";
            }

            draw() {
                ctx.font = `${this.size}px Arial`;
                ctx.fillText(this.type, this.x, this.y);
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.y = -this.size;
                    this.x = Math.random() * canvas.width;
                }
            }
        }

        for (let i = 0; i < objectCount; i++) {
            objects.push(new FallingObject());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            objects.forEach(obj => {
                obj.update();
                obj.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();
    }
});