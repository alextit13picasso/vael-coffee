(function () {
    document.addEventListener("DOMContentLoaded", () => {
        // Привязываемся к главному контейнеру, который гарантированно существует всегда
        const mainContainer = document.getElementById('monogatari') || document.body;

        const canvas = document.createElement('canvas');
        canvas.id = 'rainCanvas';
        
        // Жесткое абсолютное позиционирование поверх сцены
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Выставляем слой выше картинок, но ниже черного экрана затухания
        canvas.style.zIndex = '3'; 
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.35'; 
        
        mainContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = mainContainer.clientWidth || window.innerWidth;
            canvas.height = mainContainer.clientHeight || window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        // Небольшая задержка, чтобы Monogatari успел выстроить пропорции окна 9:16
        setTimeout(resizeCanvas, 100);

        const maxDrops = 130; 
        const drops = [];

        for (let i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                length: Math.random() * 25 + 20, 
                speed: Math.random() * 12 + 18,  
            });
        }

        function drawRain() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#ffffff'; 
            ctx.lineCap = 'round';
            ctx.lineWidth = 1.1; 

            for (let i = 0; i < drops.length; i++) {
                const p = drops[i];
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - 3, p.y + p.length);
                ctx.stroke();

                p.y += p.speed;
                p.x -= 1.5;

                if (p.y > canvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < 0) {
                    p.x = canvas.width;
                }
            }
            requestAnimationFrame(drawRain);
        }
        drawRain();
    });
})();
