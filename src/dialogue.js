// dialogue.js

const dialogues = {
    Click1: [
        { text: "이 몸이 바로~ 사장님이시다!", expression: "laugh", flip: false},
        { text: "전당포를 운영하고 있지.", expression: "smile", flip: false},
        { text: "잘 부탁해~.", expression: "glad", flip: false}
    ],
    Click2: [
        { text: "♬~", expression: "smile", flip: false}
    ],
    Click3: [
        { text: "♬~♪", expression: "smile", flip: false},
        { text: "♪~~♬♩♭~♬", expression: "smile", flip: false},
        { text: "흠~언제 오시려나~♩", expression: "laugh", flip: false}
    ],
    Click4: [
        { text: "어쩌다 전당포를 하게 됐냐고?", expression: "greet", flip: false},
        { text: "음... 당연히 돈이 궁해서였지.", expression: "shame", flip: false},
        { text: "이거 하기 전엔 구걸도 해봤다니까.", expression: "hate", flip: false},
        { text: "다 지난 일이지만.", expression: "laugh", flip: false}
    ],
    Click5: [
        { text: "전당포를 하다보면 가끔 손님이 돌아오지 않는 경우가 있어.", expression: "hate", flip: false},
        { text: "그럴 땐 경매에 팔아버리면 돼.", expression: "smile", flip: false},
        { text: "찝찝하지만 계약은 계약이니까.", expression: "shame", flip: false},
        { text: "우리도 돈은 벌어야지.", expression: "anxious", flip: false}
    ],
    Click6: [
        { text: "손님은 또 언제 오시려나.", expression: "shame", flip: false},
        { text: "매번 재밌는 물건이 들어와.", expression: "smile", flip: false},
        { text: "팔기 아까울 정도라니까.", expression: "wink", flip: false},
    ],
    Click7: [
        { text: "매입가를 너무 낮게 잡으면 이자에서 손해를 보고", expression: "shame", flip: false},
        { text: "너무 높게 잡으면 경매에서 손해를 봐.", expression: "shame", flip: false},
        { text: "그래서 이 손님이 정말 갚으러 올지를 잘 판단해야 해.", expression: "hate", flip: false},
        { text: "줄타기가 어렵지?", expression: "anxious", flip: false}
    ],
    Click8: [
        { text: "저주인형 같은 걸 맡기는 사람도 있어!", expression: "laugh", flip: false},
        { text: "속으로 '진짜냐?', '뭐지 저 사람?' 이라 생각한다고!", expression: "laugh", flip: false},
        { text: "웃긴건 그런 물건도 경매에 내놓으면 팔린다?", expression: "laugh", flip: false},
        { text: "취향 참 다양해~.", expression: "shame", flip: false}
    ],
    Click9: [
        { text: "전당포를 폐기물 처리장처럼 쓰려는 진상도 있어.", expression: "shame", flip: false},
        { text: "다시 찾아올 생각 없이 물건 던지고 돈내놔! 하는 사람들이야.", expression: "greet", flip: false},
        { text: "본래 가치보다 높게 부르기 때문에, 손해보는 경우가 많아.", expression: "hate", flip: false},
        { text: "잘 판단해야해?", expression: "anxious", flip: false}
    ]
};

function getDialogue(eventName) {
    return dialogues[eventName] || [];
}
