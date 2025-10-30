<template>
  <BoxContainer>
    <v-row no-gutters justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <div class="page-title">Moodimal Archive</div>
        <div class="page-subtitle">당신의 무디멀 여정을 돌아봐요</div>
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="mb-4 px-4">
      <v-text-field
        v-model="searchQuery"
        placeholder='태그를 검색해보세요'
        variant="outlined" rounded="pill" bg-color="#FFFFFF" base-color="#FF794C" color="#FF794C" item-color="#FF794C" 
        density="comfortable"
        hide-details
        class="search-input"
      >
        <template v-slot:append-inner>
          <v-icon color="#FF794C" size="24">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-row>

    <v-row no-gutters class="px-4">
      <v-col 
        v-for="(card, id) in filteredCards" 
        :key="id" 
        cols="6" 
        class="pa-2 | d-flex | flex-column | align-center"
      >
        <v-btn
          @click="filterByTag(card.title)"
          color="#FF794C"
          rounded="pill"
          height="24"
          class="date-btn | mb-1"
          elevation="0"
          :text="card.title"
        />
        <v-card 
          @click="handleCardClick(id)" 
          class="moodimal-card" 
          rounded="xl" 
          elevation="2"
        >
          <v-img
            :src="card.image" 
            alt="무디멀 카드"
            width="100%"
            aspect-ratio="0.745"
            cover
            class="card-image"
          ></v-img>
        </v-card>
        <div class="link-label | mb-4">
          {{ card.date }}
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="margin-32 | pl-14 | pr-14 | pt-2">
      <v-btn 
        @click="handleClickRestartBtn"
        color="#FF794C" 
        rounded="xl" 
        width="100%"
        class="text-btn"
      >
        처음으로
      </v-btn>
    </v-row>

    </BoxContainer>

  <v-dialog v-model="dialog.dialogActive" width="auto">
    <v-card class="pa-2 | pb-3" rounded="lg">
      <v-card-title class="text-title | pl-4 | pr-4 | pt-4">
        <v-row style="justify-content: start; align-items: center;">
          <v-col class="pt-0 | pb-0 | pl-4 | pr-1" cols="auto">
            <v-img
              src="@/assets/logo.png"
              height="24"
              width="24"
              class=""
            ></v-img>
          </v-col>
          <v-col class="pl-1" cols="auto">
            {{ dialog.title }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="text-subtitle | pl-4 | pr-4 | pt-2 | pb-3" v-html="dialog.text"></v-card-text>
      <template v-slot:actions>
          <v-row no-gutters justify="end">
              <v-btn color="#FF794C" width="25%" rounded="xl" variant="outlined" @click="dialog.dialogActive = false">닫기</v-btn>
              <v-btn v-if="dialog.okButton" color="#FF794C" width="25%" rounded="xl" variant="flat" class="ml-2" @click="dialog.okButton">확인</v-btn>
          </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import BoxContainer from '@/components/BoxContainer.vue';

// 이미지 11개 import
import card1 from '@/assets/card_1.png';
import card2 from '@/assets/card_2.png';
import card3 from '@/assets/card_3.png';
import card4 from '@/assets/card_4.png';
import card5 from '@/assets/card_5.png';
import card6 from '@/assets/card_6.png';
import card7 from '@/assets/card_7.png';
import card8 from '@/assets/card_8.png';
import card9 from '@/assets/card_9.png';
import card10 from '@/assets/card_10.png';
import card11 from '@/assets/card_11.png';

const emit = defineEmits(['restart-analyze']);

// 검색어
const searchQuery = ref('');

// 다이얼로그
const dialog = ref({
  title: '',
  text: '',
  dialogActive: false,
  okButton: null
});

// 카드 데이터
const cardData = {
  1: {
    title: '#예술가형',
    name: '우울한 고양이',
    description: '창밖을 바라보며 생각에 잠긴, 감수성 풍부한 고양이입니다.',
    date: '2025.10.28',
    image: card1
  },
  2: {
    title: '#활력형',
    name: '활기찬 펭귄',
    description: '넘치는 에너지로 뒤뚱뒤뚱, 어디든 신나게 달려가는 펭귄입니다.',
    date: '2025.10.27',
    image: card2
  },
  3: {
    title: '#차분형',
    name: '고독한 늑대',
    description: '무리에서 벗어나 홀로 달을 보며 사색을 즐기는 늑대입니다.',
    date: '2025.10.26',
    image: card3
  },
  4: {
    title: '#예술가형',
    name: '투명한 드래곤',
    description: '신비로운 비늘을 가진, 남들에게 쉽게 보이지 않는 독특한 드래곤입니다.',
    date: '2025.10.25',
    image: card4
  },
  5: {
    title: '#차분형',
    name: '따분한 나무늘보',
    description: '세상만사 여유롭게, 나른한 표정으로 하루를 보내는 나무늘보입니다.',
    date: '2025.10.24',
    image: card5
  },
  6: {
    title: '#차분형',
    name: '졸린 올빼미',
    description: '밤샘 비행으로 지쳤는지, 나뭇가지에서 꾸벅꾸벅 졸고 있습니다.',
    date: '2025.10.23',
    image: card6
  },
  7: {
    title: '#활력형',
    name: '궁금한 햄스터',
    description: '해바라기씨보다 세상에 궁금한 것이 더 많은 호기심쟁이입니다.',
    date: '2025.10.22',
    image: card7
  },
  8: {
    title: '#예술가형',
    name: '허전한 다람쥐',
    description: '도토리를 다 먹어버린 걸까요? 어딘가 허전함을 느끼고 있습니다.',
    date: '2025.10.21',
    image: card8
  },
  9: { 
    title: '#예술가형',
    name: '괴짜 거북이',
    description: '등껍질 위에 낙서를 잔뜩 해놓고 다니는 예술가 기질의 거북이입니다.',
    date: '2025.10.20',
    image: card9
  },
  10: { 
    title: '#활력형',
    name: '힙한 하마',
    description: '헤드폰을 끼고 로파이 음악을 들으며 쿨함을 시전하는 감성적 하마입니다.',
    date: '2025.10.19',
    image: card10
  },
  11: { 
    title: '#차분형',
    name: '침착한 침팬지',
    description: '어지러운 세상 속에서도 늘 한 걸음 뒤에서 상황을 지켜보는 침팬지입니다.',
    date: '2025.10.18',
    image: card11
  }
};

// 필터링된 카드 목록
const filteredCards = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    return cardData; 
  }

  return Object.fromEntries(
    Object.entries(cardData).filter(([id, card]) => {
      const titleMatch = card.title.toLowerCase().includes(query);
      const nameMatch = card.name.toLowerCase().includes(query);
      const dateMatch = card.date.includes(query);
      return titleMatch || nameMatch || dateMatch;
    })
  );
});

