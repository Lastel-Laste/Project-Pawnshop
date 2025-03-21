// inventory.js

// 전역 변수 선언
let isAnimating = false; // 애니메이션 진행 여부
let selectedSlotIndex = null; // 현재 선택된 슬롯 인덱스

// 1. 인벤토리 슬롯 배열 (32칸, 초기엔 모두 null)
let inventorySlots = Array(32).fill(null);

// 2. UI와 데이터 동기화 함수
function updateInventoryUI() {
  const gridOverlay = document.getElementById("grid-overlay");
  // gridOverlay에 32개의 슬롯(div.item-box)이 없으면 생성
  if (gridOverlay.children.length !== 32) {
    gridOverlay.innerHTML = ""; // 초기화
    for (let i = 0; i < 32; i++) {
      const cell = document.createElement("div");
      cell.classList.add("item-box");
      // 각 슬롯에 데이터 속성으로 인덱스 부여
      cell.dataset.slotIndex = i;
      gridOverlay.appendChild(cell);
    }
  }
  
  const slotElements = gridOverlay.children;
  
  Array.from(slotElements).forEach((slotEl, index) => {
    // 기존 내용 제거 및 하이라이트 초기화
    slotEl.innerHTML = "";
    slotEl.classList.remove("highlight");

    const item = inventorySlots[index];
    if (item) {
      // 아이템 이미지 생성
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name;
      img.classList.add("inventory-item");
      
      // 이벤트: 아이템 클릭 시 선택/스왑 처리 및 아이템 패널 활성화
      img.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isAnimating) return;
        const currentSlot = parseInt(slotEl.dataset.slotIndex, 10);
        
        // 최초 선택 상태일 때만 아이템 패널에 상세 정보 표시
        if (selectedSlotIndex === null) {
          showItemDetails(item);
          selectedSlotIndex = currentSlot;
          slotEl.classList.add("highlight");
        } else if (selectedSlotIndex === currentSlot) {
          // 이미 선택된 슬롯을 재클릭하면 선택 해제 및 패널 초기화
          selectedSlotIndex = null;
          slotEl.classList.remove("highlight");
          clearItemPanel();
        } else {
          // 두 번째 클릭(스왑 대상)일 때는 패널 정보 갱신하지 않음
          animateSwap(selectedSlotIndex, currentSlot, () => {
            swapItems(selectedSlotIndex, currentSlot);
            selectedSlotIndex = null;
            clearItemPanel();
          });
        }
      });
      slotEl.appendChild(img);
    }
    // 빈 슬롯 클릭 시 (아이템 이동용)
    slotEl.addEventListener("click", () => {
      if (isAnimating) return;
      const targetSlot = parseInt(slotEl.dataset.slotIndex, 10);
      if (inventorySlots[targetSlot] === null && selectedSlotIndex !== null) {
        animateItemMove(selectedSlotIndex, targetSlot, () => {
          inventorySlots[targetSlot] = inventorySlots[selectedSlotIndex];
          inventorySlots[selectedSlotIndex] = null;
          selectedSlotIndex = null;
          updateInventoryUI();
          clearItemPanel();
        });
      }
    });
  });
}

// 3. 슬롯에 아이템 배치 함수 (초기 데이터 배치에 사용)
function placeItemInSlot(slotIndex, item) {
  if (slotIndex < 0 || slotIndex >= inventorySlots.length) {
    console.error("유효하지 않은 슬롯 인덱스입니다.");
    return;
  }
  if (inventorySlots[slotIndex] !== null) {
    console.warn("해당 슬롯은 이미 채워져 있습니다.");
    return;
  }
  inventorySlots[slotIndex] = item;
  updateInventoryUI();
}

// 4. 슬롯 간 아이템 교환 함수 (데이터 스왑)
function swapItems(index1, index2) {
  if (
    index1 < 0 || index1 >= inventorySlots.length ||
    index2 < 0 || index2 >= inventorySlots.length
  ) {
    console.error("유효하지 않은 슬롯 인덱스입니다.");
    return;
  }
  const temp = inventorySlots[index1];
  inventorySlots[index1] = inventorySlots[index2];
  inventorySlots[index2] = temp;
  updateInventoryUI();
}

// 5. 애니메이션 함수: 아이템 이동 (단일 이동)
function animateItemMove(fromSlot, toSlot, callback) {
  isAnimating = true;
  const gridOverlay = document.getElementById("grid-overlay");
  const fromCell = gridOverlay.querySelector(`[data-slot-index='${fromSlot}']`);
  const toCell = gridOverlay.querySelector(`[data-slot-index='${toSlot}']`);
  
  if (!fromCell || !toCell) {
    console.error("셀 요소를 찾을 수 없습니다.");
    isAnimating = false;
    return;
  }
  
  const item = fromCell.querySelector("img");
  if (!item) {
    isAnimating = false;
    return;
  }
  
  item.style.visibility = "hidden";
  const rectFrom = item.getBoundingClientRect();
  const clone = item.cloneNode(true);
  const computedStyle = window.getComputedStyle(item);
  clone.style.width = computedStyle.width;
  clone.style.height = computedStyle.height;
  clone.style.transform = "none";
  clone.style.position = "fixed";
  clone.style.left = rectFrom.left + window.scrollX + "px";
  clone.style.top = rectFrom.top + window.scrollY + "px";
  clone.style.margin = 0;
  clone.style.transition = "transform 0.2s ease";
  clone.style.zIndex = 1000;
  clone.style.visibility = "visible";
  document.body.appendChild(clone);
  
  const targetRect = toCell.getBoundingClientRect();
  const finalX = targetRect.left + window.scrollX + targetRect.width / 2 - parseFloat(computedStyle.width) / 2;
  const finalY = targetRect.top + window.scrollY + targetRect.height - parseFloat(computedStyle.height);
  const deltaX = finalX - (rectFrom.left + window.scrollX);
  const deltaY = finalY - (rectFrom.top + window.scrollY);
  
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });
  
  clone.addEventListener("transitionend", () => {
    document.body.removeChild(clone);
    isAnimating = false;
    callback();
  }, { once: true });
}

