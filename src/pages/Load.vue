<template>
  <BoxContainer>
    <SubTitle 
      :title="title" :desc="desc"
    ></SubTitle>

    <v-row no-gutters class="justify-center">
      <v-col no-gutters
          style="
            width: 308px; min-width: 308px; max-width: 308px; 
            height: 420px; min-height: 412px; max-height: 420px; 
          "
        >

          <!-- <v-row 
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
          </v-row> -->
          <ImageFrame :result="result" :loading="loading"></ImageFrame>

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

const emit = defineEmits(['restart-analyze']);

const title = '짜잔! 결과 이미지가 나왔어요.'
const desc = '당신의 SNS 무디멀 유형은?<br>이미지를 저장하고 공유하세요.'
const ourInfo = '안녕하세요, 둥지동지를 제작한 예술공학부 동아리 칸타르 소속의 <b><칸타르동방구함위원회></b> 입니다.<br><br>둥지동지는 룸메이트를 빠르고 편하게 구할 수 있게 하기 위해 기획한 프로젝트입니다.<br><br>제작에 도움을 주신 예공 친구들에게 감사드리며, 모두 좋은 룸메이트를 찾으시길 바랍니다.<br>새해 복 많이 받으세요!'

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const loading = ref(true); // 로딩 상태 관리
const captureRef = ref(null); // 캡처할 컴포넌트의 참조
const capturedImage = ref(''); // 캡처된 이미지의 URL 저장

const toastMessage = ref("");
const showToast = ref(false); 

const result = ref({
  title:  null,           // 기숙사 숫자 int
  img: "",              // 생성된 이미지 URL
});

const parsedSurvey = ref(null)

// ----- 라이프 사이클 ----- //
onBeforeMount(() => {
});


onMounted(async () => {
  loadSurveyData();
  await nextTick(); // DOM이 렌더링 완료된 후 실행
});

onUnmounted(() => {

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

// 다시 시작
function handleClickRestartBtn() {
  openDialog(
    '설문 다시하기',
    '설문을 다시 시작합니다.<br>처음으로 가면 되돌릴 수 없어요.', 
    () => {
        console.log("emitting restart-analyze event.");
        localStorage.setItem('surveyId', null);
        localStorage.setItem('appInitialized', 'false');
        emit('restart-analyze'); 
      }
    )
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
  opacity: 1;
  pointer-events: none;
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