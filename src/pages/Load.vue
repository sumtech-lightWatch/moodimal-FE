<template>
  <BoxContainer>
    <SubTitle 
      :title="title" :desc="desc"
    ></SubTitle>
    <v-row 
      v-if="loading" 
      no-gutters justify="center" align-content="center" 
      style="min-height: 300px; min-width: 300px;"
    >
      <v-progress-circular
        indeterminate
        color="#FF794C"
        size="64"
        class="progress-circular"
      ></v-progress-circular>
    </v-row>
    <v-row no-gutters justify="center" width="300px" 
      style="min-height: 300px; min-width: 300px; 
      align-items: center;"
      class="elevation-6"
      v-else="loading" 
    >
      <div ref="captureRef"  class="hidden-capture-area">
        <ImageFrame :survey="survey"></ImageFrame>
      </div>
      <v-img
        :src="capturedImage"
        aspect-ratio="1/1"
        cover
      ></v-img>
    </v-row>
    <v-row no-gutters justify="center | mt-3 | mb-8">
      <v-chip
        prepend-icon="mdi-arrow-up"
        append-icon="mdi-arrow-up"
        variant="text"
        color="#FF794C"
        class="chip-text"
      >
        꾹 눌러 저장하기
      </v-chip>
    </v-row>

    <v-row no-gutters justify="center" class="margin-48 | pl-14 | pr-14">
      <v-btn 
        @click="downloadImage(capturedImage)"
        color="#FFFFFF" rounded="xl" width="100%"
        class="w-text-btn"
      >
        이미지 다운로드
      </v-btn>
    </v-row>
    <v-row no-gutters justify="center" class="margin-48 | pl-14 | pr-14 | pt-2">
      <v-btn 
        @click="handleClickFixBtn"
        color="#FF794C" rounded="xl" width="100%"
        class="text-btn"
      >
        설문 수정하기
      </v-btn>
    </v-row>

    <v-row no-gutters>    
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-subtitle | mb-1 | margin-top-96"
        >
          둥지동지를 제작한
        </v-col>
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-title | mb-6"
        >
         <칸타르동방구함위원회> 를 소개합니다
        </v-col>
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-subtitle | mb-5"
          v-html="ourInfo"
        >
        </v-col>
    </v-row>
    <v-row no-gutters justify="center" class="margin-48 | pl-14 | pr-14">
      <v-btn 
        @click="handleClickRestartBtn"
        color="#FF794C" rounded="xl" width="100%"
        class="text-btn"
      >
        처음부터 다시하기
      </v-btn>
    </v-row>

    <v-row no-gutters justify="center" class="margin-48 | mt-4 | mb-8 | pl-14 | pr-14">
      <v-btn 
        @click="handleClickCopyBtn"
        color="#FFFFFF" rounded="xl" width="100%" 
        class="w-text-btn"
      >
        <img src="@/assets/logo.svg" alt="Roommate Search" style="height: 26px; width: 64px; margin-right: 4px;">
        알리기
      </v-btn>  
    </v-row>
    <v-row no-gutters justify="center" class="mb-12 | pl-5 | pr-5">
      <v-col cols="auto">
        <v-btn variant="text" density="compact" href="https://github.com/Ebee1205/DungDong?tab=readme-ov-file#-%EC%9E%91%EC%97%85%EA%B8%B0" target="_blank" class="link-label | mr-3">
          둥동 작업기
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" density="compact" href="https://github.com/Ebee1205/DungDong?tab=readme-ov-file#-%ED%95%A8%EA%BB%98%ED%95%9C-%EC%82%AC%EB%9E%8C%EB%93%A4" target="_blank" class="link-label">
          제작자 소개
        </v-btn>
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

import html2canvas from "html2canvas";
import Util from "@/common/Util.js"

import BoxContainer from "@/components/BoxContainer.vue";
import ImageFrame from "@/components/ImageFrame.vue";

const emit = defineEmits(['restart-survey', 'fix-survey']);

