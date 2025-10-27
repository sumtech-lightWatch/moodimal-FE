<template>
  <v-app class="background">
    <v-app-bar app color="#FBFBFB" flat height="100" v-if="sAppBar">
      <v-row class="align-center | justify-space-between | padding-32 | padding-top-56 | padding-bottom-16">
        <!-- 로고 -->
        <v-col cols="auto">
          <v-row class="align-center | pl-2">
            <v-img 
            src="@/assets/logo.svg"
            :width="112" :height="36"
            min-width="112px" min-height="36px" 
            ></v-img>
          </v-row>
        </v-col>
        <v-divider class="margin-top-8" />
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view
        @start-survey="emitStartSurvey"
        @restart-analyze="emitRestartAnalyze"
        @hide-appbar="emitHideAppbar"
      ></router-view>
    </v-main>
  </v-app>

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
              <v-btn color="#FF5858" width="25%" rounded="xl" variant="outlined" @click="dialog.dialogActive = false">취소</v-btn>
              <v-btn color="#FF5858" width="25%" rounded="xl" variant="flat" class="ml-2" @click="dialog.okButton">확인</v-btn>
          </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"

import { db } from "@/common/Firebase"; // Firestore 초기화 파일
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; // Firestore 함수

import axios from "axios";

const router = useRouter();
const route = useRoute();

const sFooter = ref(false);
const sAppBar = ref(false);

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const lastDocumentId = ref(null)
const survey = ref({
  title:  null,           // 기숙사 숫자 int
  imageUrl: ""         // 생성된 이미지 URL
});


// ----- 라이프 사이클 ----- //
onMounted(() => {
  console.log(import.meta.env)
  
  if (!localStorage.getItem('appInitialized')) {
    initSurvey();
  }
});

onUnmounted(() => {

});

watch(() => route.path, (path) => {
    // 헤더, 푸터, 앱바 설정
    if (path === "/home" || path === "/") {
      sFooter.value = false;
      sAppBar.value = false;
      
    } else if (path === "/end") {
      sFooter.value = false;
      sAppBar.value = true;

    } else {
      sFooter.value = true;
      sAppBar.value = true;
    }
  },
  { immediate: true }
);

// ----- 함수 정의 ----- //
function initSurvey() {
  localStorage.setItem('appInitialized', 'true');
  localStorage.setItem('userSurvey', JSON.stringify(survey.value));

  console.log("set localStorage appInitialized:", localStorage.getItem('appInitialized'))
}

function handleClickGoPage(state) {
  switch (state) {
    case "home":
      openDialog(
        '처음으로 돌아가기',
        '처음 화면으로 돌아갑니다.<br>현재까지 작성한 내용은 초기화됩니다.',
        emitRestartAnalyze
      )
      break;

    case "finish":
      openDialog(
        '이미지 생성하기',
        '설문조사를 끝내고 이미지를 생성할까요?<br>물론, 다시 돌아와 수정할 수 있습니다.',
        submitSurveyToFB
      )
      break;

    default:
      console.warn("Invalid state:", state);
      break;
  }
};

function emitHideAppbar() {
  console.log('Event Received: hide appbar');
  sFooter.value = false;
};

function emitStartSurvey() {
  console.log('Event Received: Start Survey');
  initSurvey();
  router.push("/end");
};

function emitRestartAnalyze() {
  console.log('Event Received: Restart Survey');
  router.push("/home");
  dialog.value.dialogActive = false;
  initSurvey();
};

function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}

// 파이어베이스
// 신규: 텍스트로 이미지 생성 API를 호출하는 함수
async function generateImageFromText(text) {
  // 로딩 UI 표시 (필요 시)
  console.log("AI 이미지 생성을 시작합니다:", text);

  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const tid = `survey-${Date.now()}`; // 간단한 트랜잭션 ID 생성
    const response = await axios.post(`${baseUrl}/v1/generate/survey`, {
      tid: tid,
      orig_text: text,
    });

    console.log("AI 이미지 생성 완료:", response.data.imageUrl);
    return response.data.imageUrl; // API 응답에서 이미지 URL 반환
  } catch (error) {
    console.error("AI 이미지 생성 실패:", error);
    // 에러 UI 표시 (필요 시)
    return null;
  } finally {
    // 로딩 UI 숨김 (필요 시)
  }
}

// 수정: 파이어베이스 제출 함수
async function submitSurveyToFB() {
  const existingSurvey = localStorage.getItem('userSurvey');
  console.log('get existingSurvey', existingSurvey);

  if (existingSurvey) {
    const parseSurvey = JSON.parse(existingSurvey);

    // 1. TextToImg 페이지에서 입력한 텍스트가 있는지 확인
    if (route.path === '/text2img' && parseSurvey.notes) {
      // 2. 이미지 생성 API 호출
      const generatedUrl = await generateImageFromText(parseSurvey.notes);
      if (generatedUrl) {
        // 3. 반환된 이미지 URL을 survey 객체에 저장
        parseSurvey.imageUrl = generatedUrl;
      }
    }

    // 4. 최종 데이터로 FB에 저장 또는 업데이트
    if (!lastDocumentId.value) {
      await submitSurvey(parseSurvey);
    } else {
      await updateSurvey(parseSurvey);
    }
  } else {
    console.error("No survey data to submit.");
    return;
  }

  dialog.value.dialogActive = false;
  router.push("/end");
}

// 설문 데이터를 Firestore에 저장하는 함수
const submitSurvey = async (survey) => {
  console.log(typeof survey, survey);
  try {
    const docRef = await addDoc(collection(db, "surveys"), survey);
    console.log("Survey submitted successfully with ID:", docRef.id);
    localStorage.setItem('surveyId', docRef.id);
    lastDocumentId.value = docRef.id;  // 문서 ID 저장
  } catch (error) {
    console.error("Error submitting survey:", error);
    localStorage.setItem('surveyId', null);
  }
};

// 문서 ID를 사용하여 해당 문서를 업데이트하는 함수
const updateSurvey = async (updates) => {
  if (!lastDocumentId.value) {
    console.error("No document ID found. Submitting a survey first.");
    return;
  }
  try {
    const surveyRef = doc(db, "surveys", lastDocumentId.value);
    await updateDoc(surveyRef, updates);
    console.log("Survey updated successfully with ID:", lastDocumentId.value);
  } catch (error) {
    console.error("Error updating survey:", error);
  }
};


</script>

<style scoped>

.margin-top-8 {
  margin-top: 8px;
}

.padding-32 {
  padding: 32px;
}

.padding-top-56 {
  padding-top: 56px;
}

.padding-bottom-16 {
  padding-bottom: 16px;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px; /* 원 사이 간격 */
}

.circle {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #B1B1B1; /* 기본 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle.active {
  background-color: #ff5858; /* 현재 단계 배경색 */
}

.line {
  position: absolute;
  width: 17px;
  height: 0.6px;
  background-color: #B1B1B1;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
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


</style>
