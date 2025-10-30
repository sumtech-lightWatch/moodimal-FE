<template>
  <v-container>
    <v-row no-gutters justify="center" class="margin-88 | margin-top-100">
      <v-img 
      src="@/assets/logo.svg"
      :width="240" :height="80"
      min-width="240px" min-height="80px" 
      ></v-img>
    </v-row>
    <v-row no-gutters justify="center" class="margin-88px | mt-2">
      <v-col class="title-text-sub">
        한 장의 이미지로 룸메이트 구하기!
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="cards-section | mt-12 | mb-12">
      <v-col cols="12" class="d-flex | justify-center">
        <div class="cards-track">
          <v-card
            v-for="i in 3"
            :key="i"
            class="card | floating-card"
            :style="{ animationDelay: `${i * 0.8}s`, animationDuration: `${5 + i}s` }"
            elevation="8"
            rounded="xl"
          >
            <img :src="cards[i-1]" alt="" class="card-img" />
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="mt-1">
      <v-file-input
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF794C" color="#FF794C" item-color="#FF794C"
        label="SNS 캡처 화면을 업로드 해주세요"
        v-model="uploadedFile"
        prepend-icon=""
        append-inner-icon="mdi-camera"
        accept="image/*"
      ></v-file-input>
    </v-row>
    
    <v-row 
      no-gutters justify="center" class="margin-42 | mt-2"
    >
      <v-btn 
        @click="handleClickStartBtn"
        variant="flat" color="#FF794C" rounded="xl" size="large" width="80%" height="32px"
        class="text-small-btn"
      >
        결과확인하기
      </v-btn>
    </v-row>
  </v-container>

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
              <!-- <v-btn color="#FF794C" width="25%" rounded="xl" variant="outlined" @click="dialog.dialogActive = false">취소</v-btn> -->
              <v-btn color="#FF794C" width="25%" rounded="xl" variant="flat" class="ml-2" @click="dialog.okButton">확인</v-btn>
          </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>


<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(['hide-appbar', 'loading-result', 'restart-survey']);


import card1 from '@/assets/card_1.png';
import card2 from '@/assets/card_2.png';
import card3 from '@/assets/card_3.png';
const cards = [card1, card2, card3];

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const uploadedFile = ref(null);   
const uploading = ref(false);    

// TODO 최초 시작시 초기화
onMounted(() => {
  emit('hide-appbar');
});

// ----- 함수 정의 ----- //

const VALID_STATUS = ['home', 'ocr', 'analyze', 'result'];
function setServiceStatus(status) {
  if (VALID_STATUS.includes(status)) {
    localStorage.setItem('serviceStatus', status);
  } else {
    console.warn(`[serviceStatus] invalid value: ${status}`);
  }
}

async function handleClickStartBtn() {
  const file = Array.isArray(uploadedFile.value)
    ? uploadedFile.value?.[0]
    : uploadedFile.value;

  // 파일이 없을 때 안내
  if (!file) {
    openDialog(
      '이미지를 업로드해 주세요',
      'SNS 캡처 이미지를 선택한 뒤 <b>결과확인하기</b>를 눌러주세요.',
      () => { dialog.value.dialogActive = false; }
    );
    return;
  }

  if (uploading.value) return;
  uploading.value = true;

  try {
    // 상태를 'ocr'로 (업로드 → OCR 단계)
    setServiceStatus('ocr');

    // 로딩 화면으로 이동
    router.push("/loading");

    // OCR 요청
    const tid = Date.now();
    await generateOcrText(file, tid);

    // OCR 완료 후엔 분석 단계로 진입할 수 있도록 상태를 'analyze'로
    setServiceStatus('analyze');

  } catch (error) {
    console.error('파일 처리 실패:', error);

  } finally {
    uploading.value = false;
  }
}

// generate/ocr/text
async function generateOcrText(file, tid) {
  const formData = new FormData();
  formData.append('tid', String(tid));
  formData.append('file', file);

  const url = '/api/v1/generate/ocr/text'; // Vite proxy 사용 시
  const res = await fetch(url, { method: 'POST', body: formData });
  const result = await res.json();

  // - result가 문자열이면 그대로, 객체면 JSON 문자열로 저장
  const value = typeof result === 'string' ? result : JSON.stringify(result);
  localStorage.setItem('ocrResult', value);
}

// 다이얼로그 유틸
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}


</script>
<style scoped>

/* 토글 버튼 아이콘 색상 */
:deep(.v-input__control .v-icon) {
  color: #FF794C !important; /* 아이콘 색상 */
}

:deep(.v-label) {
  color: #1B1818;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.padding-0 {
  padding: 0px;
}

.margin-top-52 {
  margin-top: 52px;
}

.margin-top-100 {
  margin-top: 100px;
}

.margin-42 {
  margin-left: 42px;
  margin-right: 42px;
}

.margin-top-56 {
  margin-top: 56px;
}

.margin-88 {
  margin-left: 88px;
  margin-right: 88px;
}

.title-text-sub {
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.5px;
}

.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.text-small-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.4px;
}

.text-btn:hover {
  transform: scale(1.05);
}

.card-title-text {
  padding-left: 8px;
  color: #1B1818 !important; /* 아이콘 색상 */
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.text-title {
    font-size: 19.5px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.5px;
}

.text-subtitle {
    font-size: 15x;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.4px;
    color: #404040;
}

/* ===== 카드 섹션 ===== */
.cards-section {
  margin-top: 20px;
  width: 100%;
  /* overflow-x: hidden; <-- 제거됨 */
}

/* 카드 트랙 — 항상 중앙 정렬 & 모바일 기준 폭 유지 */
.cards-track {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
  overflow-x: auto; /* hidden -> auto 또는 제거 */
  padding: 6px 10px;
  width: 100%; /* 468px -> 100% */
}

/* 카드 — 모바일 크기 기준 (항상 작게) */
.card {
  /* flex: 0 0 auto; <-- 제거됨 */
  border-radius: 12px;
  background: #fff;
  scroll-snap-align: start;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.card-img {
  display: block;
  width: 100%; /* 추가됨 */
  height: auto; /* 추가됨 */
  border-radius: 12px;
}

/* --- 수정된 스타일 --- */
/* 개별 카드 '비율' 설정 */
.card:nth-child(1) {
  flex: 0 1 31.4%; /* 137 / 436 */
}

.card:nth-child(2) {
  flex: 0 1 37.2%; /* 162 / 436 */
}

.card:nth-child(3) {
  flex: 0 1 31.4%; /* 137 / 436 */
}
/* --- --- */


/* 둥둥 떠다니는 애니메이션 */
.floating-card {
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transition: transform 0.3s ease;
  will-change: transform;
}
.floating-card:hover {
  transform: scale(1.05);
}

@keyframes float {
  0%   { transform: translateY(0px) rotate(-1deg); }
  50%  { transform: translateY(-12px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(-1deg); }
}

</style>