const title = '짜잔! 결과 이미지가 나왔어요.'
const desc = '이미지를 저장하고 공유하여<br>마음에 맞는 룸메이트를 구해보세요.'
const ourInfo = '안녕하세요, 둥지동지를 제작한 예술공학부 동아리 칸타르 소속의 <b><칸타르동방구함위원회></b> 입니다.<br><br>둥지동지는 룸메이트를 빠르고 편하게 구할 수 있게 하기 위해 기획한 프로젝트입니다.<br><br>제작에 도움을 주신 예공 친구들에게 감사드리며, 모두 좋은 룸메이트를 찾으시길 바랍니다.<br>새해 복 많이 받으세요!'

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const loading = ref(false); // 로딩 상태 관리
const captureRef = ref(null); // 캡처할 컴포넌트의 참조
const capturedImage = ref(''); // 캡처된 이미지의 URL 저장

const toastMessage = ref("");
const showToast = ref(false); 

const survey = ref({
  title:  null,
  titleId:  "",
  dorm:  null,
  birth: null,
  studentId: null,
  college: "",
  collegeId: 0,
  mbti: "",
  smoke: null,
  drink: "00-0-00",
  sdEtc: "",
  wakeUp: "",
  lightOff: "",
  bedTime: "",
  sleepHabit: 0,
  clean: 0,
  bug: 0,
  eatIn: 0,
  noise: 0,
  share: 0,
  home: 0,
  tags: [],
  notes: "",
  selectTag: []
});

const parsedSurvey = ref(null)

const colorMap = {
    '예지 1동': '#FF45CA', 
    '예지 2동': '#FD9301', 
    '예지 3동': '#00CA8E', 
    '명덕 1동': '#FF435C', 
    '명덕 2동': '#0E6BEC', 
    '명덕 3동': '#19BE00', 
};

// ----- 라이프 사이클 ----- //
onBeforeMount(() => {
});


