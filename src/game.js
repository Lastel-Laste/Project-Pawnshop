// game.js

function animateCharacterMovement() {
    const container = document.getElementById("character-container");
    const character = document.getElementById("character");
    let currentX = 0;
    let targetX = 0;
    let startTime = null;
    let duration = 0;
    const bounceAmplitude = 5; // 바운스 최대 이동 (px)
    const speed = 200; // 일정한 이동 속도 (px/초)
    const bounceFrequency = 2; // 초당 바운스 횟수
    let movementPaused = false;
    let animationFrameId = null;

    // 캐릭터 초기 상태 설정 (idle 표정)
    setCharacterExpression("idle", false);

    // container의 현재 translateX 값을 읽어 반환하는 함수
    function getCurrentX() {
        const computedStyle = window.getComputedStyle(container);
        const transform = computedStyle.transform;
        if (transform && transform !== "none") {
            const matrixValues = transform.match(/matrix\((.+)\)/);
            if (matrixValues) {
                const parts = matrixValues[1].split(", ");
                return parseFloat(parts[4]);
            }
        }
        return 0;
    }

    function updateTarget() {
        const containerRect = container.getBoundingClientRect();
        let maxX;
        if (window.innerWidth > 960) {
            maxX = window.innerWidth - containerRect.width;
        } else {
            const wrapper = document.getElementById("wrapper");
            const wrapperRect = wrapper.getBoundingClientRect();
            maxX = wrapperRect.width - containerRect.width;
        }
        targetX = Math.random() * maxX;
        const distance = Math.abs(targetX - currentX);
        duration = Math.max((distance / speed) * 1000, 500); // 최소 500ms 보장
        startTime = null;
    
        // 대사 이벤트 중이 아닐 때만 flip 상태 업데이트
        if (!window.isDialogueActive) {
            if (targetX < currentX) {
                character.classList.add("flipped");
            } else {
                character.classList.remove("flipped");
            }
        }
    }

    updateTarget();

    // easing 함수 (easeInOutQuad)
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
        if (movementPaused) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / duration, 1);
        progress = easeInOutQuad(progress);

        const newX = currentX + (targetX - currentX) * progress;
        // 바운스 효과: 이동 시간에 따라 전체 바운스 횟수가 결정됨.
        const bounceCycles = Math.round((duration / 1000) * bounceFrequency);
        const bounce = bounceAmplitude * Math.sin(progress * bounceCycles * 2 * Math.PI);

        container.style.transform = `translateX(${newX}px) translateY(${bounce}px)`;

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
        } else {
            currentX = targetX;
            setTimeout(() => {
                updateTarget();
                animationFrameId = requestAnimationFrame(step);
            }, 1000 + Math.random() * 1000);
        }
    }

    animationFrameId = requestAnimationFrame(step);

    return {
        pause: function () {
            movementPaused = true;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            // 현재 container의 transform 값에서 currentX 업데이트
            currentX = getCurrentX();
        },
        resume: function () {
            if (movementPaused) {
                movementPaused = false;
                // 기존 목표 삭제: 새로운 목표 설정
                updateTarget();
                startTime = null;
                animationFrameId = requestAnimationFrame(step);
            }
        }
    };
}

// 타이핑 효과 함수: letterDelay(ms)마다 한 글자씩 출력. 
// 사용자가 타이핑 중 클릭하면 전체 텍스트를 즉시 출력하고, 
// 타이핑 효과가 완료된 상태에서 클릭하면 promise를 resolve하여 다음 문장으로 넘어갑니다.
function typeDialogueText(text, letterDelay = 50) {
    const dialogueBar = document.getElementById("dialogue-bar");
    const overlay = document.getElementById("dialogue-click-overlay");

    overlay.classList.remove("hidden");

    return new Promise(resolve => {
        let currentIndex = 0;
        let typingFinished = false;

        function onClick() {
            if (!typingFinished) {
                dialogueBar.innerText = text;
                typingFinished = true;
            } else {
                overlay.removeEventListener("click", onClick);
                overlay.classList.add("hidden");
                resolve();
            }
        }

        overlay.addEventListener("click", onClick);

        function typeNext() {
            if (typingFinished) return;
            if (currentIndex < text.length) {
                dialogueBar.innerText = text.substring(0, currentIndex + 1);
                currentIndex++;
                setTimeout(typeNext, letterDelay);
            } else {
                typingFinished = true;
            }
        }

        typeNext();
    });
}


// 전역 이동 컨트롤러 생성
const movementController = animateCharacterMovement();

// 대사(대화) 기능: dialogue.js의 스크립트를 활용
// 대화 중에는 이동을 정지하고, 대사가 끝난 후 새롭게 이동을 시작함.
async function triggerDialogue(eventName) {
    if (window.isDialogueActive) return;
    window.isDialogueActive = true;

    const character = document.getElementById("character");
    const savedFlip = character.classList.contains("flipped");

    // 이동 정지 및 현재 위치 업데이트
    movementController.pause();

    // 대사 바 보이기
    const dialogueBar = document.getElementById("dialogue-bar");
    dialogueBar.classList.remove("hidden");

    // dialogue.js에 정의된 대사 스크립트를 불러옴
    const lines = getDialogue(eventName);
    for (const line of lines) {
        // 각 문장에 맞춰 캐릭터 표정과 flip 적용
        setCharacterExpression(line.expression, line.flip);
        // 타이핑 효과로 문장을 출력하고, 타이핑이 완료된 후 사용자가 클릭하면 넘어감
        await typeDialogueText(line.text, 50);
    }

    // 대사 바 숨기기
    dialogueBar.classList.add("hidden");
    window.isDialogueActive = false;

    // 대사가 끝난 후, 이동 재개 전에 기존 flip 상태 복원 및 이동 목표 초기화
    setCharacterExpression("idle", savedFlip);
    movementController.resume();
}

let hasClickedOnce = false;
const remainingEvents = [
    "Click2", "Click3", "Click4",
    "Click5", "Click6", "Click7",
    "Click8", "Click9"
];

document.getElementById("character").addEventListener("click", function () {
    if (!window.isDialogueActive) {
        const eventName = !hasClickedOnce
            ? "Click1"
            : remainingEvents[Math.floor(Math.random() * remainingEvents.length)];
        
        hasClickedOnce = true;
        triggerDialogue(eventName);
    }
});


function blinkEffect() {
    const skipExpressions = ["smile", "shame", "glad", "laugh", "hate"];
    // 현재 표정이 깜빡임이 필요없는 표정이면 아무 것도 하지 않음.
    if (skipExpressions.includes(window.currentExpression)) {
        return;
    }
    // 예: 1% 확률로 blink 효과 발생
    if (Math.random() < 0.01) {
        const prevExpression = window.currentExpression || "idle";
        if (prevExpression == "greet") {
            setCharacterExpression("glad", false);
        }
        if (prevExpression == "anxious") {
            setCharacterExpression("shame", false);
        }
        else setCharacterExpression("smile", false);
        setTimeout(() => {
            setCharacterExpression(prevExpression, false);
        }, 100);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setInterval(blinkEffect, 100);
});
