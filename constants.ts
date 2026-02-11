export const APP_NAME = "OHMYCOMPANY";
export const ADMIN_EMAIL = "admin@gmail.com";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: '입금 확인 중',
  paid: '결제 완료',
  shipping: '배송 준비 중', // Changed to fit event context better
  delivered: '발송 완료',
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
  description: `**<YG와 JYP의 책걸상> 토크콘서트 2026**

일시 : 2026년 3월 21일 (토) 오후 2시 ~ 5시
장소 : 마음폴짝홀 (서울 마포구 잔다리로3안길 20) 
출연 : 강양구(YG), 박재영(JYP) 
게스트 : 이다, 김새섬

열혈 애청자들이 제작비를 마련해 주는 유일한 책 팟캐스트, 
이제 10년차를 맞이한 국내 최장수 책 팟캐스트,
책 이야기 맛집, ‘책걸상’이 여섯 번째 오프라인 행사를 개최합니다.

과학전문기자 강양구(YG)와
의사 출신 저널리스트 박재영(JYP),
두 아재가 게스트와 함께 풀어놓는, 
‘책’에 관한 ‘걸’쭉하고 ‘상’큼한 이야기. 
방송에서 못다 한 이야기(그런 게 있다면)를 나누는 시간. 
(그리고 뒤풀이)

이번 토크콘서트는 YG & JYP 외에
이다 작가와 김새섬 그믐 대표의 미니 특강도 마련됩니다. 
책과 책걸상을 사랑하는 분들의 많은 성원을 부탁드립니다.

---

**프로그램**

13:30 등록
14:00 1부 YG & JYP 토크
14:50 2부 이다 미니 특강 “일상을 그림으로 남기는 방법”
15:20 Intermission
15:40 3부 김새섬 미니 특강 “책걸상과 나”
16:10 4부 청중과의 대화
17:20 Closing

* 뒤풀이 (사전 예약자에 한함, 유료): 18:00 ~ 21:00
* 기념품: YG와 JYP의 책걸상 10년 기념 空책

---

**프로젝트 목표**
책걸상 토크콘서트는 책을 사랑하는 사람들이 모여 깊이 있는 대화를 나누고, 현역 작가와의 만남을 통해 독서의 지평을 넓히는 것을 목표로 합니다.

**오시는 길**
마음폴짝홀 위치 : 서울 마포구 잔다리로3안길 20
합정역 3번 출구에서 도보 6분
* 주차 지원 없습니다. 대중교통을 이용해 주십시오.

**안내사항**
* 책걸상 시즌8 크라우드 펀딩에서 입장권 포함 선물을 후원하셨던 분들은 무료입니다. (개별 연락 예정)
* 뒤풀이 메뉴는 삼겹살입니다.
* 유료 주차 관련 정보가 필요하신 분은 개별 연락 주시기 바랍니다.

문의 : 02-2646-0852 / radio@docdocdoc.co.kr`,
  refundPolicy: `**리워드 배송 안내**
· 토크콘서트 입장권 및 기념품은 현장에서 배부 예정입니다. 원활한 입장을 위해 후원번호 또는 닉네임(이름) 중 하나를 준비해주시면 감사하겠습니다.

**환불 및 교환정책**
펀딩 종료 후에는 즉시 제작 및 실행에 착수하는 프로젝트 특성상 단순 변심에 의한 후원금 환불이 불가능합니다.
· 예상 전달일로부터 30일 이상 선물 전달이 이뤄지지 않을 경우, 환불을 원하시는 분들께는 수수료를 포함한 후원금을 환불해 드립니다.
· 행사 참가권은 타인에게 양도가 가능합니다.`,
  images: [
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop", // Talk concert vibe
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop", // Audience
    "https://images.unsplash.com/photo-1497015289639-54688650d173?q=80&w=1000&auto=format&fit=crop", // Book/Notes
  ],
  rewards: [
    {
      id: 'reward_A',
      price: 60000,
      title: '60,000원+',
      description: '토크콘서트 입장권 + 기념품',
      remaining: 80,
      items: ['입장권', '기념품(공책)']
    },
    {
      id: 'reward_B',
      price: 110000,
      title: '110,000원+',
      description: '토크콘서트 입장권 + 기념품 + 뒤풀이',
      remaining: 80,
      items: ['입장권', '기념품(공책)', '뒤풀이 참가권']
    },
    {
      id: 'reward_C',
      price: 50000,
      title: '50,000원+',
      description: '뒤풀이 + 기념품 (시즌 8 펀딩 토크콘서트 입장권 후원자용)',
      remaining: 40,
      items: ['뒤풀이 참가권', '기념품(공책)']
    }
  ]
};