onMounted(async () => {
  loadSurveyData();
  await nextTick(); // DOM이 렌더링 완료된 후 실행
  startCaptureProcess();
  intervalId = setInterval(updateAd, 3000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
})

// ----- 함수 정의 ----- //
function loadSurveyData() {
  const existingSurvey = localStorage.getItem('userSurvey');
  console.log('get existingSurvey', existingSurvey);

  if (existingSurvey) {
    parsedSurvey.value = JSON.parse(existingSurvey);
  
    // 데이터 매핑 및 할당
    survey.value.dorm = parsedSurvey.value.dorm;
    survey.value.color = colorMap[survey.value.dorm] || '#FF794C';
    survey.value.birth = parsedSurvey.value.birth
      ? parsedSurvey.value.birth === 0
        ? "비공개"
        : String(parsedSurvey.value.birth).slice(-2)
      : "비공개";
    survey.value.studentId = parsedSurvey.value.studentId
      ? parsedSurvey.value.studentId === 0
        ? "비공개"
        : String(parsedSurvey.value.studentId).slice(-2)
      : "비공개";
    survey.value.college ="";
    survey.value.collegeId = parsedSurvey.value.college || 0;
    survey.value.mbti = parsedSurvey.value.mbti || "선택안함";
    survey.value.smoke = "";
    survey.value.drink = "";
    survey.value.sdEtc = parsedSurvey.value.sdEtc || "";
    survey.value.wakeUp = parsedSurvey.value.wakeUp || "00:00";
    survey.value.lightOff = parsedSurvey.value.lightOff || "00:00";
    survey.value.bedTime = parsedSurvey.value.bedTime || "00:00";
    survey.value.sleepHabit = "";
    survey.value.clean = parsedSurvey.value.clean || 0; // 낮을수록 깨끗, 높을수록 더럽
    survey.value.bug = parsedSurvey.value.bug || 0; // 낮을수록 못잡음, 높을수록 잘잡음
    survey.value.eatIn = parsedSurvey.value.eatIn || 0; // 낮을수록 더럽, 높을수록 깨끗
    survey.value.noise = parsedSurvey.value.noise || 0; //낮을수록 예민, 높을수록 덤덤
    survey.value.share = parsedSurvey.value.share || 0; // 낮을수록 개인물품만 사용, 높을수록 공동사용
    survey.value.home = parsedSurvey.value.home || 0; // 낮을수록 자주 집에감, 높을수록 학교에 오래 있음
    survey.value.notes = parsedSurvey.value.notes || "";
    survey.value.selectTag = parsedSurvey.value.selectTag || []; // 적을수록 덤덤, 높을수록 예민

    const titleInfo = "";
    survey.value.title = titleInfo.title;
    survey.value.titleId = titleInfo.titleId;

    console.log('set and parse survey object', survey.value);
  }
}

// 설문 수정
function handleClickFixBtn() {
  localStorage.setItem('surveyId', null);
  console.log("emitting fix-survey event.");
  emit('fix-survey'); 
}

// 다시 시작
function handleClickRestartBtn() {
  openDialog(
    '설문 다시하기',
    '설문을 다시 시작합니다.<br>처음으로 가면 되돌릴 수 없어요.', 
    () => {
        console.log("emitting restart-survey event.");
        localStorage.setItem('appInitialized', 'false');
        emit('restart-survey'); 
      }
    )
}

// 이미지 캡처 및 다운로드 //
// 캡처 프로세스 시작 함수
async function startCaptureProcess() {
  loading.value = true; // 로딩 시작
  await captureAndSetImage(); // 캡처 실행
  loading.value = false; // 로딩 종료
}

async function captureAndSetImage() {
  if (!captureRef.value) {
    console.error("캡처할 요소가 존재하지 않습니다.");
    toastMessage.value = "캡처할 요소가 없습니다.";
    showToast.value = true;
    return;
  }

  try {
    const canvas = await html2canvas(captureRef.value, {
      allowTaint: true,
      useCORS: true, 
      scale: window.devicePixelRatio || 2, // 고해상도 지원
      logging: true,  
      width: captureRef.value.offsetWidth,  
      height: captureRef.value.offsetHeight
    });

    const dataUrl = canvas.toDataURL("image/png");
    capturedImage.value = dataUrl; // Vue 상태 업데이트

    console.log("캡처 완료 및 Base64 URL 생성");

  } catch (error) {
    console.error("캡처 중 오류 발생:", error.message);
    toastMessage.value = "캡처 중 오류가 발생했습니다.";
    showToast.value = true;
  }
}

async function downloadImage(dataUrl) {
  if (!dataUrl) {
    console.error("이미지 데이터가 없습니다.");
    toastMessage.value = "다운로드할 이미지가 없습니다.";
    showToast.value = true;
    return;
  }

  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "dung-dong-result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toastMessage.value = "이미지 다운로드가 시작되었습니다.";
    showToast.value = true;

  } catch (error) {
    console.error("이미지 다운로드 중 오류 발생:", error);
    toastMessage.value = "이미지 다운로드에 실패했습니다.";
    showToast.value = true;
  }
}



// 클립보드에 이미지 복사
async function handleClickCopyBtn() {
  const textToCopy = `[🦉둥지동지🐥]\n한 장의 이미지로 룸메이트 구하기!\nhttps://ebee1205.github.io${import.meta.env.BASE_URL}`;
  try {
    await navigator.clipboard.writeText(textToCopy);
    console.log('Text copied to clipboard');
    openDialog(
    `클립보드에 복사됨`,
    `[🦉둥지동지🐥]<br>한 장의 이미지로 룸메이트 구하기!<br>https://ebee1205.github.io${import.meta.env.BASE_URL}`,
    )
  } catch (err) {
    console.error('Failed to copy text: ', err);
    openDialog('클립보드 복사 실패', '해당 브라우저에서는 클립보드 복사를 지원하지 않습니다.');
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
    showToast.value = false; // 상태를 false로 리셋
    console.log("Snackbar 닫힘");
  }
}

</script>

<style scoped>
.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.w-text-btn {
  color: #000;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.5px;
}

.hidden-capture-area {
  position: absolute;
  top: -99999px;
  left: -99999px;
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

.margin-top-96 {
  margin-top: 56px;
}

.text-label-container {
  margin-top: 56px;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
}

.text-label {
  color: #B1B1B1;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.3px;
}

.link-label {
  text-decoration: underline;
  font-size: 15x;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
  color: #404040;
  cursor: pointer;
}

.chip-text {
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
}
</style>