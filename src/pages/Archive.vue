<template>
  <BoxContainer>
    <!-- 헤더 -->
    <v-row no-gutters justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <div class="page-title">Moodimal Archive</div>
        <div class="page-subtitle">당신의 무디멀 여정을 돌아봐요</div>
      </v-col>
    </v-row>

    <!-- 검색창 -->
    <v-row no-gutters justify="center" class="mb-4 px-4">
      <v-text-field
        v-model="searchQuery"
        placeholder='ex. "거북이" 또는 날짜 입력'
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

    <!-- 카드 그리드 -->
    <v-row no-gutters class="px-4 mb-6">
      <!-- 카드 1 -->
      <v-col cols="6" class="pa-2">
        <v-card class="moodimal-card" rounded="xl" elevation="2">
          <v-img
            :src="card1"
            alt="무디멀 카드"
            width="100%"
            aspect-ratio="0.745"
            cover
            class="card-image"
          ></v-img>
        </v-card>
        <v-btn
          @click="handleCardClick(1)"
          color="#FF794C"
          rounded="pill"
          width="100%"
          height="36"
          class="date-btn"
          elevation="0"
        >
          2025.10.28 생성됨
        </v-btn>
      </v-col>

      <!-- 카드 2 -->
      <v-col cols="6" class="pa-2">
        <v-card class="moodimal-card" rounded="xl" elevation="2">
          <v-img
            :src="card2"
            alt="무디멀 카드"
            width="100%"
            aspect-ratio="0.745"
            cover
            class="card-image"
          ></v-img>
        </v-card>
        <v-btn
          @click="handleCardClick(2)"
          color="#FF794C"
          rounded="pill"
          width="100%"
          height="36"
          class="date-btn"
          elevation="0"
        >
          2025.10.27 생성됨
        </v-btn>
      </v-col>

      <!-- 카드 3 -->
      <v-col cols="6" class="pa-2">
        <v-card class="moodimal-card" rounded="xl" elevation="2">
          <v-img
            :src="card3"
            alt="무디멀 카드"
            width="100%"
            aspect-ratio="0.745"
            cover
            class="card-image"
          ></v-img>
        </v-card>
        <v-btn
          @click="handleCardClick(3)"
          color="#FF794C"
          rounded="pill"
          width="100%"
          height="36"
          class="date-btn"
          elevation="0"
        >
          2025.10.26 생성됨
        </v-btn>
      </v-col>
    </v-row>

    <!-- 다시 시작하기 버튼 (End.vue와 동일) -->
    <v-row no-gutters justify="center" class="margin-32 | pl-14 | pr-14 | pt-2">
      <v-btn 
        @click="handleClickRestartBtn"
        color="#FF794C" 
        rounded="xl" 
        width="100%"
        class="text-btn"
      >
        처음부터 다시하기
      </v-btn>
    </v-row>

    <!-- 푸터 링크 (End.vue와 동일) -->

  </BoxContainer>

  <!-- 다이얼로그 -->
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
import { ref } from 'vue';
import BoxContainer from '@/components/BoxContainer.vue';

// 이미지 import - card_1.png, card_2.png, card_3.png
import card1 from '@/assets/card_1.png';
import card2 from '@/assets/card_2.png';
import card3 from '@/assets/card_3.png';

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
    title: '#차분형',
    name: '침착한 침팬지',
    description: '어지러운 세상 속에서도 늘 한 걸음 뒤에서 상황을 지켜보는 침팬지입니다.'
  },
  2: {
    title: '#활력형',
    name: '힙한 하마',
    description: '헤드폰을 끼고 로파이 음악을 들으며 쿨함을 시전하는 감성적 하마입니다.'
  },
  3: {
    title: '#예술가형',
    name: '괴짜 거북이',
    description: '등껍질 위에 낙서를 잔뜩 해놓고 다니는 예술가 기질의 거북이입니다.'
  }
};

// 카드 클릭 시 팝업
function handleCardClick(cardId) {
  const card = cardData[cardId];
  openDialog(
    card.title,
    `[${card.name}]<br>${card.description}`
  );
}

// 다시 시작
function handleClickRestartBtn() {
  console.log("emitting restart-analyze event.");
  localStorage.setItem('serviceStatus', 'restart');
  localStorage.setItem('moodimalResult', null);
  localStorage.setItem('ocrResult', null);
  emit('restart-analyze'); 
}

// 다이얼로그 유틸
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

/* 검색창 - placeholder 진하게 */
.search-input {
  font-size: 14px;
  letter-spacing: -0.3px;
}

/* 무디멀 카드 */
.moodimal-card {
  background: #FFFFFF;
  overflow: hidden;
  margin-bottom: 8px;
}

.card-image {
  border-radius: 18px;
}

/* 날짜 버튼 (카드 외부) */
.date-btn {
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-transform: none;
  box-shadow: none !important;
}

/* 다시 시작하기 버튼 - End.vue와 동일 */
.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* margin-32 클래스 - 버튼 위로 올림 */
.margin-32 {
  margin-top: 32px;
}

/* 푸터 링크 - End.vue와 동일 */
.link-label {
  text-decoration: underline;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
  color: #404040;
  cursor: pointer;
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
</style>