export const APP_NAME = "OHMYCOMPANY";
export const ADMIN_EMAIL = "rlagkrrbs5860@gmail.com";

// Bank Account Information for Transfer
export const BANK_INFO = {
  bankName: "신한은행",
  accountNumber: "110-123-456789",
  holder: "주식회사 청년의사"
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: '입금 확인 중',
  paid: '결제 완료',
  shipping: '발송 준비',
  delivered: '발송 완료',
};

// GitHub Raw Assets Base URL (Based on Firebase Project ID suggestion)
// NOTE: If images do not appear, please verify the repository name "jyp-yg-fund" and branch "main".
const ASSET_BASE_URL = "https://raw.githubusercontent.com/Mackgyun/JYP-YG-/main/assets/";

export const PROJECT_IMAGES: Record<string, string> = {
  logo: `${ASSET_BASE_URL}logo.jpg`, // 깔끔하게 연결됨
  fourGrid: `${ASSET_BASE_URL}4grid.png`,
  sampleBook: `${ASSET_BASE_URL}samplebook.jpg`,
  ticket: `${ASSET_BASE_URL}ticket.jpg`,
  party: `${ASSET_BASE_URL}party.jpg`,
  yg: `${ASSET_BASE_URL}yg.png`,
  jyp: `${ASSET_BASE_URL}jyp.jpg`,
  ida: `${ASSET_BASE_URL}ida.jpg`,
  kim: `${ASSET_BASE_URL}kim.jpg`,
};