// 태그 클릭
function filterByTag(tagTitle) {
  searchQuery.value = tagTitle;
}

// 카드 클릭
function handleCardClick(cardId) {
  if (cardData[cardId]) {
    const card = cardData[cardId];
    openDialog(
      card.title,
      `[${card.name}]<br>${card.description}`
    );
  } else {
    console.warn(`cardData에 ID '${cardId}'가 없습니다.`);
  }
}

// 다시 시작
function handleClickRestartBtn() {
  console.log("emitting restart-analyze event.");
  localStorage.setItem('serviceStatus', 'restart');
  localStorage.setItem('moodimalResult', null);
  localStorage.setItem('ocrResult', null);
  emit('restart-analyze'); 
}

// 다이얼로그
function openDialog(title, text, onConfirm = null) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}
</script>

<style scoped>
/* 페이지 헤더 */
.page-title {
  color: #000000;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.3px;
}

/* 검색창 */
.search-input {
  font-size: 14px;
  letter-spacing: -0.3px;
}

/* 무디멀 카드 */
.moodimal-card {
  background: #FFFFFF;
  overflow: hidden;
  margin-top: 4px; 
  margin-bottom: 4px; 
  cursor: pointer;
  width: 100%; /* [수정] 정렬을 위해 너비 100% 설정 */
}

.card-image {
  border-radius: 18px;
}

/* 태그 버튼 (카드 상단) */
.date-btn {
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-transform: none;
  box-shadow: none !important;
  cursor: pointer; 
  /* [수정] display: block 및 margin 제거 */
}

/* 다시 시작하기 버튼 */
.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* margin-32 클래스 */
.margin-32 {
  margin-top: 32px;
}

/* 다이얼로그 텍스트 */
.text-title {
  font-size: 19.5px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.5px;
}

.text-subtitle {
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
  color: #404040;
}

/* 날짜 텍스트 (카드 하단) */
.link-label {
  text-decoration: none;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.3px;
  color: #888888;
  margin-top: 8px; 
  display: block;
  /* [수정] text-align: center, padding-left: 0 */
  text-align: center;
  padding-left: 0;
  text-transform: none;
}
</style>