// 6. 애니메이션 함수: 아이템 교환 (스왑)
function animateSwap(slotIndex1, slotIndex2, callback) {
  isAnimating = true;
  const gridOverlay = document.getElementById("grid-overlay");
  const cell1 = gridOverlay.querySelector(`[data-slot-index='${slotIndex1}']`);
  const cell2 = gridOverlay.querySelector(`[data-slot-index='${slotIndex2}']`);
  
  if (!cell1 || !cell2) {
    console.error("셀 요소를 찾을 수 없습니다.");
    isAnimating = false;
    return;
  }
  
  const item1 = cell1.querySelector("img");
  const item2 = cell2.querySelector("img");
  
  if (!item1 || !item2) {
    isAnimating = false;
    return;
  }
  
  item1.style.visibility = "hidden";
  item2.style.visibility = "hidden";
  
  const rect1 = item1.getBoundingClientRect();
  const rect2 = item2.getBoundingClientRect();
  
  const style1 = window.getComputedStyle(item1);
  const style2 = window.getComputedStyle(item2);
  
  const clone1 = item1.cloneNode(true);
  const clone2 = item2.cloneNode(true);
  
  clone1.style.width = style1.width;
  clone1.style.height = style1.height;
  clone1.style.transform = "none";
  clone1.style.position = "fixed";
  clone1.style.left = rect1.left + window.scrollX + "px";
  clone1.style.top = rect1.top + window.scrollY + "px";
  clone1.style.margin = 0;
  clone1.style.transition = "transform 0.2s ease";
  clone1.style.zIndex = 1000;
  clone1.style.visibility = "visible";
  
  clone2.style.width = style2.width;
  clone2.style.height = style2.height;
  clone2.style.transform = "none";
  clone2.style.position = "fixed";
  clone2.style.left = rect2.left + window.scrollX + "px";
  clone2.style.top = rect2.top + window.scrollY + "px";
  clone2.style.margin = 0;
  clone2.style.transition = "transform 0.2s ease";
  clone2.style.zIndex = 1000;
  clone2.style.visibility = "visible";
  
  document.body.appendChild(clone1);
  document.body.appendChild(clone2);
  
  const cell1Rect = cell1.getBoundingClientRect();
  const cell2Rect = cell2.getBoundingClientRect();
  
  const finalX1 = cell2Rect.left + window.scrollX + cell2Rect.width / 2 - parseFloat(style1.width) / 2;
  const finalY1 = cell2Rect.top + window.scrollY + cell2Rect.height - parseFloat(style1.height);
  const finalX2 = cell1Rect.left + window.scrollX + cell1Rect.width / 2 - parseFloat(style2.width) / 2;
  const finalY2 = cell1Rect.top + window.scrollY + cell1Rect.height - parseFloat(style2.height);
  
  const deltaX1 = finalX1 - (rect1.left + window.scrollX);
  const deltaY1 = finalY1 - (rect1.top + window.scrollY);
  const deltaX2 = finalX2 - (rect2.left + window.scrollX);
  const deltaY2 = finalY2 - (rect2.top + window.scrollY);
  
  requestAnimationFrame(() => {
    clone1.style.transform = `translate(${deltaX1}px, ${deltaY1}px)`;
    clone2.style.transform = `translate(${deltaX2}px, ${deltaY2}px)`;
  });
  
  let transitionsCompleted = 0;
  function onTransitionEnd() {
    transitionsCompleted++;
    if (transitionsCompleted === 2) {
      document.body.removeChild(clone1);
      document.body.removeChild(clone2);
      isAnimating = false;
      callback();
    }
  }
  
  clone1.addEventListener("transitionend", onTransitionEnd, { once: true });
  clone2.addEventListener("transitionend", onTransitionEnd, { once: true });
}

// 7. 초기 설정: DOMContentLoaded 이벤트에서 인벤토리 셋업 및 샘플 아이템 배치
document.addEventListener("DOMContentLoaded", function () {
  updateInventoryUI();
  // 예시: 첫 3칸에 샘플 아이템 배치
  placeItemInSlot(0, sampleItems[0]);
  placeItemInSlot(1, sampleItems[1]);
  placeItemInSlot(2, sampleItems[2]);
  
  // 외부 클릭 시 선택 해제 및 아이템 패널 초기화
  document.addEventListener("click", function (event) {
    if (isAnimating) return;
    if (!event.target.closest(".item-box")) {
      selectedSlotIndex = null;
      updateInventoryUI();
      clearItemPanel();
    }
  });
});