export const MOCK_PRODUCT = {
  id: 'proj_bookclub_2026',
  title: '〈YG와JYP의 책걸상〉 2026 토크콘서트',
  category: '문화·출판',
  creator: '(주)청년의사',
  goalAmount: 1000000,
  currentAmount: 0,
  supporterCount: 0,
  startDate: '2026-02-12',
  endDate: '2026-03-05',
  description: `### <YG와 JYP의 책걸상> 토크콘서트 2026

IMAGE:logo

**일시** : 2026년 3월 21일 (토) 오후 2시 ~ 5시
**장소** : 마음폴짝홀 (서울 마포구 잔다리로3안길 20) 
**출연** : 강양구(YG), 박재영(JYP) 
**게스트** : 이다, 김새섬
**입장료** : 60,000원

열혈 애청자들이 제작비를 마련해 주는 유일한 책 팟캐스트, 이제 10년차를 맞이한 국내 최장수 책 팟캐스트, 책 이야기 맛집, ‘책걸상’이 여섯 번째 오프라인 행사를 개최합니다.

과학전문기자 강양구(YG)와 의사 출신 저널리스트 박재영(JYP), 두 아재가 게스트와 함께 풀어놓는, ‘책’에 관한 ‘걸’쭉하고 ‘상’큼한 이야기. 방송에서 못다 한 이야기(그런 게 있다면)를 나누는 시간. (그리고 뒤풀이)

이번 토크콘서트는 YG & JYP 외에 이다 작가와 김새섬 그믐 대표의 미니 특강도 마련됩니다. 책과 책걸상을 사랑하는 분들의 많은 성원을 부탁드립니다.

---

### 프로그램

**13:30** 등록
**14:00** 1부 YG & JYP 토크
**14:50** 2부 이다 미니 특강 “일상을 그림으로 남기는 방법”
**15:20** Intermission
**15:40** 3부 김새섬 미니 특강 “책걸상과 나”
**16:10** 4부 청중과의 대화
**17:20** Closing

---

### 토크콘서트 기념 선물
**YG와 JYP의 책걸상 10년 기념 空책**

IMAGE:sampleBook
CAPTION: *현재 제작중이며 샘플이미지입니다. 제작과정에서 일부 디자인이 변경될 수 있습니다.

* 152*225mm 사이즈의 300쪽짜리 무지노트로 토크콘서트를 위한 특별제작

---

### 토크 콘서트 입장권

IMAGE:ticket
CAPTION: ※실물은 없으며 예시 이미지입니다. 모두 현장 수령입니다.

---

### 뒤풀이 (사전 예약자에 한함)
**시간**: 18:00 ~ 21:00
**메뉴**: 삼겹살

IMAGE:party
CAPTION: *이미지는 연출된 컷입니다.

---

### 오시는 길 & 안내사항

**마음폴짝홀** : 서울 마포구 잔다리로3안길 20
* 합정역 3번 출구에서 도보 6분. 지도 검색 후 잘 찾아오세요.
* 주차 지원 없습니다. 대중교통을 이용해 주십시오. 유료 주차 관련 정보가 필요하신 분은 개별 연락 주시기 바랍니다.
* 책걸상 시즌8 크라우드 펀딩에서 입장권 포함 선물을 후원하셨던 분들은 무료입니다. (개별 연락 예정)

**프로젝트 목표**
책걸상 토크콘서트는 책을 사랑하는 사람들이 모여 깊이 있는 대화를 나누고, 현역 작가와의 만남을 통해 독서의 지평을 넓히는 것을 목표로 합니다.

**문의** : 02-2646-0852 / radio@docdocdoc.co.kr

---

### 프로젝트 팀 소개

**YG(강양구)**
IMAGE_S:yg
2003년부터 지금까지 ‘질문하는 기자’로 살고 있다. 2005년 모두가 황우석 박사의 줄기세포 연구에 열광할 때, ‘윤리’와 ‘진실’을 따져 물었다. 그의 연구가 모두 거짓이라는 사실을 폭로하는 기사를 최초로 보도해서 국내뿐만 아니라 전 세계적으로 주목을 받았다. 이 보도로 앰네스티언론상(2005), 녹색언론인상(2006) 등을 수상했다. <세 바퀴로 가는 과학자전거> 등의 책을 펴냈다.

**JYP(박재영)**
IMAGE_S:jyp
의사 출신의 저널리스트이자 작가. 의료전문신문 <청년의사> 편집주간. <개념의료>, <아무튼, 맛집> 등 11권의 책을 썼고, <차가운 의학, 따뜻한 의사> 등 8권의 책을 번역했다. 국내 최장수 책 팟캐스트 <YG와 JYP의 책걸상>의 공동 진행자. 연세의대를 졸업했고, 같은 대학에서 의료법윤리학 전공으로 박사 학위를 받았다.

**이다**
IMAGE_S:ida
작가, 일러스트레이터. 포항에서 태어나 청소년기 내내 쉬지 않고 다이어리를 썼다. 지은 책으로 <이다의 허접질>, <이다의 자연관찰일기> 등이 있으며, <내 손으로, 치앙마이> 등 여행기를 꾸준히 펴내는 중이다. 그림으로 할 수 있는 것을 모두 해 보는 것이 소망이다.

**김새섬**
IMAGE_S:kim
2022년 9월 ‘느슨한 연대’를 지향하는 온라인 북클럽 플랫폼 ‘그믐’을 설립했다. 무료 서평집 『한국 소설이 좋아서』를 기획·출간했으며, 다양한 기관과 협업하여 깊이 있는 독서 프로그램을 선보였다. 현재는 교보문고 북멘토이자 톱클래스 매거진 필자로 활동 중이다.

---

### 안내사항

* **식품 상품정보고시 예)**
  1-1. 제품명: 상세페이지 참조
  1-2. 식품의 유형: 상세페이지 참조
  
* **체크리워드 배송 지연 시**
  리워드 발송이 늦어지게 된다면 따로 안내해 드릴 예정이며 혹시나 문자를 받지 못하신 경우, 문의처로 연락해 주시기 바랍니다.`,
  refundPolicy: `**리워드 배송 안내**
· 토크콘서트 입장권 및 기념품은 현장에서 배부 예정입니다. 원활한 입장을 위해 후원번호 또는 닉네임(이름) 중 하나를 준비해주시면 감사하겠습니다.

**환불 및 교환정책**
펀딩 종료 후에는 즉시 제작 및 실행에 착수하는 프로젝트 특성상 단순 변심에 의한 후원금 환불이 불가능합니다.
· 예상 전달일로부터 30일 이상 선물 전달이 이뤄지지 않을 경우, 환불을 원하시는 분들께는 수수료를 포함한 후원금을 환불해 드립니다.
· 행사 참가권은 타인에게 양도가 가능합니다.`,
  images: [],
  rewards: [
    {
      id: 'reward_A',
      price: 60000,
      title: 'A. 입장권 + 기념품',
      description: '입금자명을 닉네임으로 변경하여 결제해주세요. (현장수령)',
      remaining: 80,
      items: ['토크콘서트 입장권', '기념품(공책)']
    },
    {
      id: 'reward_B',
      price: 110000,
      title: 'B. 입장권 + 기념품 + 뒤풀이',
      description: '입금자명을 닉네임으로 변경하여 결제해주세요. (현장수령)',
      remaining: 80,
      items: ['토크콘서트 입장권', '기념품(공책)', '뒤풀이 참가권']
    },
    {
      id: 'reward_C',
      price: 50000,
      title: 'C. 기념품 + 뒤풀이',
      description: '시즌8 펀딩으로 입장권 구매자에 한함. 입금자명을 닉네임으로 변경하여 결제해주세요. (현장수령)',
      remaining: 40,
      items: ['뒤풀이 참가권', '기념품(공책)']
    }
  ]
};