// Helper to randomize
function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

// Balloons logic
function createBalloon(color) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.setProperty('--color', color);
    balloon.style.left = `${randomBetween(5, 95)}vw`;
    balloon.style.animationDuration = `${randomBetween(7, 13)}s`;
    balloon.style.transform = `scale(${randomBetween(0.88,1.11)})`;
    document.getElementById('balloon-container').appendChild(balloon);
    balloon.addEventListener('animationend', () => balloon.remove());
}

function launchBalloons() {
    const colors = ['#ffb3c6', '#fceabb', '#b5ead7', '#c8b6ff', '#ffdac1', '#baffc9', '#ffffba', '#bae1ff', '#f6b1c3', '#fdffb6'];
    let count = 0;
    let balloonInterval = setInterval(() => {
        createBalloon(colors[Math.floor(Math.random()*colors.length)]);
        count++;
        if (count > 20) clearInterval(balloonInterval);
    }, 180);
}

// Confetti logic
function confettiBurst() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confs = [];
    const confettiColors = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#F7B7A3','#F9C5D1','#FFD6E0','#A3F7BF','#F7E1A0'];
    for (let i=0; i<110; i++) {
        confs.push({
            x: Math.random()*canvas.width,
            y: Math.random()*-canvas.height,
            d: Math.random()*6+4,
            color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
            tilt: Math.random()*10-10,
            tiltAngleIncremental: Math.random()*0.07+0.05,
            tiltAngle: 0
        });
    }
    function drawConfetti() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let i=0; i<confs.length; i++){
            let c=confs[i];
            ctx.beginPath();
            ctx.lineWidth = c.d;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.d/3, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.d/3);
            ctx.stroke();
        }
        update();
    }
    function update() {
        for(let i=0; i<confs.length; i++){
            let c = confs[i];
            c.y += (Math.cos(c.d) + 3 + c.d/2)/2;
            c.x += Math.sin(0.02*c.d);
            c.tiltAngle += c.tiltAngleIncremental;
            c.tilt = Math.sin(c.tiltAngle) * 18;
            if (c.y > canvas.height) {
                c.x = Math.random()*canvas.width;
                c.y = -20;
                c.tilt = Math.random()*10-10;
            }
        }
    }
    let frame = 0;
    function animateConfetti() {
        drawConfetti();
        frame++;
        if (frame < 200) requestAnimationFrame(animateConfetti);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    animateConfetti();
}

// STAGE CONTROL
function showStage(id) {
    $('.stage').removeClass('active');
    $('#' + id).addClass('active');
}

$(document).ready(function() {
    // 1. Start Celebration
    $('#btn-start').click(function() {
        showStage('stage-lights');
        document.getElementById('birthday-audio').currentTime = 0;
        document.getElementById('birthday-audio').play();
    });

    // 2. Turn On Lights
    $('#btn-lights').click(function() {
        $('#stage-lights').addClass('lights-on');
        setTimeout(function() {
            showStage('stage-banner');
            setTimeout(function() {
                $('#code-banner').fadeIn(600, function() {
                    launchBalloons();
                    setTimeout(function() {
                        $('#btn-cake').fadeIn(500);
                    }, 700);
                });
            }, 700);
        }, 1500);
    });

    // 3. Special Cake
    $('#btn-cake').click(function() {
        showStage('stage-cake');
        setTimeout(function() {
            $('#special-cake').fadeIn(700);
        }, 400);
    });

    // 4. Click on cake to show message
    $('.cake-wrap').click(function() {
        showStage('stage-message');
        confettiBurst();
    });

    // Confetti resize
    $(window).resize(function(){
        const canvas = document.getElementById('confetti');
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});