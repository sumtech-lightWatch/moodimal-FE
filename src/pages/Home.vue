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


    <v-row no-gutters justify="start">
      <v-label>단과대를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF794C" color="#FF794C" item-color="#FF794C"
        :items="collegeItem"
        v-model="college"
      ></v-select>
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
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import { el } from "vuetify/locale";

const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey']);


// ----- 라이프 사이클 ----- //
onMounted(() => {
  emit('hide-appbar'); 

  setCurrentSurvey();

});

onUnmounted(() => {

})



// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
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

</style>