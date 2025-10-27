<template>
  <v-container>
    <v-row no-gutters justify="center" class="margin-88 | margin-top-100">
      <v-img 
      src="@/assets/logo.svg"
      :width="207" :height="71"
      min-width="207px" min-height="72px" 
      ></v-img>
    </v-row>
    <v-row no-gutters justify="center" class="margin-88px | mt-2">
      <v-col class="title-text-sub">
        한 장의 이미지로 룸메이트 구하기!
      </v-col>
    </v-row>


    <v-row no-gutters justify="start">
      <v-label>단과대를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858"
        :items="collegeItem"
        v-model="college"
      ></v-select>
    </v-row>
    <!-- <v-card
      class="mx-auto | margin-top-56 | pt-2 pl-4 pr-4"
      max-width="320" rounded="lg"
    >
      <v-card-title class="card-title-text">
        <v-icon icon="mdi-information | pb-1 | mr-1"></v-icon>
        응답내용 수집 안내
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div style="text-align: left; letter-spacing: -0.5px;">
          본 서비스는 품질 향상과 인사이트 도출을 위해 
          응답을 수집하여 통계 및 분석에 활용합니다. 
          <br>위 내용은 해당 목적 외에는 사용되지 않으며, 
          관련 법령을 준수하여 안전하게 관리됩니다.
        </div>
      </v-card-text>
    </v-card> -->
    
    <v-row 
      no-gutters justify="center" class="margin-42 | mt-2"
    >
      <v-btn 
        @click="handleClickStartBtn"
        variant="flat" color="#FF6161" rounded="xl" size="large" width="80%" height="32px"
        class="text-small-btn"
      >
        직접 체크하여 제작
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import { el } from "vuetify/locale";

const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey', 'continue-survey']);


// ----- 라이프 사이클 ----- //
onMounted(() => {
  emit('hide-appbar'); 
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 0}));
  console.log("set localStorage userProgress:", localStorage.getItem('userProgress'));

  setCurrentSurvey();

});

onUnmounted(() => {

})



// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 1}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

// 설문 시작
function handleClickStartBtn() {
  localStorage.setItem('appInitialized', 'false');
  localStorage.setItem('surveyId', null);
  console.log("emitting start-survey event.");
  emit('start-survey');
}


</script>

<style scoped>

/* 토글 버튼 아이콘 색상 */
:deep(.v-input__control .v-icon) {
  color: #FF5858 !important; /* 아이콘 색상 */
}

:deep(.v-label) {
  color: #000000;
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
  color: #000000 !important; /* 아이콘 색상 */
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

</style>