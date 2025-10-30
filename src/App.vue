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
        @loading-result="emitLoadingResult"
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

// ----- 라이프 사이클 ----- //
onMounted(() => {
  console.log(import.meta.env)
  
  if (!localStorage.getItem('serviceStatus')) {
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
  localStorage.setItem('serviceStatus', 'home');
  localStorage.setItem('ocrResult', '');
  localStorage.setItem('moodimalResult', '');
  sessionStorage.setItem('uploadImg', null);

  console.log("init localStorage:", localStorage.getItem('serviceStatus'))
}

function emitHideAppbar() {
  console.log('Event Received: hide appbar');
  sFooter.value = false;
};

function emitLoadingResult() {
  console.log('Event Received: Loading Result');
  router.push("/loading");
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
