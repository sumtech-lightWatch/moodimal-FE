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
              :src="imageSrc" 
              alt="Uploaded preview"
              class="scan-image"
            />
            <div class="scan-line" :style="{ '--scan-height': imageHeight + 'px' }"></div>
            <div class="scan-overlay" :style="{ '--scan-height': imageHeight + 'px' }"></div>
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
import { onMounted, onUnmounted, onBeforeMount, ref, nextTick } from "vue";
import { useRouter } from "vue-router"; 

import axios from "axios";
import Util from "@/common/Util.js"

import BoxContainer from "@/components/BoxContainer.vue";

const emit = defineEmits(['restart-analyze']);

const router = useRouter(); 

const title = '이미지 분석 중...'
const desc = '당신의 SNS 무디멀 유형은?<br>SNS 이미지를 분석하고 있어요.'

// TODO UX라이팅 순환할 텍스트 배열
const infoTexts = ref([
  "당신의 마음 속 무디멀스를 찾아가고 있어요...",
  "쉿, 당신의 무디멀이 둥지에서 나올 준비를 하고 있어요...",
  "우하하! 당신의 유머 감각을 분석 중이에요...",
  "AI도 커피 한 잔 할 시간이 필요해요... 잠시만요!",
  "아주 흥미로운 표현이네요. 제 알고리즘이 감탄했어요...",
  "당신과 꼭 맞는 무디멀스가 깨어나고 있어요...",
  "이 화면 속 당신의 섬세함을 읽어내는 중..."
]);

const currentTextIndex = ref(0);
let textInterval = null;

const dialog = ref({
  title: '',
  text: '',
  dialogActive: false, 
  okButton() {},
});

const imageSrc = ref('https://placehold.co/600x400');
const imageHeight = ref(400); // 이미지 높이 저장

const loading = ref(true);
const toastMessage = ref("");
const showToast = ref(false); 

// ----- 라이프 사이클 ----- //
onMounted(async () => {

  const saved = sessionStorage.getItem('uploadImg');
  if (saved) {
    imageSrc.value = saved;
    // 이미지 로드 후 높이 계산
    await nextTick();
    const img = new Image();
    img.onload = () => {
      const imgElement = document.querySelector('.scan-image');
      if (imgElement) {
        imageHeight.value = imgElement.offsetHeight;
      }
    };
    img.src = saved;
  }

  // 텍스트 전환 시작 (2초마다)
  textInterval = setInterval(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % infoTexts.value.length;
  }, 2000);

  const text = getOcrTextFromLocalStorage();
  if (!text) {
    openDialog('알림', 'OCR 결과가 없습니다. 처음부터 다시 시도해주세요.', () => {
      dialog.value.dialogActive = false;
      router.push('/'); // 필요 시 시작 화면으로
    });
    return;
  }

  // 2) LLM 분석 호출 → 3) 완료 시 /end로 이동
  try {
    await generateLLMAnalyze(text);
    router.push('/end'); 
  } catch (err) {
    console.error('[Load] LLM 분석 실패:', err);
    openDialog('오류', '결과를 불러오는 중 오류가 발생했습니다.', () => {
      dialog.value.dialogActive = false;
      router.push('/'); // 필요 시 시작 화면으로
    });
  }

  await nextTick();
});

onUnmounted(() => {
  if (textInterval) clearInterval(textInterval);
});

// ----- 함수 정의 ----- //

// OCR 결과에서 텍스트만 뽑기
function getOcrTextFromLocalStorage() {
  try {
    const raw = localStorage.getItem('ocrResult');
    if (!raw) return '';

    // 문자열이면 그대로 시도, JSON이면 파싱
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw; // 순수 텍스트로 저장된 경우
    }

    const text =
      typeof parsed === 'string'
        ? parsed
        : (parsed?.data?.text ?? parsed?.ParsedText ?? parsed?.text ?? '');

    return (text || '').toString().trim();
  } catch (e) {
    console.error('fail get ocrResult:', e);
    return '';
  }
}

// generate/llm/analyze
async function generateLLMAnalyze(text) {
  const tid = Date.now();
  const url = '/api/v1/generate/llm/analyze';
  const payload = { tid, text: String(text || '') };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${msg}`);
  }

  const result = await res.json();

  // status 프로토콜 확인(S0000 아니면 에러 처리)
  const code = result?.status?.code ?? 'E0500';
  if (code !== 'S0000') {
    throw new Error(`API ${code}: ${result?.status?.msg || 'unknown error'}`);
  }

  // result.data만 저장
  const data = result?.data ?? {};
  const value = typeof data === 'string' ? data : JSON.stringify(data);
  localStorage.setItem('moodimalResult', value);
}

// 다이얼로그 유틸
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = typeof onConfirm === 'function' ? onConfirm : () => {};
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
    transform: translateY(var(--scan-height, 400px));
  }
}
</style>