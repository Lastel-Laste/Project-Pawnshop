// item.js

// 1. 샘플 아이템 데이터 (필요에 따라 확장)
const sampleItems = [
    {
      id: 1,
      name: "The Devil in a Bottle",
      price: 666666,
      rarity: "SR",
      description: "병에 갇힌 하급악마.\n한 아이가 장난삼아 소환한 존재였으나\n퇴마사에 의해 봉인당했습니다.\n굳이 열어보고 싶진 않습니다.",
      img: "./images/items/1.png",
      comment: "살아있는 건 아니지...?"
    },
    {
      id: 2,
      name: "The Angel in a Bottle",
      price: 7777777,
      rarity: "SSR",
      description: "천사의 가호가 깃든 성수.\n먼 과거 성도회의 간부만이 취급할 수 있었습니다.",
      img: "./images/items/2.png",
      comment: "이 귀한 걸 전당포에"
    },
    {
      id: 3,
      name: "Angels and Demons",
      price: 844443,
      rarity: "SR",
      description: '악마를 담은 병에 천사가 담긴 성수를 섞어보자는\n먼 과거 성도회가 진행한 실험의 결과물입니다.\n결국 성수 하나를 버린 꼴이 되었지만요.\n"젠장, 하나 남은 성수였는데...!"',
      img: "./images/items/3.png",
      comment: "흔들어도 안 섞임."
    }
  ];
  
  // 2. 아이템 상세 정보를 아이템 패널에 표시하는 함수
  function showItemDetails(item) {
    const panel = document.getElementById("item-panel");
    const formattedPrice = item.price.toLocaleString() + "G";

    // 줄바꿈 적용 (\n → <br> 변환)
    const formattedDescription = item.description.replace(/\n/g, "<br>");
    const formattedComment = item.comment ? "사장님의 한줄평: <br>" + item.comment.replace(/\n/g, "<br>") : "아루네의 한줄평 없음.";

    // 글자 수 기준으로 CSS 클래스 적용
    const descriptionClass = item.description.length > 50 ? "small-text" : "";

    panel.innerHTML = `
        <div class="item-details">
            <div class="item-overlay item-image-overlay">
                <img src="${item.img}" alt="${item.name}" class="item-detail-img">
            </div>
            <div class="item-overlay item-name-overlay">${item.name}</div>
            <div class="item-overlay item-price-overlay">가격: ${formattedPrice}</div>
            <div class="item-overlay item-rarity-overlay">등급: ${item.rarity}</div>
            <div class="item-overlay item-description-overlay ${descriptionClass}">${formattedDescription}</div>
            <div class="item-overlay item-comment-overlay">${formattedComment}</div>
        </div>
    `;
}

  
  // 3. 아이템 패널을 초기화(내용 삭제)하는 함수
  function clearItemPanel() {
    const panel = document.getElementById("item-panel");
    panel.innerHTML = "";
  }
  