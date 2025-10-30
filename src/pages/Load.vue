<template>
  <BoxContainer>
    <SubTitle 
      :title="title" :desc="desc"
    ></SubTitle>

    <v-row no-gutters class="justify-center | mt-9">
      <v-col no-gutters>
          <!-- 이미지 스캔 애니메이션 -->
          <div class="image-scan-container">
            <img 
              src="https://placehold.co/600x400" 
              alt="Sample Image"
              class="scan-image"
            />
            <div class="scan-line"></div>
            <div class="scan-overlay"></div>
          </div>
      </v-col>
    </v-row>
    
    <v-row no-gutters class="justify-center | mt-6">
      <v-col class="info-text-container">
        <transition name="slide-fade" mode="out-in">
          <div :key="currentTextIndex" class="info-text">
            {{ infoTexts[currentTextIndex] }}
          </div>
        </transition>
      </v-col>
    </v-row>

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


  <!-- 스낵바 -->
  <v-snackbar
    v-model="showToast"
    :timeout="3000"
    color="white"
    rounded="pill"
    class="mb-12"
    @update:model-value="handleSnackbarClose"
  >
    <v-icon color="info" icon="mdi-information" class="mr-2"></v-icon>
    {{ toastMessage }}
  </v-snackbar>

</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, onBeforeMount, ref, nextTick} from "vue";

import axios from "axios";

import Util from "@/common/Util.js"

import BoxContainer from "@/components/BoxContainer.vue";

const emit = defineEmits(['restart-analyze']);

const title = '이미지 분석 중...'
const desc = '당신의 SNS 무디멀 유형은?<br>SNS 이미지를 분석하고 있어요.'

// TODO UX라이팅 순환할 텍스트 배열
const infoTexts = ref([
  "침착한 침팬지는 무리 속에서 드물게 발견되는 안정적인 개체입니다...",
  "당신의 SNS 패턴을 분석하고 있습니다...",
  "게시물의 감정 톤을 파악하고 있습니다...",
  "해시태그 사용 패턴을 분석 중입니다...",
  "당신만의 특별한 스타일을 찾고 있습니다...",
  "거의 다 됐어요! 조금만 기다려주세요...",
  "분석이 완료되었습니다!"
]);

const currentTextIndex = ref(0);
let textInterval = null;

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const loading = ref(true); // 로딩 상태 관리

const toastMessage = ref("");
const showToast = ref(false); 

const result = ref({
  title:  null,
  img: "",
});

const parsedSurvey = ref(null)

// ----- 라이프 사이클 ----- //
onBeforeMount(() => {
});


onMounted(async () => {
  loadSurveyData();
  await nextTick();
  
  // 텍스트 전환 시작 (2초마다)
  textInterval = setInterval(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % infoTexts.value.length;
  }, 2000);
  
  // 로딩 종료 시간 설정 (필요시 조정)
  setTimeout(() => {
    loading.value = false;
    if (textInterval) {
      clearInterval(textInterval);
    }
  }, 16000); // 텍스트 8개 * 2초
});

onUnmounted(() => {
  // 인터벌 정리
  if (textInterval) {
    clearInterval(textInterval);
  }
})

// ----- 함수 정의 ----- //
function loadSurveyData() {
  const existingSurvey = localStorage.getItem('userSurvey');
  console.log('get existingSurvey', existingSurvey);

  if (existingSurvey) {
    parsedSurvey.value = JSON.parse(existingSurvey);
  
    const titleInfo = "";
    result.value.title = titleInfo.title;

    console.log('set and parse result object', result.value);
  }
}

// 다이얼로그 유틸
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}

// 스낵바 유틸
function handleSnackbarClose(value) {
  if (!value) {
    showToast.value = false;
    console.log("Snackbar 닫힘");
  }
}

</script>

<style scoped>
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

.info-text-container {
  margin-left: 36px;
  margin-right: 36px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
  color: #FF794C;
  line-height: 1.5;
}

/* 텍스트 전환 애니메이션 */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* 이미지 스캔 애니메이션 스타일 */
.image-scan-container {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.scan-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(
    to bottom,
    transparent,
    #FF794C 50%,
    transparent
  );
  box-shadow: 0 0 20px #FF794C, 0 0 40px #FF794C;
  animation: scan 5s linear infinite;
  z-index: 2;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 121, 76, 0.1) 0%,
    transparent 50%,
    transparent 100%
  );
  animation: scan 5s linear infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(400px);
  }
}
</style>