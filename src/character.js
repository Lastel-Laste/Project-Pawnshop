function setupCharacterHoverEffect() {
    const character = document.getElementById("character");
    const counter = document.getElementById("counter"); // 카운터 요소
    const gridOverlay = document.getElementById("grid-overlay"); // 아이템 오버레이
    const normalOpacity = 1;
    const hoverOpacity = 0.2;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function setupCanvas() {
        canvas.width = character.naturalWidth;
        canvas.height = character.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(character, 0, 0);
    }

    if (character.complete) {
        setupCanvas();
    } else {
        character.addEventListener("load", setupCanvas);
    }

    function isCharacterOverItemOverlay() {
        const charRect = character.getBoundingClientRect();
        const overlayRect = gridOverlay.getBoundingClientRect();

        // **캐릭터와 아이템 오버레이가 겹치는지 확인**
        return !(
            charRect.right < overlayRect.left ||
            charRect.left > overlayRect.right ||
            charRect.bottom < overlayRect.top ||
            charRect.top > overlayRect.bottom
        );
    }

    document.addEventListener("mousemove", function (event) {
        if (counter) {
            const counterRect = counter.getBoundingClientRect();
            if (
                event.clientX >= counterRect.left &&
                event.clientX <= counterRect.right &&
                event.clientY >= counterRect.top &&
                event.clientY <= counterRect.bottom
            ) {
                character.style.opacity = normalOpacity;
                return;
            }
        }

        const rect = character.getBoundingClientRect();
        if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom &&
            isCharacterOverItemOverlay() // 💡 캐릭터가 아이템 오버레이를 가릴 때만
        ) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const scaleX = character.naturalWidth / rect.width;
            const scaleY = character.naturalHeight / rect.height;
            const imgX = Math.floor(x * scaleX);
            const imgY = Math.floor(y * scaleY);

            try {
                const pixelData = ctx.getImageData(imgX, imgY, 1, 1).data;
                character.style.opacity = pixelData[3] === 0 ? normalOpacity : hoverOpacity;
            } catch (error) {
                console.error("getImageData 오류:", error);
                character.style.opacity = normalOpacity;
            }
        } else {
            character.style.opacity = normalOpacity;
        }
    });

    // **새로운 이미지가 적용될 때 Canvas 업데이트**
    character.addEventListener("load", setupCanvas);
}

function flipCharacter(isFlipped) {
    const characterImg = document.getElementById("character");
    if (isFlipped) {
        // 현재 flipped 상태를 반전시킵니다.
        characterImg.classList.toggle("flipped");
    }
}

function setCharacterExpression(expression, isFlipped = false) {
    const characterImg = document.getElementById("character");
  
    if (characterModels[expression]) {
        characterImg.src = characterModels[expression];
        flipCharacter(isFlipped); // 좌우 반전 적용
        // 현재 표정을 전역 변수에 저장
        window.currentExpression = expression;
    } else {
        console.warn(`표정 ${expression}을(를) 찾을 수 없습니다.`);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    setupCharacterHoverEffect();
});

